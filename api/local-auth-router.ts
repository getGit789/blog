import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { clientIp, hitRateLimit, resetRateLimit } from "./lib/rate-limit";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findLocalUserByUsername,
  findLocalUserById,
  verifyLocalPassword,
  updateLocalUser,
} from "./queries/local-users";
import { signLocalSessionToken, verifyLocalSessionToken } from "./local-auth-session";

/** Five attempts per quarter hour per address, matching the documented policy. */
const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

/** Serializes the session cookie; `maxAge: 0` expires it. */
function sessionCookie(headers: Headers, value: string, maxAgeSeconds: number) {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(Session.cookieName, value, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: maxAgeSeconds,
  });
}

export const localAuthRouter = createRouter({
  me: publicQuery.query(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
    const token = cookies[Session.cookieName];
    if (!token) return null;

    const claim = await verifyLocalSessionToken(token);
    if (!claim) return null;

    const user = await findLocalUserById(claim.userId);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limited before the database is touched, so a flood of guesses does
      // not also mean a flood of bcrypt comparisons.
      const key = `login:${clientIp(ctx.req.headers)}`;
      const limit = hitRateLimit(key, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);
      if (!limit.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Too many login attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
        });
      }

      const user = await findLocalUserByUsername(input.username);
      // The same message for an unknown username and a wrong password, so the
      // response does not reveal which accounts exist.
      const invalid = new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid username or password",
      });
      if (!user) throw invalid;

      const valid = await verifyLocalPassword(user, input.password);
      if (!valid) throw invalid;

      resetRateLimit(key);

      const token = await signLocalSessionToken({
        username: user.username,
        userId: user.id,
      });

      ctx.resHeaders.append(
        "set-cookie",
        sessionCookie(ctx.req.headers, token, Session.maxAgeMs / 1000),
      );

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      };
    }),

  updateCredentials: adminQuery
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newUsername: z.string().min(3).max(100).optional(),
        newPassword: z.string().min(6).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;

      const valid = await verifyLocalPassword(user, input.currentPassword);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      if (input.newUsername && input.newUsername !== user.username) {
        const existing = await findLocalUserByUsername(input.newUsername);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already taken",
          });
        }
      }

      const updated = await updateLocalUser(user.id, {
        username: input.newUsername,
        password: input.newPassword,
      });

      const passwordChanged = !!input.newPassword;
      if (passwordChanged) {
        // A password change ends the session that made it: the cookie is
        // expired server-side and the client is told to log in again. Note
        // this only kills *this* session; see the JWT token-versioning entry
        // in TODO.md for why other live sessions survive until expiry.
        ctx.resHeaders.append("set-cookie", sessionCookie(ctx.req.headers, "", 0));
      } else {
        // Username-only change: re-issue so the claim matches the new username.
        const newToken = await signLocalSessionToken({
          username: updated.username,
          userId: updated.id,
        });
        ctx.resHeaders.append(
          "set-cookie",
          sessionCookie(ctx.req.headers, newToken, Session.maxAgeMs / 1000),
        );
      }

      return {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        role: updated.role,
        sessionEnded: passwordChanged,
      };
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append("set-cookie", sessionCookie(ctx.req.headers, "", 0));
    return { success: true };
  }),
});
