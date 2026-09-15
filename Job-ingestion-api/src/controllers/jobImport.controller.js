import { bulkJobImportSchema, jobImportSchema } from '../schemas/jobImport.schema.js';
import { importJob } from '../services/jobImport.service.js';
import { logger } from '../utils/logger.js';

export const importSingleJob = async (req, res, next) => {
    try {
        logger.info({ event: 'request_received', request_id: req.requestId, route: req.originalUrl }, 'Job import request received');
        const source = jobImportSchema.parse(req.body);
        const result = await importJob(source, req.requestId);
        res.status(result.status === 'created' ? 201 : 200).json({ ...result, requestId: req.requestId });
    } catch (error) {
        next(error);
    }
};

export const importBulkJobs = async (req, res, next) => {
    try {
        const { items } = bulkJobImportSchema(req.app.locals.maxBatchSize).parse(req.body);
        const results = [];
        for (const item of items) {
            const parsed = jobImportSchema.safeParse(item);
            if (!parsed.success) {
                results.push({ sourceMessageId: item?.sourceMessageId || null, status: 'invalid', error: 'Invalid job import data' });
            } else {
                try {
                    results.push({ sourceMessageId: parsed.data.sourceMessageId, ...(await importJob(parsed.data, req.requestId)) });
                } catch {
                    results.push({ sourceMessageId: parsed.data.sourceMessageId, status: 'error', error: 'Unable to import this job' });
                }
            }
        }
        res.status(200).json({ results, requestId: req.requestId });
    } catch (error) {
        next(error);
    }
};
