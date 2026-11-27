import * as communityService from '../services/community.service.js';
import { createCommunitySchema } from '../validators/community.validator.js';

export const createCommunity = async (req, res, next) => {
  try {
    const result = createCommunitySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid community data',
        errors: result.error.issues,
      });
    }

    const community = await communityService.createCommunity(
      result.data,
      req.user._id
    );

    return res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};

export const getCommunityByName = async (req, res, next) => {
  try {
    const community = await communityService.getCommunityByName(
      req.params.name
    );

    if (community.type === 'private') {
      const membership = req.user
        ? await communityService.isCommunityMember(
            req.user._id,
            community._id
          )
        : null;

      if (!membership) {
        return res.status(403).json({
          message: 'This community is private',
        });
      }
    }

    return res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};