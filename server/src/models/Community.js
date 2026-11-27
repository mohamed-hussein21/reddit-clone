
import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 21,
            match: /^[A-Za-z0-9_]+$/
        },

        title: {
            type: String,
            default: '',
            trim: true
        },

        description: {
            type: String,
            default: '',
            maxlength: 500
        },

        icon: {
            type: String,
            default: ''
        },

        banner: {
            type: String,
            default: ''
        },

        type: {
            type: String,
            enum: ['public', 'restricted', 'private'],
            default: 'public'
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        membersCount: {
            type: Number,
            default: 1
        },

        rules: [
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    default: ''
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

communitySchema.index({
    name: 'text',
    title: 'text',
    description: 'text'
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
