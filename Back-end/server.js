import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// ─── Route Imports ──────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import googleAuthRoutes from './routes/googleAuth.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// ─── 1. TRUST PROXY (Railway) ──────────────────────────────
app.set('trust proxy', true);

// ─── 2. SECURITY & PARSING ──────────────────────────────────
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 3. CORS (MUST BE BEFORE ANY ROUTES) ───────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://confident-wisdom-production-2fb8.up.railway.app',
    'https://searchjob-frontend.up.railway.app',
    process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ─── 4. RATE LIMITING ──────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false }, // ✅ Disable the validation check
});

// ─── 5. ROUTES ──────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload-cv', uploadRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/ai', aiRoutes);

// ─── 6. HEALTH CHECK ────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'Search Job backend is running.' });
});

// ─── 7. START SERVER ────────────────────────────────────────
app.listen(port, () => {
    console.log(`✅ Backend listening on http://localhost:${port}`);
    console.log(`📋 Allowed origins:`, allowedOrigins);
});

export default app;