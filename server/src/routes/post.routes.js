import { Router } from 'express';
import {
    createPost,
    getPostById,
    updatePost,
    deletePost
} from '../controllers/post.controller.js';
import { summarizePost } from '../controllers/ai.controller.js'; // AI

import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { isOwner } from '../middlewares/isOwner.js';
import { aiLimiter } from '../middlewares/rateLimiter.js'; // AI

const router = Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/:id', getPostById);
router.patch('/:id', protect, isOwner, upload.single('image'), updatePost);
router.delete('/:id', protect, isOwner, deletePost);

router.post('/:id/summary', protect, aiLimiter, summarizePost); // AI

export default router; 