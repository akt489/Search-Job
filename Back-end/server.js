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

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://confident-wisdom-production-2fb8.up.railway.app', // Your frontend URL
    process.env.CLIENT_ORIGIN,
].filter(Boolean); // Remove any undefined values

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('Blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// --- Handle preflight OPTIONS requests explicitly ---
app.options('*', cors());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload-cv', uploadRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/auth', googleAuthRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Search Job backend is running.' });
});

app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});