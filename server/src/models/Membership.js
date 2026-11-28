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
            default: 'member',
            required: true
        }
    },
    {
        timestamps: true
    }
);

membershipSchema.index(
    { user: 1, community: 1 },
    { unique: true }
);

membershipSchema.index(
    { community: 1, role: 1 }
);

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;