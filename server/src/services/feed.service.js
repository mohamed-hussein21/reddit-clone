import Post from '../models/Post.js';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildSort } from '../utils/pagination.js';

// Shared helper: run the paginated + sorted query for any filter
const getPaginatedPosts = async (filter, query) => {
    const { page, limit, skip } = getPagination(query);
    const sort = buildSort(query.sort);

    const fullFilter = { ...filter, isDeleted: false, isRemoved: false };

    // Run both queries at the same time
    const [posts, total] = await Promise.all([
        Post.find(fullFilter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('author', 'username displayName avatar')
            .populate('community', 'name title icon')
            .lean(),
        Post.countDocuments(fullFilter)
    ]);

    return {
        posts,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total
    };
};

// Home: posts from the communities the user joined
export const getHomeFeed = async (userId, query) => {
    const communityIds = await Membership.find({ user: userId }).distinct('community');

    return getPaginatedPosts({ community: { $in: communityIds } }, query);
};

// Popular: posts from all communities except private ones
export const getPopularFeed = async (query) => {
    const privateIds = await Community.find({ type: 'private' }).distinct('_id');

    return getPaginatedPosts({ community: { $nin: privateIds } }, query);
};

// Community page: posts of one community (by name)
export const getCommunityFeed = async (name, user, query) => {
    const community = await Community.findOne({ name: name.toLowerCase() });

    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    if (community.type === 'private') {
        const isMember = user
            ? await Membership.exists({ user: user._id, community: community._id })
            : null;

        if (!isMember) {
            throw new ApiError(403, 'This community is private');
        }
    }

    return getPaginatedPosts({ community: community._id }, query);
};