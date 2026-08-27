import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import googleAuthRoutes from './routes/googleAuth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// --- Security Middleware ---
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Configuration (Simplified) ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://confident-wisdom-production-2fb8.up.railway.app',
    process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            callback(null, false); // Instead of error, just deny
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// --- Handle preflight OPTIONS requests explicitly ---
app.options('*', cors());

// --- Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload-cv', uploadRoutes);
app.use('/api/jobs', jobsRoutes);
// --- Health Check ---
app.get('/', (req, res) => {
    res.json({ message: 'Search Job backend is running.' });
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
    console.log(`Allowed origins:`, allowedOrigins);
});