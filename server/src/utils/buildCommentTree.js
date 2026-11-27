// Converts a flat list of comments into a nested tree.
// Each comment gets a `replies` array that holds its direct children.
// Input: plain objects (from .lean()), already sorted by createdAt.
export function buildCommentTree(comments) {
  const byId = new Map();
  const roots = [];

  // 1) Copy every comment into the map, with an empty replies array
  for (const comment of comments) {
    byId.set(comment._id.toString(), { ...comment, replies: [] });
  }

  // 2) Put every comment under its parent, or in roots if it has none
  for (const comment of byId.values()) {
    const parent = comment.parent ? byId.get(comment.parent.toString()) : null;

    if (parent) {
      parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  return roots;
}
