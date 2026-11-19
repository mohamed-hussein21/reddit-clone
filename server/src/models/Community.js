import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, match: /^[A-Za-z0-9_]{3,21}$/ },
    title: String,
    description: { type: String, maxlength: 500 },
    icon: String,
    banner: String,
    type: { type: String, enum: ['public', 'restricted', 'private'], default: 'public' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // = moderator
    membersCount: { type: Number, default: 1 },
    rules: [{ title: String, description: String }],
  },
  { timestamps: true }
);

communitySchema.index({ name: 'text', title: 'text', description: 'text' });

export default mongoose.model('Community', communitySchema);
