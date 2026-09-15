import { isUniqueViolation } from '../utils/errors.js';

export const findExistingSource = async (client, sourceType, sourceMessageId) => {
    const { rows } = await client.query(
        'SELECT job_id FROM job_sources WHERE source_type = $1 AND source_message_id = $2',
        [sourceType, sourceMessageId],
    );
    return rows[0]?.job_id || null;
};

export const isSourceUniqueViolation = (error) => isUniqueViolation(error, 'job_sources_source_type_source_message_id_key');
