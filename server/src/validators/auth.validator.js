export function validateRegister(req, res, next) {
    const { username, email, password } = req.body || {};

    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
    ) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username.trim())) {
        return res.status(400).json({
            message: 'Invalid username'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
            message: 'Invalid email'
        });
    }

    if (password.length < 8 || Buffer.byteLength(password) > 72) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters and at most 72 bytes'
        });
    }

    next();
}

export function validateLogin(req, res, next) {
    const { email, password } = req.body || {};

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password ||
        Buffer.byteLength(password) > 72
    ) {
        return res.status(400).json({
            message: 'Enter a valid email and password'
        });
    }

    next();
}