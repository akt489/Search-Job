export const insertJobSource = async (client, source, jobId) => {
    const { rows } = await client.query(
        `INSERT INTO job_sources (job_id, source_type, source_name, source_message_id, source_url, raw_text, posted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
        [jobId, source.sourceType, source.sourceName, source.sourceMessageId, source.sourceUrl || null, source.rawText, source.postedAt || null],
    );
    return rows[0].id;
};
