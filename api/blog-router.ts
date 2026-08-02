import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
} from "./queries/posts";

export const blogRouter = createRouter({
  list: publicQuery.query(async () => findAllPosts()),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await findPostById(input.id);
      return post;
    }),

  create: adminQuery
    .input(
      z.object({
        year: z.string().max(10),
        image: z.string().max(500),
        detailImage: z.string().max(500).optional(),
        sortOrder: z.number().optional(),
        rsTitle: z.string().max(255),
        rsSubtitle: z.string().max(255),
        rsCollection: z.string().max(255),
        rsContent: z.string(),
        rsDetailContent: z.string(),
        enTitle: z.string().max(255),
        enSubtitle: z.string().max(255),
        enCollection: z.string().max(255),
        enContent: z.string(),
        enDetailContent: z.string(),
      }),
    )
    .mutation(async ({ input }) => createPost(input)),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        year: z.string().max(10).optional(),
        image: z.string().max(500).optional(),
        detailImage: z.string().max(500).optional(),
        sortOrder: z.number().optional(),
        rsTitle: z.string().max(255).optional(),
        rsSubtitle: z.string().max(255).optional(),
        rsCollection: z.string().max(255).optional(),
        rsContent: z.string().optional(),
        rsDetailContent: z.string().optional(),
        enTitle: z.string().max(255).optional(),
        enSubtitle: z.string().max(255).optional(),
        enCollection: z.string().max(255).optional(),
        enContent: z.string().optional(),
        enDetailContent: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updatePost(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePost(input.id);
      return { success: true };
    }),
});
