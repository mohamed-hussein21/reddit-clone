import { Router } from 'express';
import {
  createCommunity,
  getCommunityByName,
  joinCommunity,
  leaveCommunity,
  getPendingJoinRequests,
  reviewJoinRequest,
} from '../controllers/community.controller.js';
import { getCommunityFeed } from '../controllers/feed.controller.js'; // Feed

import {
  protect,
  optionalAuth,
} from '../middlewares/auth.js';

import { isModerator } from '../middlewares/isModerator.js';

const router = Router();

router.post('/', protect, createCommunity);

router.get('/:name', optionalAuth, getCommunityByName);
router.get('/:name/posts', optionalAuth, getCommunityFeed); // Feed

router.post('/:name/join', protect, joinCommunity);

router.post('/:name/leave', protect, leaveCommunity);

router.get('/:id/requests', protect, isModerator, getPendingJoinRequests);

router.patch('/:id/requests/:requestId', protect, isModerator, reviewJoinRequest);

export default router;