import z from "zod";

export const createLinkSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    domain: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    notes: z.string().optional(),
    isFavorite: z.boolean().default(false),
});

export const updateLinkSchema = createLinkSchema.partial();

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;