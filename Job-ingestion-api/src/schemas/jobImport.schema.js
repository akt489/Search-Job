import { z } from 'zod';

const isoTimestamp = z.string().datetime({ offset: true });

export const jobImportSchema = z.object({
    sourceType: z.string().trim().min(1).max(50),
    sourceName: z.string().trim().min(1).max(255),
    sourceMessageId: z.string().trim().min(1).max(255),
    sourceUrl: z.string().url().max(2048).optional(),
    postedAt: isoTimestamp.optional(),
    rawText: z.string().trim().min(1).max(100_000),
});

export const bulkJobImportSchema = (maxBatchSize) =>
    z.object({
        items: z.array(z.unknown()).min(1).max(maxBatchSize),
    });
