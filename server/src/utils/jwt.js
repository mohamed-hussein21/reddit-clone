import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(userId) {
    return jwt.sign(
        { userId },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
            algorithm: 'HS256'
        }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret, {
        algorithms: ['HS256']
    });
}