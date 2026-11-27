
import Post from '../models/Post.js';

export const isOwner = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || post.isDeleted) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not allowed to modify this post'
            });
        }

        req.post = post;
        next();
    } catch (error) {
        next(error);
    }
};
