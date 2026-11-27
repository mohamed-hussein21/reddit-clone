import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';

const router = Router();

router.get('/post/:postId', getPostComments);
router.post('/', protect, createComment);
router.patch('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
