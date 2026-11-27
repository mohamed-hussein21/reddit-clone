import Post from '../models/Post.js';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import { uploadImage, deleteImage } from './image.service.js';

// Create a new post
export const createPost = async (data, userId, imageFile) => {
    const community = await Community.findById(data.community);

    if (!community) {
        const error = new Error('Community not found');
        error.statusCode = 404;
        throw error;
    }

    if (community.type === 'private') {
        const isMember = await Membership.exists({
            user: userId,
            community: community._id
        });

        if (!isMember) {
            const error = new Error('You must be a member of this community');
            error.statusCode = 403;
            throw error;
        }
    }

    let imageData = {};

    if (imageFile) {
        const uploadedImage = await uploadImage(imageFile.buffer);

        imageData = {
            image: uploadedImage.url,
            imagePublicId: uploadedImage.publicId
        };
    }

    const post = await Post.create({
        ...data,
        ...imageData,
        author: userId
    });

    return post;
};

// Get a single post by ID
export const getPostById = async (postId) => {
    const post = await Post.findOne({
        _id: postId,
        isDeleted: false,
        isRemoved: false
    })
        .populate('author', 'username displayName avatar')
        .populate('community', 'name title icon');

    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }

    return post;
};

// Update a post (ownership checked by isOwner middleware)
export const updatePost = async (post, data, imageFile) => {
    const allowedFields = ['title', 'body', 'type', 'url'];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            post[field] = data[field];
        }
    });

    let oldImagePublicId = null;

    if (imageFile) {
        const uploadedImage = await uploadImage(imageFile.buffer);

        oldImagePublicId = post.imagePublicId;

        post.image = uploadedImage.url;
        post.imagePublicId = uploadedImage.publicId;
    }

    // The old AI summary no longer matches the edited post
    if (data.title !== undefined || data.body !== undefined) {
        post.aiSummary = '';
    }

    post.isEdited = true;

    await post.save();

    if (oldImagePublicId) {
        try {
            await deleteImage(oldImagePublicId);
        } catch (error) {
            console.error('Failed to delete old Cloudinary image:', error.message);
        }
    }

    return post;
};

// Soft delete a post (ownership checked by isOwner middleware)
export const deletePost = async (post) => {
    post.isDeleted = true;

    await post.save();

    return { message: 'Post deleted successfully' };
};