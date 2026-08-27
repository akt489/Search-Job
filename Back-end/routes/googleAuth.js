import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Configure Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const fullName = profile.displayName || profile.name?.givenName || 'User';

                if (!email) {
                    return done(new Error('No email found from Google'), null);
                }

                // Check if user exists
                const { rows } = await pool.query(
                    'SELECT id, fullName, email FROM users WHERE email = $1',
                    [email]
                );

                let user;
                if (rows.length) {
                    user = rows[0];
                } else {
                    // Create new user with Google OAuth
                    const { rows: newUser } = await pool.query(
                        'INSERT INTO users (fullName, email, passwordHash) VALUES ($1, $2, $3) RETURNING id, fullName, email',
                        [fullName, email, 'google_oauth']
                    );
                    user = newUser[0];
                }

                return done(null, user);
            } catch (error) {
                console.error('Google auth error:', error);
                return done(error, null);
            }
        }
    )
);

// --- Google Login Route ---
router.get('/google', (req, res, next) => {
    const redirectUrl = req.query.redirect || '/dashboard';

    // Store redirect URL in a cookie or query param (since we don't have session)
    // We'll pass it as a state parameter
    const state = Buffer.from(JSON.stringify({ redirect: redirectUrl })).toString('base64');

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: state,
    })(req, res, next);
});

// --- Google Callback Route ---
router.get('/google/callback', (req, res, next) => {
    const { state } = req.query;
    let redirectUrl = '/dashboard';

    try {
        if (state) {
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            redirectUrl = decoded.redirect || '/dashboard';
        }
    } catch (error) {
        console.warn('Failed to parse state:', error);
    }

    passport.authenticate('google', { session: false }, (err, user) => {
        if (err) {
            console.error('Google callback error:', err);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Google authentication failed. Please try again.')}`);
        }

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('No user found from Google.')}`);
        }

        try {
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'change-this-secret',
                { expiresIn: '8h' }
            );

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}&redirect=${encodeURIComponent(redirectUrl)}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Failed to generate authentication token.')}`);
        }
    })(req, res, next);
});

export default router;