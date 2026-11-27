import * as commentService from '../services/comment.service.js';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validator.js';

// Sends 400 with the zod errors, returns null if invalid
function validate(schema, data, res) {
  const result = schema.safeParse(data);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid comment data', errors: result.error.issues });
    return null;
  }

  return result.data;
}

// POST /api/comments
export async function createComment(req, res, next) {
  try {
    const data = validate(createCommentSchema, req.body || {}, res);
    if (!data) return;

    const comment = await commentService.createComment(data, req.user._id);

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

// GET /api/comments/post/:postId
export async function getPostComments(req, res, next) {
  try {
    const comments = await commentService.getPostComments(req.params.postId);

    res.json(comments);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/comments/:id
export async function updateComment(req, res, next) {
  try {
    const data = validate(updateCommentSchema, req.body || {}, res);
    if (!data) return;

    const comment = await commentService.updateComment(req.params.id, req.user._id, data.body);

    res.json(comment);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/comments/:id
export async function deleteComment(req, res, next) {
  try {
    await commentService.deleteComment(req.params.id, req.user._id);

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
}
