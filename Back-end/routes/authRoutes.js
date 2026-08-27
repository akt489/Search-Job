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

        // ✅ Check if user registered via Google OAuth
        if (user.passwordHash === 'google_oauth') {
            return res.status(401).json({
                error: 'This account was created with Google. Please use "Continue with Google" to sign in.',
            });
        }

        // Check if passwordHash exists
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