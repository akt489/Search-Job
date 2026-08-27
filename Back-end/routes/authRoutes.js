import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dns from 'dns';
import { promisify } from 'util';
import pool from '../db.js';

const router = express.Router();
const resolveMx = promisify(dns.resolveMx);

// ============================================
// 1. TOKEN HELPER
// ============================================
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

// ============================================
// 2. EMAIL VALIDATION HELPERS
// ============================================

// 2a. Check email format
function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 2b. Check against disposable/temporary email domains
function isDisposableEmail(email) {
    const domain = email.split('@')[1].toLowerCase();

    const disposableDomains = [
        'mailinator.com', 'guerrillamail.com', '10minutemail.com',
        'tempmail.com', 'temp-mail.org', 'yopmail.com',
        'throwawaymail.com', 'fakeinbox.com', 'getairmail.com',
        'trashmail.com', 'spamgourmet.com', 'mailexpire.com',
        'mintemail.com', 'sharklasers.com', 'guerrillamail.org',
        'guerrillamail.net', 'guerrillamail.biz', 'mailnesia.com',
        'mailnator.com', 'tempinbox.com', 'emailondeck.com',
        'burnermail.io', 'maildrop.cc', 'guerrillamail.info',
        'mailcatch.com', 'spambox.us', 'mytrashmail.com',
        'trash2009.com', 'spambob.com', 'spambob.net',
        'spambob.org', 'spam.la', 'spam.su', 'spamspot.com',
        'spamstack.net', 'spamthis.com', 'spamthis.co.uk',
        'spamtrail.com', 'spamtrap.net', 'spamuser.com',
        'spamville.com', 'spamworld.com', 'spamwriter.com',
        'stuffmail.de', 'supergreatmail.com', 'teewars.org',
        'temporaryemail.net', 'temporaryforwarding.com',
        'temporarily.de', 'tempymail.com', 'testmail.com',
        'testmail.org', 'testmail.net', 'trashinbox.com',
        'trashmail.at', 'trashmail.de', 'trashmail.io',
        'trashmail.me', 'trashmail.net', 'trashmail.org',
        'trashmail.ws', 'trashmailer.com', 'trashymail.com',
        'trialmail.com', 'trialmail.de', 'trialmail.net',
        'trialmail.org', 'unmail.com', 'uooju.com',
        'uopmail.com', 'uowap.com', 'ureachable.com',
        'uzpage.com', 'v0s.com', 'v4mail.com', 'v7mail.com',
        'v8mail.com', 'vacationmail.com', 'valemail.net',
        'vamail.com', 'varbes.com', 'varmail.com',
        'varnet.com', 'vbnv.com', 'vcast.net', 'vcom.com',
        'vdance.com', 'vermont.net', 'vernon.net',
        'versatile.com', 'verson.com', 'verte.net',
        'vertical.com', 'vertmail.com', 'vesmail.com',
        'vnn.com', 'vns.com', 'voicemail.com',
        'void.com', 'volcanomail.com', 'voltage.com',
        'volume.com', 'vomail.com', 'vortex.com',
        'votemail.com', 'vpn.com', 'vps.com', 'vrmail.com',
        'vsp.com', 'vts.com', 'vtx.com', 'vulcanmail.com',
        'vweb.com', 'vxmail.com', 'vyoo.com', 'w3.to',
        'w3mail.com', 'w4.com', 'w7.com', 'w8.com',
        'waiting.com', 'walkmail.com', 'wall.com',
        'wamail.com', 'wampus.com', 'wanderer.com',
        'wannamail.com', 'warpmail.com', 'warrior.com',
        'watch.com', 'water.com', 'wavemail.com',
        'wazamail.com', 'wbxmail.com', 'we.com', 'web.com',
        'webmail.com', 'webtopmail.com', 'wetrain.com',
        'whale.com', 'whales.com', 'whipmail.com',
        'white.com', 'whizmail.com', 'whoever.com',
        'whole.com', 'whymail.com', 'wi.com', 'wildmail.com',
        'will.com', 'wimail.com', 'win.com', 'winmail.com',
        'wire.com', 'wireless.com', 'wishmail.com',
        'wizmail.com', 'wmail.com', 'wo.com', 'wolf.com',
        'wolfs.com', 'wonder.com', 'woo.com', 'word.com',
        'work.com', 'workmail.com', 'world.com', 'worm.com',
        'wow.com', 'wpmail.com', 'wr.com', 'wrest.com',
        'write.com', 'wrong.com', 'ws.com', 'wsmail.com',
        'wt.com', 'wvnv.com', 'ww.com', 'www.com',
        'x-mail.net', 'x-way.com', 'xagmail.com', 'xar.com',
        'xc.com', 'xemaps.com', 'xenmail.com',
        'xenophobia.com', 'xmail.com', 'xmx.com', 'xone.com',
        'xoom.com', 'xox.com', 'xrap.com', 'xroot.com',
        'xsmail.com', 'xxt.com', 'xy.com', 'xyz.com',
        'y7mail.com', 'ya.com', 'yahoo.com', 'yandex.com',
        'yaxmail.com', 'yb.com', 'yccmail.com', 'yeah.net',
        'yellow.com', 'yes.com', 'yg.com', 'ymail.com',
        'yn.com', 'yo.com', 'yopmail.com', 'you.com',
        'youmail.com', 'young.com', 'your.com', 'yourmail.com',
        'yours.com', 'yoyo.com', 'yp.com', 'ypmail.com',
        'ys.com', 'yt.com', 'yu.com', 'yuan.com', 'yule.com',
        'yum.com', 'yuppie.com', 'yuut.com', 'yvel.com',
        'yy.com', 'z3.com', 'z4.com', 'z7.com', 'z8.com',
        'z9.com', 'za.com', 'zage.com', 'zap.com', 'zarmail.com',
        'zb.com', 'zc.com', 'zd.com', 'ze.com', 'zehn.com',
        'zei.com', 'zek.com', 'zel.com', 'zen.com', 'zenmail.com',
        'zero.com', 'zeromail.com', 'zf.com', 'zg.com', 'zh.com',
        'zi.com', 'zin.com', 'zip.com', 'zipmail.com', 'zmail.com',
        'zo.com', 'zoho.com', 'zombie.com', 'zoom.com', 'zoomail.com',
        'zou.com', 'zox.com', 'zp.com', 'zq.com', 'zr.com', 'zt.com',
        'zu.com', 'zum.com', 'zuv.com', 'zv.com', 'zw.com', 'zx.com',
        'zy.com', 'zz.com',
    ];

    return disposableDomains.includes(domain);
}

