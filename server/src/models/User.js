import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  displayName: {
    type: String,
    default: ''
  },

  bio: {
    type: String,
    default: ''
  },

  avatar: {
    type: String,
    default: ''
  },

  avatarPublicId: {
    type: String,
    default: ''
  },

  banner: {
    type: String,
    default: ''
  },

  karma: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.index({
  username: 'text',
  displayName: 'text'
});

export default mongoose.model('User', userSchema);