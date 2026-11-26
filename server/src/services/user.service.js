import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Membership from '../models/Membership.js';
import '../models/Community.js';

const publicFields =
    'username displayName bio avatar banner karma createdAt';

export async function getProfile(username) {
    return await User.findOne({
        username: username.toLowerCase()
    }).select(publicFields);
}

export async function updateProfile(userId, data) {
    return await User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true
        }
    ).select(publicFields);
}

export async function getUserPosts(userId) {
    return await Post.find({
        author: userId,
        isDeleted: false,
        isRemoved: false
    }).sort({ createdAt: -1 });
}

export async function getUserComments(userId) {
    return await Comment.find({
        author: userId,
        isDeleted: false,
        isRemoved: false
    }).sort({ createdAt: -1 });
}

export async function getUserCommunities(userId) {
    return await Membership.find({
        user: userId
    }).populate('community');
}