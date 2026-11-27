import rateLimit from 'express-rate-limit';

// Limit AI summary requests: 10 per user per hour
// Must be used AFTER the `protect` middleware (it needs req.user)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => req.user._id.toString(),
    message: {
        message: 'Too many summary requests. Try again in an hour.'
    }
});