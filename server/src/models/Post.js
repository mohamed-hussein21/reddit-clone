import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    body: { type: String, default: '' },
    type: { type: String, enum: ['text', 'image', 'link'], default: 'text' },
    url: String,
    image: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    score: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }, // by author
    isRemoved: { type: Boolean, default: false }, // by moderator
    aiSummary: String, // cached AI summary
  },
  { timestamps: true }
);

// indexes for sorting + pagination
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ community: 1, score: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: 'text', body: 'text' });

export default mongoose.model('Post', postSchema);
