import { env } from '../config/env.js';

export const findDuplicateCandidate = async (client, normalizedJob) => {
    const { rows } = await client.query(
        `SELECT id, application_url
       FROM jobs
      WHERE deleted_at IS NULL
        AND posted_at >= NOW() - ($1 * INTERVAL '1 day')
        AND normalized_company = $2
        AND normalized_title = $3
        AND normalized_location = $4
      ORDER BY posted_at DESC
      LIMIT 5`,
        [env.duplicateWindowDays, normalizedJob.normalizedCompany, normalizedJob.normalizedTitle, normalizedJob.normalizedLocation],
    );

    if (!rows.length) return null;
    if (normalizedJob.normalizedApplicationUrl) {
        return rows.find((row) => row.application_url?.toLowerCase() === normalizedJob.normalizedApplicationUrl) || null;
    }
    return rows.length === 1 ? rows[0] : null;
};
