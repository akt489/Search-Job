export const buildEnrichmentMessages = (job, sources) => [
    {
        role: 'system',
        content: `You enrich existing job records. Return only valid JSON matching the requested fields.\nOnly extract or transform information supported by the supplied source. Do not fabricate salary, company, location, deadline, URLs, requirements, experience, or other facts. If the source is clearly not a job, return {"title":"NOT_A_JOB"}. Preserve existing values when the source does not support a better value.`,
    },
    {
        role: 'user',
        content: JSON.stringify({
            task: 'Extract and normalize this existing job without inventing facts.',
            existingJob: job,
            sources: sources.map((source) => ({
                sourceType: source.source_type,
                sourceName: source.source_name,
                sourceUrl: source.source_url,
                postedAt: source.posted_at,
                rawText: source.raw_text,
            })),
            outputFields: ['title', 'title_en', 'company', 'location', 'category', 'type', 'salary', 'remote', 'description', 'description_en', 'requirements', 'deadline', 'application_url', 'experience_level'],
        }),
    },
];
