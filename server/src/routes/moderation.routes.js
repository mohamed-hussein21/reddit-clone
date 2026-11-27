import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { isModerator } from '../middlewares/isModerator.js';
import { getModerators, removePost, removeComment } from '../controllers/moderation.controller.js';

// Mounted on /api/communities (next to community.routes.js)
const router = Router();

router.get('/:id/moderators', getModerators);

router.delete('/:id/mod/posts/:postId', protect, isModerator, removePost);
router.delete('/:id/mod/comments/:commentId', protect, isModerator, removeComment);

export default router;
