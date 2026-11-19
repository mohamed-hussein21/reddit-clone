import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType' },
    targetType: { type: String, enum: ['Post', 'Comment'], required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

// THE key rule: max one vote per user per post/comment (DB guarantees it, even under concurrency)
voteSchema.index({ user: 1, target: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
