import pool from '../db.js';

// ============================================
// CONTEXT ENGINE - Builds user context for AI
// ============================================

/**
 * Get user profile data
 */
async function getUserProfile(userId) {
    const { rows } = await pool.query(
        `SELECT id, fullName, email, created_at FROM users WHERE id = $1`,
        [userId]
    );
    return rows[0] || null;
}

/**
 * Get user preferences (from user_profiles table)
 */
async function getUserPreferences(userId) {
    const { rows } = await pool.query(
        `SELECT skills, preferences, location, experience_level, education 
         FROM user_profiles WHERE user_id = $1`,
        [userId]
    );
    return rows[0] || null;
}

/**
 * Get user's recent applications
 */
async function getRecentApplications(userId, limit = 5) {
    const { rows } = await pool.query(
        `SELECT a.id, a.job_id, a.status, a.created_at, 
                j.title, j.company, j.location
         FROM applications a
         JOIN jobs j ON a.job_id = j.id
         WHERE a.user_id = $1
         ORDER BY a.created_at DESC
         LIMIT $2`,
        [userId, limit]
    );
    return rows;
}

/**
 * Get user's saved jobs
 */
async function getSavedJobs(userId, limit = 5) {
    const { rows } = await pool.query(
        `SELECT j.id, j.title, j.company, j.location, j.category
         FROM saved_jobs sj
         JOIN jobs j ON sj.job_id = j.id
         WHERE sj.user_id = $1
         LIMIT $2`,
        [userId, limit]
    );
    return rows;
}

/**
 * Get user's recent chat history
 */
async function getRecentChats(userId, limit = 3) {
    const { rows } = await pool.query(
        `SELECT message, response, created_at
         FROM chat_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [userId, limit]
    );
    return rows;
}

/**
 * Format context for AI
 */
function formatContextForAI(context) {
    const lines = [];

    lines.push(`- Name: ${context.user?.fullName || 'User'}`);
    lines.push(`- Email: ${context.user?.email || 'N/A'}`);
    lines.push(`- Skills: ${context.profile?.skills?.join(', ') || 'Not specified'}`);
    lines.push(`- Location: ${context.profile?.location || 'Not specified'}`);
    lines.push(`- Experience: ${context.profile?.experience_level || 'Not specified'}`);

    if (context.recentApplications.length > 0) {
        lines.push('\nRECENT APPLICATIONS:');
        context.recentApplications.forEach(a => {
            lines.push(`  - ${a.title} at ${a.company} (${a.status})`);
        });
    }

    if (context.savedJobs.length > 0) {
        lines.push('\nSAVED JOBS:');
        context.savedJobs.forEach(j => {
            lines.push(`  - ${j.title} at ${j.company}`);
        });
    }

    return lines.join('\n');
}

/**
 * Build full user context for AI
 */
export async function buildUserContext(userId) {
    const [user, profile, applications, savedJobs, chats] = await Promise.all([
        getUserProfile(userId),
        getUserPreferences(userId),
        getRecentApplications(userId),
        getSavedJobs(userId),
        getRecentChats(userId),
    ]);

    const context = {
        user,
        profile,
        recentApplications: applications,
        savedJobs: savedJobs,
        recentChats: chats,
    };

    return {
        raw: context,
        formatted: formatContextForAI(context),
    };
}

export default {
    buildUserContext,
    getUserProfile,
    getUserPreferences,
    getRecentApplications,
    getSavedJobs,
    getRecentChats,
};