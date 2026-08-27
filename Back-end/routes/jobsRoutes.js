import express from 'express';
import pool from '../db.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// 1. SPECIFIC ROUTES (NO PARAMETERS) - FIRST
// ============================================

// GET all jobs with optional search + location filtering (public)
router.get('/', async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = 'SELECT id, title, company, location, category, type, salary, remote, description, posted_at FROM jobs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (location && location !== 'All') {
      query += ` AND location = $${paramIndex}`;
      params.push(location);
      paramIndex++;
    }

    query += ' ORDER BY posted_at DESC';

    const { rows: jobs } = await pool.query(query, params);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load jobs.' });
  }
});

// GET unique locations (for dropdown filter)
router.get('/locations', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT location FROM jobs ORDER BY location');
    const locations = rows.map(row => row.location);
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load locations.' });
  }
});

// Get application history (authenticated)
router.get('/history', authenticate, async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: 'Unable to load application history.' });
  }
});

// ============================================
// 2. PARAMETERIZED ROUTES (WITH :ID) - LAST
// ============================================

// GET a single job by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT id, title, company, location, category, type, salary, remote, description, posted_at FROM jobs WHERE id = $1',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load job details.' });
  }
});

// Apply to a job (authenticated)
router.post('/apply', authenticate, async (req, res) => {
  const { jobId, coverLetter } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required.' });
  }

  try {
    const { rows: jobRows } = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if (!jobRows.length) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    await pool.query(
      'INSERT INTO applications (user_id, job_id, cover_letter, status) VALUES ($1, $2, $3, $4)',
      [req.user.id, jobId, coverLetter || '', 'submitted']
    );

    res.json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create application.' });
  }
});

export default router;