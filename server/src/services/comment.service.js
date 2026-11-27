import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { ApiError } from '../utils/ApiError.js';
import { buildCommentTree } from '../utils/buildCommentTree.js';

const MAX_DEPTH = 10; // replies deeper than this are not allowed
const AUTHOR_FIELDS = 'username displayName avatar';

// Finds a post that can still receive comments
async function findActivePost(postId) {
  const post = await Post.findOne({ _id: postId, isDeleted: false, isRemoved: false });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  return post;
}

// Finds a comment and checks that the user wrote it
async function findOwnComment(commentId, userId) {
  const comment = await Comment.findById(commentId);

  if (!comment || comment.isDeleted || comment.isRemoved) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!comment.author.equals(userId)) {
    throw new ApiError(403, 'You can only modify your own comments');
  }

  return comment;
}

// Hides the text and author of deleted / removed comments,
// but keeps them in the tree so their replies stay visible
function hideIfGone(comment) {
  if (comment.isRemoved) {
    return { ...comment, body: '[removed]', author: null };
  }

  if (comment.isDeleted) {
    return { ...comment, body: '[deleted]', author: null };
  }

  return comment;
}

// Create a top-level comment or a reply
export async function createComment({ postId, parentId, body }, userId) {
  await findActivePost(postId);

  let depth = 0;

  if (parentId) {
    const parent = await Comment.findOne({ _id: parentId, post: postId });

    if (!parent || parent.isDeleted || parent.isRemoved) {
      throw new ApiError(404, 'Parent comment not found');
    }

    if (parent.depth + 1 > MAX_DEPTH) {
      throw new ApiError(400, 'This thread is too deep to reply to');
    }

    depth = parent.depth + 1;
  }

  const comment = await Comment.create({
    body,
    author: userId,
    post: postId,
    parent: parentId || null,
    depth,
  });

  // $inc is atomic, so two comments at the same time are both counted
  await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });

  return comment.populate('author', AUTHOR_FIELDS);
}

// All comments of a post, as a nested tree (oldest first)
export async function getPostComments(postId) {
  await findActivePost(postId);

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate('author', AUTHOR_FIELDS)
    .lean();

  return buildCommentTree(comments.map(hideIfGone));
}

// Edit own comment
export async function updateComment(commentId, userId, body) {
  const comment = await findOwnComment(commentId, userId);

  comment.body = body;
  comment.isEdited = true;
  await comment.save();

  return comment.populate('author', AUTHOR_FIELDS);
}

// Delete own comment (soft delete, replies stay)
export async function deleteComment(commentId, userId) {
  const comment = await findOwnComment(commentId, userId);

  comment.isDeleted = true;
  await comment.save();

  await Post.updateOne({ _id: comment.post }, { $inc: { commentsCount: -1 } });
}
