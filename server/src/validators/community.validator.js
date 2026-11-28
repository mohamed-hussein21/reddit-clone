import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string()
    .trim()
    .min(3)
    .max(21)
    .regex(/^[A-Za-z0-9_]+$/),

  title: z.string().trim().optional(),

  description: z.string().max(500).optional(),

  type: z.enum(['public', 'restricted', 'private'])
    .default('public'),
});

export const reviewJoinRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});