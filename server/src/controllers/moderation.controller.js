import * as moderationService from '../services/moderation.service.js';

// DELETE /api/communities/:id/mod/posts/:postId
export async function removePost(req, res, next) {
  try {
    await moderationService.removePost(req.community, req.params.postId);

    res.json({ message: 'Post removed by moderator' });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/communities/:id/mod/comments/:commentId
export async function removeComment(req, res, next) {
  try {
    await moderationService.removeComment(req.community, req.params.commentId);

    res.json({ message: 'Comment removed by moderator' });
  } catch (error) {
    next(error);
  }
}

// GET /api/communities/:id/moderators
export async function getModerators(req, res, next) {
  try {
    const moderators = await moderationService.getModerators(req.params.id);

    res.json(moderators);
  } catch (error) {
    next(error);
  }
}
