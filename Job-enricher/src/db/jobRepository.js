import { withTransaction } from './client.js';

export const recoverStaleJobs = async (staleTimeoutMs) => {
    const { rowCount } = await withTransaction((client) => client.query(
        `UPDATE public.jobs
        SET enrichment_status = 'pending',
            enrichment_started_at = NULL,
            enrichment_error = 'Recovered stale in-progress job'
      WHERE enrichment_status = 'in_progress'
        AND enrichment_started_at < NOW() - ($1 * INTERVAL '1 millisecond')`,
        [staleTimeoutMs],
    ));
    return rowCount;
};

export const claimPendingJobs = async (batchSize) => withTransaction(async (client) => {
    const { rows } = await client.query(
        `SELECT j.id, j.title, j.company, j.location, j.category, j.type, j.salary,
            j.remote, j.description, j.posted_at, j.requirements, j.deadline,
                        j.application_url, j.experience_level, j.title_en, j.description_en
       FROM public.jobs j
             INNER JOIN LATERAL (
                 SELECT 1
                     FROM public.job_sources js
                    WHERE js.job_id = j.id
                        AND NULLIF(BTRIM(js.raw_text), '') IS NOT NULL
                    LIMIT 1
             ) source ON TRUE
      WHERE j.enrichment_status = 'pending'
        AND j.deleted_at IS NULL
      ORDER BY j.id ASC
      LIMIT $1
      FOR UPDATE OF j SKIP LOCKED`,
        [batchSize],
    );
    if (!rows.length) return [];
    const ids = rows.map((job) => job.id);
    await client.query(
        `UPDATE public.jobs
        SET enrichment_status = 'in_progress',
            enrichment_attempts = enrichment_attempts + 1,
            enrichment_started_at = NOW(),
            enrichment_error = NULL
      WHERE id = ANY($1::int[])`,
        [ids],
    );
    return rows;
});

export const getSourceRows = async (client, jobId) => {
    const { rows } = await client.query(
        `SELECT source_type, source_name, source_message_id, source_url, raw_text, posted_at
       FROM public.job_sources
      WHERE job_id = $1
      ORDER BY created_at ASC`,
        [jobId],
    );
    return rows;
};

export const getJobSources = async (jobId) => withTransaction((client) => getSourceRows(client, jobId));

export const countPendingJobs = async () => {
    const { rows } = await withTransaction((client) => client.query(
        `SELECT COUNT(*)::int AS count FROM public.jobs WHERE enrichment_status = 'pending' AND deleted_at IS NULL`,
    ));
    return rows[0].count;
};
