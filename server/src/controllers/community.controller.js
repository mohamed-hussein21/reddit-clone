import * as communityService from '../services/community.service.js';
import {
  createCommunitySchema,
  reviewJoinRequestSchema,
} from '../validators/community.validator.js';

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

export const joinCommunity = async (req, res, next) => {
  try {
    const result = await communityService.joinCommunity(
      req.params.name,
      req.user._id
    );

    if (result.status === 'pending') {
      return res.status(202).json({
        message: 'Join request submitted successfully',
        status: 'pending',
        joinRequest: result.joinRequest,
      });
    }

    return res.status(200).json({
      message: 'Community joined successfully',
      status: 'joined',
      community: result.community,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req, res, next) => {
  try {
    const community = await communityService.leaveCommunity(
      req.params.name,
      req.user._id
    );

    return res.status(200).json({
      message: 'Community left successfully',
      community,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingJoinRequests = async (req, res, next) => {
  try {
    const requests = await communityService.getPendingJoinRequests(
      req.community._id
    );

    return res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const reviewJoinRequest = async (req, res, next) => {
  try {
    const result = reviewJoinRequestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid join request status',
        errors: result.error.issues,
      });
    }

    const updatedRequest = await communityService.reviewJoinRequest(
      req.community._id,
      req.params.requestId,
      req.user._id,
      result.data.status
    );

    return res.status(200).json({
      message: `Join request ${updatedRequest.status} successfully`,
      joinRequest: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};