import { pool, withTransaction } from '../config/database.js';
import { findDuplicateCandidate } from './duplicateDetection.service.js';
import { findExistingSource, isSourceUniqueViolation } from './idempotency.service.js';
import { normalizeJob } from './jobNormalization.service.js';
import { insertJob } from '../repositories/job.repository.js';
import { insertJobSource } from '../repositories/jobSource.repository.js';
import { logger } from '../utils/logger.js';

export const importJob = async (source, requestId) => {
    const normalizedJob = normalizeJob(source);
    let candidateJobId = null;

    try {
        const result = await withTransaction(async (client) => {
            const existingJobId = await findExistingSource(client, source.sourceType, source.sourceMessageId);
            if (existingJobId) return { status: 'duplicate', jobId: existingJobId };

            const candidate = await findDuplicateCandidate(client, normalizedJob);
            candidateJobId = candidate?.id || null;
            const jobId = await insertJob(client, normalizedJob);
            await insertJobSource(client, source, jobId);
            return { status: 'created', jobId, ...(candidateJobId ? { possibleDuplicateJobId: candidateJobId } : {}) };
        });

        logger.info({ event: result.status === 'created' ? 'job_imported' : 'duplicate_detected', request_id: requestId, source_type: source.sourceType, source_name: source.sourceName, source_message_id: source.sourceMessageId, job_id: result.jobId }, 'Job import processed');
        return result;
    } catch (error) {
        if (isSourceUniqueViolation(error)) {
            const existingJobId = await findExistingSource(pool, source.sourceType, source.sourceMessageId);
            if (existingJobId) {
                logger.info({ event: 'duplicate_detected', request_id: requestId, source_type: source.sourceType, source_message_id: source.sourceMessageId, job_id: existingJobId }, 'Idempotent job import replay');
                return { status: 'duplicate', jobId: existingJobId };
            }
        }
        logger.error({ event: 'database_error', request_id: requestId, source_type: source.sourceType, source_message_id: source.sourceMessageId, error: error.message }, 'Job import database failure');
        throw error;
    }
};

export const importBulk = async (items, requestId) => {
    const results = [];
    for (const item of items) {
        try {
            results.push({ sourceMessageId: item.sourceMessageId, ...(await importJob(item, requestId)) });
        } catch {
            results.push({ sourceMessageId: item.sourceMessageId || null, status: 'error', error: 'Unable to import this job' });
        }
    }
    logger.info({ event: 'bulk_import_completed', request_id: requestId, total: items.length, created: results.filter((item) => item.status === 'created').length, duplicate: results.filter((item) => item.status === 'duplicate').length, failed: results.filter((item) => item.status === 'error' || item.status === 'invalid').length }, 'Bulk job import completed');
    return results;
};
