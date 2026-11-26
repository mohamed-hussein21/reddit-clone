import { Router } from 'express';
import {
  createCommunity,
  getCommunityByName,
} from '../controllers/community.controller.js';

import {
  protect,
  optionalAuth,
} from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, createCommunity);

router.get('/:name', optionalAuth, getCommunityByName);

export default router;