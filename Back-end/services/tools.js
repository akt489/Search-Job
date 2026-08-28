import pool from '../db.js';

// ============================================
// TOOLS - Predefined actions for AI
// ============================================

const tools = {
    // Tool 1: Search for jobs
    searchJobs: {
        description: 'Search for jobs based on query, location, or category',
        parameters: {
            query: { type: 'string', description: 'Job title or keyword' },
            location: { type: 'string', description: 'City or remote' },
            category: { type: 'string', description: 'Job category' },
        },
        handler: async ({ query, location, category }) => {
            let sql = 'SELECT id, title, company, location, category, description, salary FROM jobs WHERE 1=1';
            const params = [];
            let idx = 1;

            if (query) {
                sql += ` AND (title ILIKE $${idx} OR company ILIKE $${idx} OR description ILIKE $${idx})`;
                params.push(`%${query}%`);
                idx++;
            }
            if (location && location !== 'All') {
                sql += ` AND location ILIKE $${idx}`;
                params.push(`%${location}%`);
                idx++;
            }
            if (category && category !== 'All') {
                sql += ` AND category = $${idx}`;
                params.push(category);
                idx++;
            }

            sql += ' ORDER BY posted_at DESC LIMIT 10';
            const { rows } = await pool.query(sql, params);
            return rows;
        },
    },

    // Tool 2: Get job details
    getJob: {
        description: 'Get details of a specific job',
        parameters: {
            jobId: { type: 'string', description: 'Job ID' },
        },
        required: ['jobId'],
        handler: async ({ jobId }) => {
            const { rows } = await pool.query(
                'SELECT * FROM jobs WHERE id = $1',
                [jobId]
            );
            return rows[0] || null;
        },
    },

    // Tool 3: Save a job
    saveJob: {
        description: 'Save a job for the user',
        parameters: {
            userId: { type: 'string', description: 'User ID' },
            jobId: { type: 'string', description: 'Job ID' },
        },
        required: ['userId', 'jobId'],
        handler: async ({ userId, jobId }) => {
            await pool.query(
                'INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [userId, jobId]
            );
            return { success: true, message: 'Job saved!' };
        },
    },

    // Tool 4: Get application tips
    getApplicationTips: {
        description: 'Get application tips for a specific job',
        parameters: {
            jobId: { type: 'string', description: 'Job ID' },
        },
        required: ['jobId'],
        handler: async ({ jobId }) => {
            const { rows: job } = await pool.query(
                'SELECT title, company, description FROM jobs WHERE id = $1',
                [jobId]
            );
            if (!job.length) return { error: 'Job not found' };

            return {
                job: job[0],
                tips: [
                    'Research the company culture and values',
                    'Tailor your CV to highlight relevant experience',
                    'Write a personalized cover letter',
                    'Prepare for common interview questions',
                    'Follow up after the application',
                ],
            };
        },
    },
};

export default tools;