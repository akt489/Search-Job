import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import authenticate from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

fs.promises.mkdir(uploadsDir, { recursive: true }).catch((err) => {
    console.error('Unable to create uploads directory:', err);
});

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        cb(null, safeName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error('Only PDF, DOC and DOCX files are allowed.'));
        }
        cb(null, true);
    },
});

const router = express.Router();

router.post('/', authenticate, upload.single('cv'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a CV file.' });
    }

    try {
        const { filename, originalname, mimetype, size, path: filePath } = req.file;
        await pool.query(
            'INSERT INTO cvs (user_id, filename, original_name, mime_type, size, path) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, filename, originalname, mimetype, size, filePath]
        );

        res.json({ message: 'CV uploaded successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to save CV metadata to the database.' });
    }
});

export default router;
