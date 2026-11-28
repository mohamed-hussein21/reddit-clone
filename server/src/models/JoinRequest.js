import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            required: true
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

joinRequestSchema.index(
    { user: 1, community: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'pending' }
    }
);

joinRequestSchema.index(
    { community: 1, status: 1 }
);

const JoinRequest = mongoose.model(
    'JoinRequest',
    joinRequestSchema
);

export default JoinRequest;