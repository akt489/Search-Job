import express from 'express';
import pool from '../db.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [jobs] = await pool.query(
      'SELECT id, title, company, location, category, type, salary, remote, description, posted_at FROM jobs ORDER BY posted_at DESC'
    );
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load jobs.' });
  }
});

router.post('/apply', authenticate, async (req, res) => {
  const { jobId, coverLetter } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required.' });
  }

  try {
    const [jobRows] = await pool.query('SELECT id FROM jobs WHERE id = ?', [jobId]);
    if (!jobRows.length) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    await pool.query(
      'INSERT INTO applications (user_id, job_id, cover_letter, status) VALUES (?, ?, ?, ?)',
      [req.user.id, jobId, coverLetter || '', 'submitted']
    );

    res.json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create application.' });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.id, a.job_id, j.title, j.company, a.cover_letter, a.status, a.created_at
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load application history.' });
  }
});

export default router;
