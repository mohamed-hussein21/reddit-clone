import CommentItem from './CommentItem';

// Renders a list of comments. Each CommentItem renders its own
// replies with another CommentTree, so the tree is drawn recursively.
export default function CommentTree({ comments, actions }) {
  if (!comments || comments.length === 0) return null;

  return (
    <ul className="comment-tree">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} actions={actions} />
      ))}
    </ul>
  );
}
