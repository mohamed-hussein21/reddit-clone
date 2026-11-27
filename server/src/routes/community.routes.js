import { Router } from 'express';
import {
  createCommunity,
  getCommunityByName,
} from '../controllers/community.controller.js';
import { getCommunityFeed } from '../controllers/feed.controller.js'; // Feed

import {
  protect,
  optionalAuth,
} from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, createCommunity);

router.get('/:name', optionalAuth, getCommunityByName);
router.get('/:name/posts', optionalAuth, getCommunityFeed); // Feed

export default router;