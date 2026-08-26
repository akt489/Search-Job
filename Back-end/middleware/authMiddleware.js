import jwt from 'jsonwebtoken';
import pool from '../db.js';

export default async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is missing.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret');
        const { rows } = await pool.query('SELECT id, fullName, email FROM users WHERE id = $1', [payload.userId]);

        if (!rows.length) {
            return res.status(401).json({ error: 'Unauthorized user.' });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}