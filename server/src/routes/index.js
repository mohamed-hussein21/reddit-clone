import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import communityRoutes from './community.routes.js';
import postRoutes from './post.routes.js';
import commentRoutes from './comment.routes.js';
// import searchRoutes from './search.routes.js';
// import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/communities', communityRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
// router.use('/search', searchRoutes);
// router.use('/chat', chatRoutes);

export default router;
