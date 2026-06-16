import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

function createToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET || 'change-this-secret',
        {
            expiresIn: '8h',
        }
    );
}

router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase();

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
        if (existing.length) {
            return res.status(409).json({ error: 'This email is already registered.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (fullName, email, passwordHash) VALUES (?, ?, ?)',
            [fullName.trim(), normalizedEmail, passwordHash]
        );

        const user = {
            id: result.insertId,
            fullName: fullName.trim(),
            email: normalizedEmail,
        };

        const token = createToken(user);
        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to register user. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase();
        const [rows] = await pool.query('SELECT id, fullName, email, passwordHash FROM users WHERE email = ?', [normalizedEmail]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const safeUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        };
        const token = createToken(safeUser);

        res.json({ user: safeUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to log in at this time.' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase();
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
        if (!rows.length) {
            // Return same response regardless of whether the user exists to avoid account enumeration.
            return res.json({ message: 'If this email is registered, a password reset link will be sent.' });
        }

        // In a real app, generate a reset token and send an email here.
        res.json({ message: 'If this email is registered, a password reset link will be sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to process password reset right now.' });
    }
});

export default router;
