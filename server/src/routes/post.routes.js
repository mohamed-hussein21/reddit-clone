import { Router } from 'express';
import {
    createPost,
    getPostById,
    updatePost,
    deletePost
} from '../controllers/post.controller.js';
import { summarizePost } from '../controllers/ai.controller.js'; // AI
import { getHomeFeed, getPopularFeed } from '../controllers/feed.controller.js'; // Feed

import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { isOwner } from '../middlewares/isOwner.js';
import { aiLimiter } from '../middlewares/rateLimiter.js'; // AI

const router = Router();

// Feed (must be BEFORE '/:id', or Express will treat "feed" as an id)
router.get('/feed', protect, getHomeFeed);
router.get('/popular', getPopularFeed);

router.post('/', protect, upload.single('image'), createPost);
router.get('/:id', getPostById);
router.patch('/:id', protect, isOwner, upload.single('image'), updatePost);
router.delete('/:id', protect, isOwner, deletePost);

router.post('/:id/summary', protect, aiLimiter, summarizePost); // AI

export default router;