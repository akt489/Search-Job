import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { buildUserContext } from '../services/contextEngine.js';
import { callAI, buildSystemPrompt } from '../services/aiService.js';
import tools from '../services/tools.js';
import pool from '../db.js';

const router = express.Router();

// ============================================
// POST /api/ai/chat
// ============================================
router.post('/chat', authenticate, async (req, res) => {
    const { message, jobId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // 1. Build user context
        const { formatted: userContext } = await buildUserContext(req.user.id);

        // 2. Build system prompt
        const systemPrompt = buildSystemPrompt(userContext, tools);

        // 3. Call AI
        const aiResponse = await callAI(
            [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
            { max_tokens: 600 }
        );

        // 4. Save chat history
        await pool.query(
            `INSERT INTO chat_history (user_id, message, response, job_id) 
             VALUES ($1, $2, $3, $4)`,
            [req.user.id, message, aiResponse, jobId || null]
        );

        // 5. Return response
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({ error: 'AI service temporarily unavailable.' });
    }
});

// ============================================
// POST /api/ai/recommendations
// ============================================
router.post('/recommendations', authenticate, async (req, res) => {
    const { preferences, skills, location } = req.body;

    try {
        // Build query
        let query = 'SELECT id, title, company, location, category, description FROM jobs';
        const params = [];
        const conditions = [];

        if (location && location !== 'All') {
            conditions.push(`location ILIKE $${params.length + 1}`);
            params.push(`%${location}%`);
        }

        if (preferences && preferences.length > 0) {
            const placeholders = preferences.map((_, i) => `$${params.length + i + 1}`).join(' OR ');
            conditions.push(`(title ILIKE ${placeholders} OR category ILIKE ${placeholders} OR description ILIKE ${placeholders})`);
            preferences.forEach(p => params.push(`%${p}%`));
        }

        if (conditions.length) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY posted_at DESC LIMIT 10';
        const { rows: jobs } = await pool.query(query, params);

        // If no jobs found, get AI suggestions
        if (jobs.length === 0) {
            const suggestionPrompt = `Suggest 5 job titles for a person with skills: ${skills?.join(', ') || 'N/A'}.`;
            const suggestions = await callAI([
                { role: 'system', content: 'You are a career advisor. Suggest job titles.' },
                { role: 'user', content: suggestionPrompt },
            ], { max_tokens: 200 });

            return res.json({ jobs: [], suggestions });
        }

        res.json({ jobs });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Unable to generate recommendations.' });
    }
});

// ============================================
// GET /api/ai/profile
// ============================================
router.get('/profile', authenticate, async (req, res) => {
    try {
        const context = await buildUserContext(req.user.id);
        res.json(context.raw);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Unable to fetch profile.' });
    }
});

// ============================================
// POST /api/ai/profile
// ============================================
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

export default router;