import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',           // Local development
    process.env.CLIENT_ORIGIN,         // For Railway frontend (set this env var)
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

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
app.use('/api/upload-cv', uploadRoutes);
app.use('/api/jobs', jobsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Search Job backend is running.' });
});

app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});