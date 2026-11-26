import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

async function getUser(req) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return null;
    }

    const token = header.split(' ')[1];
    const data = verifyToken(token);

    return await User.findById(data.userId);
}

export async function protect(req, res, next) {
    try {
        req.user = await getUser(req);
    } catch (error) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'CastError'
        ) {
            return res.status(401).json({
                message: 'Invalid or expired token'
            });
        }

        return next(error);
    }

    if (!req.user) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    next();
}

export async function optionalAuth(req, res, next) {
    try {
        req.user = await getUser(req);
    } catch (error) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'CastError'
        ) {
            req.user = null;
        } else {
            return next(error);
        }
    }

    next();
}