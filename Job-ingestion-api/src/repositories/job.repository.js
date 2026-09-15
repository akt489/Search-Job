export const insertJob = async (client, job) => {
    const { rows } = await client.query(
        `INSERT INTO jobs (
      title, company, location, category, type, salary, remote, description, posted_at,
      requirements, deadline, application_url, experience_level,
      normalized_title, normalized_company, normalized_location
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15, $16)
    RETURNING id`,
        [
            job.title, job.company, job.location, job.category, job.type, job.salary, job.remote,
            job.description, job.postedAt, JSON.stringify(job.requirements), job.deadline,
            job.applicationUrl, job.experienceLevel, job.normalizedTitle, job.normalizedCompany,
            job.normalizedLocation,
        ],
    );
    return rows[0].id;
};
