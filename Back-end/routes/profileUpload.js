import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import authenticate from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

// ─── Supabase Storage Setup ────────────────────────────────
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access
);

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
        }
    },
});

// ─── POST /api/profile/upload-file ──────────────────────────
router.post('/upload-file', authenticate, upload.single('file'), async (req, res) => {
    try {
        const { section, itemIndex } = req.body; // 'education', 'experience', 'certification'
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.user.id;
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${userId}/${section}/${Date.now()}.${fileExt}`;
        const bucketName = 'profile-files';

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
            });

        if (error) {
            console.error('Storage upload error:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        const fileUrl = urlData.publicUrl;

        // ─── Update the profile JSON with the file URL ──────
        // Fetch current profile
        const { rows } = await pool.query(
            `SELECT ${section} FROM user_profiles WHERE user_id = $1`,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const items = rows[0][section] || [];
        const index = parseInt(itemIndex, 10);
        if (!items[index]) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Add file_url to the item
        items[index].file_url = fileUrl;

        // Save back to database
        await pool.query(
            `UPDATE user_profiles SET ${section} = $1, updated_at = NOW() WHERE user_id = $2`,
            [JSON.stringify(items), userId]
        );

        res.json({ fileUrl });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

export default router;