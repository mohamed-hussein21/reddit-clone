import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

// POST /comments  (parentId is only sent when replying to a comment)
export const createCommentSchema = z.object({
  postId: objectId,
  parentId: objectId.nullable().optional(),
  body: z.string().trim().min(1, 'Comment cannot be empty').max(10000),
});

// PATCH /comments/:id
export const updateCommentSchema = z.object({
  body: z.string().trim().min(1, 'Comment cannot be empty').max(10000),
});
