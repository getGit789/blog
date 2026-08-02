export const Session = {
  cookieName: "kimi_sid",
  maxAgeMs: 365 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
} as const;

export const Paths = {
  // Admin sign-in lives under /admin and is reachable by URL only: nothing in
  // the public blog links to it.
  login: "/admin/login",
  oauthCallback: "/api/oauth/callback",
} as const;
