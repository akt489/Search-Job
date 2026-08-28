import express from 'express';
import axios from 'axios';
import authenticate from '../middleware/authMiddleware.js';
import pool from '../config/db.js';

const router = express.Router();

// ============================================
// AI Service Helper (calls OpenRouter)
// ============================================
async function callAI(messages, options = {}) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
                messages: messages,
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
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI Service Error:', error.response?.data || error.message);
        throw new Error('AI service temporarily unavailable.');
    }
}

// ============================================
// POST /api/ai/chat - AI Chat
// ============================================
router.post('/chat', authenticate, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // Get user context (simple version)
        const { rows: user } = await pool.query(
            'SELECT fullName FROM users WHERE id = $1',
            [req.user.id]
        );

        const systemPrompt = `
            You are JobScout AI, a professional career assistant.
            User: ${user[0]?.fullName || 'User'}
            Keep responses helpful, friendly, and concise (under 200 words).
        `;

        const aiResponse = await callAI(
            [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
            { max_tokens: 600 }
        );

        // Save chat history
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

// ============================================
// GET /api/ai/recommendations - AI Job Recommendations
// ============================================
router.get('/recommendations', authenticate, async (req, res) => {
    try {
        // 1. Check for recent recommendations (less than 1 hour old)
        const { rows: recent } = await pool.query(
            `SELECT recommended_job_ids, reasoning, generated_at 
             FROM job_recommendations 
             WHERE user_id = $1 
             ORDER BY generated_at DESC 
             LIMIT 1`,
            [req.user.id]
        );

        // If recent and fresh (< 1 hour), return cached
        if (recent.length > 0) {
            const generatedAt = new Date(recent[0].generated_at);
            const now = new Date();
            const hoursDiff = (now - generatedAt) / (1000 * 60 * 60);

            if (hoursDiff < 1) {
                const { rows: jobs } = await pool.query(
                    `SELECT id, title, company, location, category, description, salary, remote 
                     FROM jobs 
                     WHERE id = ANY($1::int[]) 
                     ORDER BY posted_at DESC`,
                    [recent[0].recommended_job_ids]
                );
                return res.json({
                    jobs,
                    reasoning: recent[0].reasoning,
                    generated_at: recent[0].generated_at,
                    isFresh: true
                });
            }
        }

        // 2. Generate fresh recommendations
        const recommendations = await generateRecommendations(req.user.id);
        res.json(recommendations);
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Unable to generate recommendations.' });
    }
});

// ============================================
// POST /api/ai/refresh-recommendations - Force Refresh
// ============================================
router.post('/refresh-recommendations', authenticate, async (req, res) => {
    try {
        const recommendations = await generateRecommendations(req.user.id);
        res.json({
            message: 'Recommendations refreshed successfully!',
            ...recommendations
        });
    } catch (error) {
        console.error('Refresh recommendations error:', error);
        res.status(500).json({ error: 'Unable to refresh recommendations.' });
    }
});

// ============================================
// Helper: Generate AI recommendations
// ============================================
async function generateRecommendations(userId) {
    // 1. Get user profile
    const { rows: profile } = await pool.query(
        `SELECT skills, preferences, location, experience_level 
         FROM user_profiles 
         WHERE user_id = $1`,
        [userId]
    );

    // 2. Get all active jobs (limit to 50 for AI processing)
    const { rows: allJobs } = await pool.query(
        `SELECT id, title, company, location, category, description, salary, remote 
         FROM jobs 
         WHERE is_active = true 
         ORDER BY posted_at DESC 
         LIMIT 50`
    );

    // 3. Build AI prompt
    const userSkills = profile[0]?.skills?.join(', ') || 'Not specified';
    const userPreferences = profile[0]?.preferences?.join(', ') || 'Not specified';
    const userLocation = profile[0]?.location || 'Any';
    const experienceLevel = profile[0]?.experience_level || 'Not specified';

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
        ${jobsList || 'No jobs available.'}

        TASK:
        1. Rank the jobs by how well they match the user's profile.
        2. Return the job IDs in order of relevance (most relevant first).
        3. Provide a brief reasoning (2-3 sentences) for your ranking.

        FORMAT (strictly follow this):
        JOB_IDS: 5,12,3,8,1,15,22,7,10,18
        REASONING: Based on your skills and preferences...
    `;

    // 4. Call AI
    try {
        const aiResponse = await callAI(
            [
                { role: 'system', content: 'You are a job matching expert. Be precise and helpful.' },
                { role: 'user', content: prompt }
            ],
            { max_tokens: 500, temperature: 0.3 }
        );

        // 5. Parse AI response
        const jobIdsMatch = aiResponse.match(/JOB_IDS:\s*([\d,\s]+)/);
        const reasoningMatch = aiResponse.match(/REASONING:\s*(.+)/s);

        let recommendedIds = [];
        if (jobIdsMatch) {
            recommendedIds = jobIdsMatch[1]
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));
        }

        const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Jobs matched based on your profile.';

        // 6. Store in database
        if (recommendedIds.length > 0) {
            await pool.query(
                `INSERT INTO job_recommendations (user_id, recommended_job_ids, reasoning) 
                 VALUES ($1, $2, $3)`,
                [userId, recommendedIds, reasoning]
            );
        }

        // 7. Fetch full job details
        const { rows: jobs } = recommendedIds.length > 0 ? await pool.query(
            `SELECT id, title, company, location, category, description, salary, remote 
             FROM jobs 
             WHERE id = ANY($1::int[]) 
             ORDER BY array_position($1::int[], id)`,
            [recommendedIds]
        ) : { rows: [] };

        return {
            jobs,
            reasoning,
            generated_at: new Date().toISOString(),
            isFresh: true
        };

    } catch (error) {
        console.error('AI recommendation generation error:', error);
        // Fallback: return recent jobs
        const { rows: fallbackJobs } = await pool.query(
            `SELECT id, title, company, location, category, description, salary, remote 
             FROM jobs 
             WHERE is_active = true 
             ORDER BY posted_at DESC 
             LIMIT 10`
        );
        return {
            jobs: fallbackJobs,
            reasoning: 'Using recent jobs as recommendations. Please try again later for personalized matches.',
            generated_at: new Date().toISOString(),
            isFresh: false
        };
    }
}

export default router;