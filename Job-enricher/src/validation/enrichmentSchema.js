import { z } from 'zod';

const nullableText = z.string().trim().max(10000).nullable().optional();

const requirements = z
    .array(z.string().trim().min(1).max(500))
    .max(100)
    .default([]);

export const enrichmentSchema = z.object({
    title: z.string().trim().min(1).max(255),
    title_en: z.string().trim().max(255).nullable().optional(),
    company: z.string().trim().max(255).nullable().optional(),
    location: z.string().trim().max(128).nullable().optional(),
    category: z.string().trim().max(128).nullable().optional(),
    type: z.string().trim().max(64).nullable().optional(),
    salary: nullableText,
    remote: z.boolean().nullable().optional(),
    description: z.string().trim().max(100000).nullable().optional(),
    description_en: z.string().trim().max(100000).nullable().optional(),
    requirements,
    deadline: z.string().datetime({ offset: true }).nullable().optional(),
    application_url: z.string().url().nullable().optional(),
    experience_level: z.string().trim().max(100).nullable().optional(),
});