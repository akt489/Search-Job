import express from 'express';
import axios from 'axios';
import authenticate from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

// ─── Helper: call AI via OpenRouter ─────────────────────────
async function callAI(messages, options = {}) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
                messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 600,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://searchjob.com',
                    'X-Title': 'SearchJob AI',
                },
                timeout: 15000,
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI Service Error:', error.response?.data || error.message);
        throw new Error('AI service temporarily unavailable.');
    }
}

// ─── POST /api/ai/chat ──────────────────────────────────────
router.post('/chat', authenticate, async (req, res) => {
    // ... (same as before, keep your existing chat code)
    // I'll include a simplified version below
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    try {
        const { rows: user } = await pool.query(
            'SELECT fullName FROM users WHERE id = $1',
            [req.user.id]
        );
        const systemPrompt = `You are JobScout AI, a professional career assistant. User: ${user[0]?.fullName || 'User'}. Keep responses helpful and concise.`;
        const aiResponse = await callAI(
            [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
            { max_tokens: 600 }
        );
        await pool.query(
            `INSERT INTO chat_history (user_id, message, response) VALUES ($1, $2, $3)`,
            [req.user.id, message, aiResponse]
        );
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({ error: 'AI service temporarily unavailable.' });
    }
});

// ─── GET /api/ai/recommendations ────────────────────────────
router.get('/recommendations', authenticate, async (req, res) => {
    try {
        const recommendations = await generateRecommendations(req.user.id);
        res.json(recommendations);
    } catch (error) {
        console.error('❌ Recommendations error:', error);
        // Return a friendly error with details
        res.status(500).json({
            error: 'Unable to generate recommendations.',
            details: error.message,
        });
    }
});

// ─── GET /api/ai/profile ────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT skills, preferences, location, experience_level, education 
             FROM user_profiles 
             WHERE user_id = $1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            // Return empty profile if not found
            return res.json({
                skills: [],
                preferences: [],
                location: '',
                experience_level: '',
                education: ''
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Unable to fetch profile.' });
    }
});

// ─── POST /api/ai/profile ────────────────────────────────────
router.post('/profile', authenticate, async (req, res) => {
    const { skills, preferences, location, experience_level, education } = req.body;

    try {
        await pool.query(
            `INSERT INTO user_profiles (user_id, skills, preferences, location, experience_level, education, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                skills = EXCLUDED.skills,
                preferences = EXCLUDED.preferences,
                location = EXCLUDED.location,
                experience_level = EXCLUDED.experience_level,
                education = EXCLUDED.education,
                updated_at = NOW()`,
            [req.user.id, skills || [], preferences || [], location, experience_level, education]
        );

        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Unable to update profile.' });
    }
});

// ─── POST /api/ai/refresh-recommendations ───────────────────
router.post('/refresh-recommendations', authenticate, async (req, res) => {
    try {
        const recommendations = await generateRecommendations(req.user.id, true);
        res.json({
            message: 'Recommendations refreshed successfully!',
            ...recommendations
        });
    } catch (error) {
        console.error('❌ Refresh error:', error);
        res.status(500).json({
            error: 'Unable to refresh recommendations.',
            details: error.message,
        });
    }
});

