
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        body: {
            type: String,
            default: ''
        },

        type: {
            type: String,
            enum: ['text', 'image', 'link'],
            default: 'text'
        },

        url: {
            type: String,
            default: ''
        },

        image: {
            type: String,
            default: ''
        },

        imagePublicId: {
            type: String,
            default: ''
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
            required: true
        },

        score: {
            type: Number,
            default: 0
        },

        upvotes: {
            type: Number,
            default: 0
        },

        downvotes: {
            type: Number,
            default: 0
        },

        commentsCount: {
            type: Number,
            default: 0
        },

        isEdited: {
            type: Boolean,
            default: false
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        isRemoved: {
            type: Boolean,
            default: false
        },

        aiSummary: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// Indexes for faster queries
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ community: 1, score: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: 'text', body: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
