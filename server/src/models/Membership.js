
import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
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

        role: {
            type: String,
            enum: ['member', 'moderator'],
            default: 'member'
        }
    },
    {
        timestamps: true
    }
);

// A user can join a community only once
membershipSchema.index(
    { user: 1, community: 1 },
    { unique: true }
);

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;
