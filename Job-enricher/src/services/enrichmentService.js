import { getJobSources } from '../db/jobRepository.js';
import { updateEnrichment } from '../db/enrichmentRepository.js';
import { buildEnrichmentMessages } from '../ai/prompts.js';
import { extractJson } from '../ai/responseParser.js';
import { enrichmentSchema } from '../validation/enrichmentSchema.js';
import { logger } from '../utils/logger.js';

export class EnrichmentService {
    constructor({ aiClient, model, onUsage = () => { } }) {
        this.aiClient = aiClient;
        this.model = model;
        this.onUsage = onUsage;
    }

    async processJob(job) {
        const sources = await getJobSources(job.id);
        const response = await this.aiClient.enrich(buildEnrichmentMessages(job, sources));
        const parsed = extractJson(response.content);
        if (parsed.title === 'NOT_A_JOB') {
            await updateEnrichment({ jobId: job.id, status: 'not_a_job', model: response.model });
            this.onUsage(response.usage);
            return { status: 'not_a_job', usage: response.usage };
        }
        const validated = enrichmentSchema.parse(parsed);
        await updateEnrichment({ jobId: job.id, status: 'done', fields: validated, model: response.model });
        this.onUsage(response.usage);
        logger.info({ event: 'ai_enrichment', jobId: job.id, status: 'done', model: response.model, promptTokens: response.usage.prompt_tokens, completionTokens: response.usage.completion_tokens, totalTokens: response.usage.total_tokens, durationMs: response.durationMs }, 'Job enrichment completed');
        return { status: 'done', usage: response.usage };
    }

    async markFailed(jobId, error) {
        await updateEnrichment({ jobId, status: 'failed', error: error.message, model: this.model });
    }
}
