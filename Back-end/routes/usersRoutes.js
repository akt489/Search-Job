import express from 'express';
import pool from '../db.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, fullName, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Unable to fetch user profile.' });
    }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
    const { fullName } = req.body;

    if (!fullName?.trim()) {
        return res.status(400).json({ error: 'Full name is required.' });
    }

    try {
        const { rows } = await pool.query(
            'UPDATE users SET fullName = $1 WHERE id = $2 RETURNING id, fullName, email, created_at',
            [fullName.trim(), req.user.id]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Unable to update user profile.' });
    }
});

// Get saved jobs
router.get('/saved-jobs', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT j.* 
             FROM jobs j
             JOIN saved_jobs sj ON j.id = sj.job_id
             WHERE sj.user_id = $1
             ORDER BY sj.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Saved jobs fetch error:', error);
        res.status(500).json({ error: 'Unable to load saved jobs.' });
    }
});

// Toggle save/unsave a job
router.post('/saved-jobs/toggle', authenticate, async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        return res.status(400).json({ error: 'jobId is required.' });
    }

    try {
        // Check if the job exists
        const { rows: jobRows } = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
        if (!jobRows.length) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        // Check if already saved
        const { rows: savedRows } = await pool.query(
            'SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
            [req.user.id, jobId]
        );

        if (savedRows.length) {
            // Unsave: delete the saved job
            await pool.query(
                'DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
                [req.user.id, jobId]
            );
            res.json({ message: 'Job unsaved successfully.', saved: false });
        } else {
            // Save: insert the saved job
            await pool.query(
                'INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)',
                [req.user.id, jobId]
            );
            res.json({ message: 'Job saved successfully.', saved: true });
        }
    } catch (error) {
        console.error('Toggle save error:', error);
        res.status(500).json({ error: 'Unable to toggle saved job.' });
    }
});

// Get application history (if not already in jobsRoutes)
router.get('/applications', authenticate, async (req, res) => {
    try {
        const { rows: applications } = await pool.query(
            `SELECT a.id, a.job_id, j.title, j.company, a.cover_letter, a.status, a.created_at
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.user_id = $1
             ORDER BY a.created_at DESC`,
            [req.user.id]
        );
        res.json(applications);
    } catch (error) {
        console.error('Application history error:', error);
        res.status(500).json({ error: 'Unable to load application history.' });
    }
});

// Get all users (admin only - for debugging)
router.get('/', authenticate, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, fullName, email, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ error: 'Unable to fetch users.' });
    }
});

export default router;