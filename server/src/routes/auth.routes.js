import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
    register,
    login,
    logout,
    getMe
} from '../controllers/auth.controller.js';

import { protect } from '../middlewares/auth.js';

import {
    validateRegister,
    validateLogin
} from '../validators/auth.validator.js';

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { message: 'Too many attempts. Try again later.' }
});

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;