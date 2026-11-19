import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    displayName: { type: String, maxlength: 30 },
    bio: { type: String, maxlength: 200 },
    avatar: String,
    banner: String,
    karma: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ username: 'text', displayName: 'text' });
// TODO: pre('save') hash password with bcrypt · method comparePassword()

export default mongoose.model('User', userSchema);