// ─── Helper: generate recommendations ──────────────────────
async function generateRecommendations(userId, forceRefresh = false) {
    console.log(`🚀 Generating recommendations for user ${userId}...`);

    // 1. Check for cached recommendations (if not force refresh)
    if (!forceRefresh) {
        const { rows: recent } = await pool.query(
            `SELECT recommended_job_ids, reasoning, generated_at 
             FROM job_recommendations 
             WHERE user_id = $1 
             ORDER BY generated_at DESC 
             LIMIT 1`,
            [userId]
        );

        if (recent.length > 0) {
            const generatedAt = new Date(recent[0].generated_at);
            const hoursDiff = (Date.now() - generatedAt) / (1000 * 60 * 60);
            if (hoursDiff < 1) {
                const { rows: jobs } = await pool.query(
                    `SELECT id, title, company, location, category, description, salary, remote 
                     FROM jobs 
                     WHERE id = ANY($1::int[])`,
                    [recent[0].recommended_job_ids]
                );
                console.log(`✅ Returning cached recommendations (${jobs.length} jobs)`);
                return {
                    jobs,
                    reasoning: recent[0].reasoning,
                    generated_at: recent[0].generated_at,
                    isFresh: true
                };
            }
        }
    }

    // 2. Fetch user profile
    const { rows: profile } = await pool.query(
        `SELECT skills, preferences, location, experience_level 
         FROM user_profiles 
         WHERE user_id = $1`,
        [userId]
    );

    const userSkills = profile[0]?.skills?.join(', ') || 'Not specified';
    const userPreferences = profile[0]?.preferences?.join(', ') || 'Not specified';
    const userLocation = profile[0]?.location || 'Any';
    const experienceLevel = profile[0]?.experience_level || 'Not specified';

    console.log(`📋 User profile: Skills: ${userSkills}, Prefs: ${userPreferences}, Location: ${userLocation}`);

    // 3. Fetch active jobs (check if is_active column exists)
    let jobsQuery = `
        SELECT id, title, company, location, category, description, salary, remote 
        FROM jobs 
        WHERE 1=1
    `;
    // Check if is_active column exists
    const { rows: columnCheck } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND column_name = 'is_active'
    `);
    if (columnCheck.length > 0) {
        jobsQuery += ` AND is_active = true`;
    }
    jobsQuery += ` ORDER BY posted_at DESC LIMIT 50`;

    const { rows: allJobs } = await pool.query(jobsQuery);
    console.log(`📊 Found ${allJobs.length} active jobs`);

    if (allJobs.length === 0) {
        return {
            jobs: [],
            reasoning: 'No active jobs available at the moment.',
            generated_at: new Date().toISOString(),
            isFresh: true
        };
    }

    // 4. Build AI prompt
    const jobsList = allJobs.map((j, i) =>
        `${i + 1}. ID:${j.id} | ${j.title} at ${j.company} (${j.location})`
    ).join('\n');

    const prompt = `
        You are a job matching AI. Rank the following jobs by relevance to the user.

        USER PROFILE:
        - Skills: ${userSkills}
        - Preferences: ${userPreferences}
        - Location: ${userLocation}
        - Experience Level: ${experienceLevel}

        AVAILABLE JOBS:
        ${jobsList}

        TASK:
        1. Rank the jobs by how well they match the user's profile.
        2. Return the job IDs in order of relevance (most relevant first).
        3. Provide a brief reasoning (2-3 sentences) for your ranking.

        FORMAT (strictly follow this):
        JOB_IDS: 5,12,3,8,1,15,22,7,10,18
        REASONING: Based on your skills and preferences...
    `;

    // 5. Call AI (with fallback)
    let aiResponse;
    let recommendedIds = [];
    let reasoning = 'Jobs matched based on your profile.';

    try {
        console.log('🤖 Calling AI for recommendations...');
        aiResponse = await callAI(
            [
                { role: 'system', content: 'You are a job matching expert. Be precise and helpful.' },
                { role: 'user', content: prompt }
            ],
            { max_tokens: 500, temperature: 0.3 }
        );
        console.log('✅ AI response received');

        // Parse AI response
        const jobIdsMatch = aiResponse.match(/JOB_IDS:\s*([\d,\s]+)/);
        const reasoningMatch = aiResponse.match(/REASONING:\s*(.+)/s);

        if (jobIdsMatch) {
            recommendedIds = jobIdsMatch[1]
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
        }
        if (reasoningMatch) {
            reasoning = reasoningMatch[1].trim();
        }
    } catch (error) {
        console.error('❌ AI call failed:', error.message);
        // Fallback: use recent jobs as recommendations
        recommendedIds = allJobs.slice(0, 10).map(j => j.id);
        reasoning = 'Using recent jobs as recommendations. AI service is currently unavailable.';
    }

    // 6. Store recommendations
    if (recommendedIds.length > 0) {
        await pool.query(
            `INSERT INTO job_recommendations (user_id, recommended_job_ids, reasoning) 
             VALUES ($1, $2, $3)`,
            [userId, recommendedIds, reasoning]
        );
    }

    // 7. Fetch full job details for the recommendations
    const { rows: jobs } = recommendedIds.length > 0 ? await pool.query(
        `SELECT id, title, company, location, category, description, salary, remote 
         FROM jobs 
         WHERE id = ANY($1::int[])`,
        [recommendedIds]
    ) : { rows: [] };

    console.log(`✅ Returning ${jobs.length} recommendations`);

    return {
        jobs,
        reasoning,
        generated_at: new Date().toISOString(),
        isFresh: true
    };
}

export default router;