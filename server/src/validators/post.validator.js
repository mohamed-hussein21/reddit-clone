
import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().trim().min(1).max(300),

    body: z.string().optional().default(''),

    type: z.enum(['text', 'image', 'link']).default('text'),

    community: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid community ID'),

    url: z.string().url().optional().or(z.literal('')).default('')
});

export const updatePostSchema = z.object({
    title: z.string().trim().min(1).max(300).optional(),

    body: z.string().optional(),

    type: z.enum(['text', 'image', 'link']).optional(),

    url: z.string().url().optional().or(z.literal(''))
});
