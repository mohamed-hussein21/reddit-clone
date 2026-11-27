import * as feedService from '../services/feed.service.js';

// GET /api/posts/feed?sort=new|top&page=1&limit=10
export const getHomeFeed = async (req, res, next) => {
  try {
    const result = await feedService.getHomeFeed(req.user._id, req.query);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/popular?sort=new|top&page=1&limit=10
export const getPopularFeed = async (req, res, next) => {
  try {
    const result = await feedService.getPopularFeed(req.query);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/communities/:name/posts?sort=new|top&page=1&limit=10
export const getCommunityFeed = async (req, res, next) => {
  try {
    const result = await feedService.getCommunityFeed(req.params.name, req.user, req.query);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
