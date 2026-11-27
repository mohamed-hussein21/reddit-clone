import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';

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
