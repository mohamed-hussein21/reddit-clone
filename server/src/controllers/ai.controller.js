import * as aiService from '../services/ai.service.js';

// POST /api/posts/:id/summary
export const summarizePost = async (req, res, next) => {
  try {
    const result = await aiService.summarizePost(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
