import { pool } from './client.js';

const allowedStatuses = new Set(['done', 'failed', 'not_a_job']);

export const updateEnrichment = async ({ jobId, status, fields = {}, error = null, model = null }) => {
    if (!allowedStatuses.has(status)) throw new Error(`Invalid terminal enrichment status: ${status}`);
    const { rowCount } = await pool.query(
        `UPDATE public.jobs
        SET enrichment_status = $1::text,
            enrichment_error = $2::text,
            ai_model = $3::varchar(255),
            enriched_at = CASE WHEN $1::text IN ('done', 'not_a_job') THEN NOW() ELSE enriched_at END,
            enrichment_started_at = CASE WHEN $1::text IN ('done', 'failed', 'not_a_job') THEN NULL ELSE enrichment_started_at END,
            title = COALESCE(NULLIF($4::text, '')::varchar(255), title),
            company = COALESCE(NULLIF($5::text, '')::varchar(255), company),
            location = COALESCE(NULLIF($6::text, '')::varchar(128), location),
            category = COALESCE(NULLIF($7::text, '')::varchar(128), category),
            type = COALESCE(NULLIF($8::text, '')::varchar(64), type),
            salary = COALESCE(NULLIF($9::text, '')::varchar(64), salary),
            remote = COALESCE($10::boolean, remote, false),
            description = COALESCE(NULLIF($11::text, ''), description),
            requirements = COALESCE($12::jsonb, requirements, '[]'::jsonb),
            deadline = COALESCE($13::timestamptz, deadline),
            application_url = COALESCE(NULLIF($14::text, ''), application_url),
            experience_level = COALESCE(NULLIF($15::text, '')::varchar(100), experience_level),
            title_en = COALESCE(NULLIF($16::text, '')::varchar(255), title_en),
            description_en = COALESCE(NULLIF($17::text, ''), description_en)
      WHERE id = $18::integer
        AND enrichment_status = 'in_progress'`,
        [
            status, error, model, fields.title, fields.company, fields.location, fields.category, fields.type,
            fields.salary, fields.remote, fields.description, fields.requirements ? JSON.stringify(fields.requirements) : null,
            fields.deadline, fields.application_url, fields.experience_level, fields.title_en, fields.description_en, jobId,
        ],
    );
    if (rowCount !== 1) throw new Error(`Job ${jobId} was no longer in progress`);
};
