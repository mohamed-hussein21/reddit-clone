import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';

// Moderator removes a post from their community
export async function removePost(community, postId) {
  // The post must belong to THIS community, so a moderator of
  // one community can't remove posts from another one
  const post = await Post.findOne({ _id: postId, community: community._id });

  if (!post || post.isDeleted) {
    throw new ApiError(404, 'Post not found in this community');
  }

  post.isRemoved = true;
  await post.save();
}

// Moderator removes a comment from their community
export async function removeComment(community, commentId) {
  const comment = await Comment.findById(commentId).populate('post', 'community');

  if (!comment || !comment.post || !comment.post.community.equals(community._id)) {
    throw new ApiError(404, 'Comment not found in this community');
  }

  // Only count it down once (it may already be deleted or removed)
  const wasVisible = !comment.isDeleted && !comment.isRemoved;

  comment.isRemoved = true;
  await comment.save();

  if (wasVisible) {
    await Post.updateOne({ _id: comment.post._id }, { $inc: { commentsCount: -1 } });
  }
}

// Public list of the moderators of a community (for the sidebar,
// and so the frontend knows who can see the Remove buttons)
export async function getModerators(communityId) {
  const exists = await Community.exists({ _id: communityId });

  if (!exists) {
    throw new ApiError(404, 'Community not found');
  }

  const memberships = await Membership.find({ community: communityId, role: 'moderator' })
    .populate('user', 'username displayName avatar')
    .lean();

  return memberships.map((membership) => membership.user).filter(Boolean);
}
