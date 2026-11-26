import { Router } from 'express';

import {
    getProfile,
    updateProfile,
    uploadAvatar,
    getUserPosts,
    getUserComments,
    getMyCommunities
} from '../controllers/user.controller.js';

import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.patch('/me', protect, updateProfile);

router.post(
    '/me/avatar',
    protect,
    upload.single('avatar'),
    uploadAvatar
);

router.get('/me/communities', protect, getMyCommunities);

router.get('/:username/posts', getUserPosts);
router.get('/:username/comments', getUserComments);
router.get('/:username', getProfile);

export default router;