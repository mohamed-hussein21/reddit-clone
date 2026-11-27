
import * as postService from '../services/post.service.js';
import {
    createPostSchema,
    updatePostSchema
} from '../validators/post.validator.js';

// Create Post
export const createPost = async (req, res, next) => {
    try {
        const result = createPostSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid post data',
                errors: result.error.issues
            });
        }

        const post = await postService.createPost(
            result.data,
            req.user._id,
            req.file
        );

        return res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        next(error);
    }
};

// Get Post by ID
export const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);

        return res.status(200).json({ post });
    } catch (error) {
        next(error);
    }
};

// Update Post
export const updatePost = async (req, res, next) => {
    try {
        const hasBodyData = Object.keys(req.body || {}).length > 0;

        if (!hasBodyData && !req.file) {
            return res.status(400).json({
                message: 'Provide post data or a new image'
            });
        }

        const result = updatePostSchema.safeParse(req.body || {});

        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid post data',
                errors: result.error.issues
            });
        }

        const post = await postService.updatePost(
            req.post,
            result.data,
            req.file
        );

        return res.status(200).json({
            message: 'Post updated successfully',
            post
        });
    } catch (error) {
        next(error);
    }
};

// Delete Post
export const deletePost = async (req, res, next) => {
    try {
        const result = await postService.deletePost(req.post);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