// 2c. Check if domain is a valid Google (Gmail) domain
async function isGoogleEmailDomain(email) {
    const domain = email.split('@')[1].toLowerCase();

    // First, check if it's gmail.com or googlemail.com
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        return true;
    }

    // For custom domains, check if MX records point to Google
    try {
        const addresses = await Promise.race([
            resolveMx(domain),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('DNS lookup timed out')), 5000)
            ),
        ]);

        if (!addresses || addresses.length === 0) {
            return false;
        }

        // Check if any MX record points to Google's servers
        const googleMxDomains = [
            'google.com',
            'googlemail.com',
            'gmail.com',
        ];

        const isGoogle = addresses.some((record) => {
            const exchange = record.exchange.toLowerCase();
            return googleMxDomains.some((googleDomain) =>
                exchange.includes(googleDomain)
            );
        });

        return isGoogle;
    } catch (error) {
        console.warn(`DNS lookup failed for ${domain}:`, error.message);
        return false;
    }
}

// 2d. Check if domain has any MX records (fallback for non-Google domains)
async function hasValidMXRecords(email) {
    const domain = email.split('@')[1];
    try {
        const addresses = await Promise.race([
            resolveMx(domain),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('DNS lookup timed out')), 5000)
            ),
        ]);
        return addresses && addresses.length > 0;
    } catch (error) {
        console.warn(`DNS lookup failed for ${domain}:`, error.message);
        return false;
    }
}

// ============================================
// 3. REGISTER ROUTE (with Google-only validation)
// ============================================
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    // 1. Basic presence check
    if (!fullName?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
            error: 'Full name, email, and password are required.',
        });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Format validation
    if (!isValidEmailFormat(normalizedEmail)) {
        return res.status(400).json({
            error: 'Please enter a valid email address format (e.g., user@domain.com).',
        });
    }

    // 3. Disposable email check
    if (isDisposableEmail(normalizedEmail)) {
        return res.status(400).json({
            error: 'Temporary or disposable email addresses are not allowed. Please use a real email address.',
        });
    }

    // 4. Check if it's a Google email domain (Gmail or Google Workspace)
    const isGoogle = await isGoogleEmailDomain(normalizedEmail);
    if (!isGoogle) {
        return res.status(400).json({
            error: 'Only Gmail and Google Workspace email addresses are allowed. Please use a Google-powered email address (e.g., @gmail.com, @googlemail.com, or your company\'s Google Workspace email).',
        });
    }

    try {
        // 5. Check for existing user
        const { rows: existing } = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        );
        if (existing.length) {
            return res.status(409).json({
                error: 'This email is already registered.',
            });
        }

        // 6. Hash password and insert user
        const passwordHash = await bcrypt.hash(password, 10);
        const { rows: result } = await pool.query(
            'INSERT INTO users (fullName, email, passwordHash) VALUES ($1, $2, $3) RETURNING id',
            [fullName.trim(), normalizedEmail, passwordHash]
        );

        const user = {
            id: result[0].id,
            fullName: fullName.trim(),
            email: normalizedEmail,
        };

        const token = createToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Unable to register user. Please try again later.',
        });
    }
});

// ============================================
// 4. LOGIN ROUTE
// ============================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({
            error: 'Email and password are required.',
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const { rows } = await pool.query(
            'SELECT id, fullName, email, passwordHash FROM users WHERE email = $1',
            [normalizedEmail]
        );
        const user = rows[0];

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password.',
            });
        }

        if (!user.passwordHash) {
            console.error('User has no passwordHash set:', user.email);
            return res.status(401).json({
                error: 'Invalid email or password.',
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({
                error: 'Invalid email or password.',
            });
        }

        const safeUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
        };
        const token = createToken(safeUser);

        res.json({ user: safeUser, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Unable to log in at this time.',
        });
    }
});

// ============================================
// 5. FORGOT PASSWORD ROUTE
// ============================================
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        return res.status(400).json({
            error: 'Email is required.',
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const { rows } = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        );
        if (!rows.length) {
            return res.json({
                message: 'If this email is registered, a password reset link will be sent.',
            });
        }

        res.json({
            message: 'If this email is registered, a password reset link will be sent.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to process password reset right now.',
        });
    }
});

export default router;