import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, maxlength: 10000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // null = top level
    depth: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, parent: 1, createdAt: 1 });

export default mongoose.model('Comment', commentSchema);
