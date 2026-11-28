import mongoose from 'mongoose';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import JoinRequest from '../models/JoinRequest.js';
import { ApiError } from '../utils/ApiError.js';

export const createCommunity = async (data, userId) => {
  const session = await mongoose.startSession();

  try {
    let community;

    await session.withTransaction(async () => {
      const [createdCommunity] = await Community.create(
        [
          {
            name: data.name.toLowerCase(),
            title: data.title,
            description: data.description,
            type: data.type,
            creator: userId,
            membersCount: 1,
          },
        ],
        { session }
      );

      community = createdCommunity;

      await Membership.create(
        [
          {
            user: userId,
            community: community._id,
            role: 'moderator',
          },
        ],
        { session }
      );
    });

    return community;
  } finally {
    await session.endSession();
  }
};

export const getCommunityByName = async (name) => {
  const community = await Community.findOne({
    name: name.toLowerCase()
  });

  if (!community) {
    throw new ApiError(404, 'Community not found');
  }

  return community;
};

export const isCommunityMember = async (userId, communityId) => {
  return await Membership.exists({
    user: userId,
    community: communityId,
  });
};

export const joinCommunity = async (name, userId) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const community = await Community.findOne({
        name: name.toLowerCase(),
      }).session(session);

      if (!community) {
        throw new ApiError(404, 'Community not found');
      }

      const membership = await Membership.exists({
        user: userId,
        community: community._id,
      }).session(session);

      if (membership) {
        throw new ApiError(409, 'You are already a member');
      }

      if (community.type === 'private') {
        const existingRequest = await JoinRequest.exists({
          user: userId,
          community: community._id,
          status: 'pending',
        }).session(session);

        if (existingRequest) {
          throw new ApiError(
            409,
            'You already have a pending join request'
          );
        }

        const [joinRequest] = await JoinRequest.create(
          [
            {
              user: userId,
              community: community._id,
              status: 'pending',
            },
          ],
          { session }
        );

        result = {
          status: 'pending',
          joinRequest,
        };

        return;
      }

      await Membership.create(
        [
          {
            user: userId,
            community: community._id,
            role: 'member',
          },
        ],
        { session }
      );

      const updatedCommunity = await Community.findByIdAndUpdate(
        community._id,
        { $inc: { membersCount: 1 } },
        { new: true, session }
      );

      result = {
        status: 'joined',
        community: updatedCommunity,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

export const leaveCommunity = async (name, userId) => {
  const session = await mongoose.startSession();

  try {
    let updatedCommunity;

    await session.withTransaction(async () => {
      const community = await Community.findOne({
        name: name.toLowerCase(),
      }).session(session);

      if (!community) {
        throw new ApiError(404, 'Community not found');
      }

      const membership = await Membership.findOne({
        user: userId,
        community: community._id,
      }).session(session);

      if (!membership) {
        throw new ApiError(409, 'You are not a member');
      }

      if (community.creator.equals(userId)) {
        throw new ApiError(
          403,
          'Transfer ownership before leaving the community'
        );
      }

      if (membership.role === 'moderator') {
        const moderatorsCount = await Membership.countDocuments({
          community: community._id,
          role: 'moderator',
        }).session(session);

        if (moderatorsCount <= 1) {
          throw new ApiError(
            403,
            'Assign another moderator before leaving'
          );
        }
      }

      if (community.membersCount <= 0) {
        throw new ApiError(409, 'Invalid members count');
      }

      await Membership.deleteOne(
        { _id: membership._id },
        { session }
      );

      updatedCommunity = await Community.findByIdAndUpdate(
        community._id,
        { $inc: { membersCount: -1 } },
        { new: true, session }
      );
    });

    return updatedCommunity;
  } finally {
    await session.endSession();
  }
};

export const getPendingJoinRequests = async (communityId) => {
  const requests = await JoinRequest.find({
    community: communityId,
    status: 'pending',
  })
    .populate('user', 'username')
    .sort({ createdAt: 1 });

  return requests;
};

export const reviewJoinRequest = async (
  communityId,
  requestId,
  moderatorId,
  status
) => {
  if (!mongoose.isValidObjectId(requestId)) {
    throw new ApiError(400, 'Invalid request id');
  }

  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid request status');
  }

  const session = await mongoose.startSession();

  try {
    let updatedRequest;

    await session.withTransaction(async () => {
      const moderator = await Membership.exists({
        user: moderatorId,
        community: communityId,
        role: 'moderator',
      }).session(session);

      if (!moderator) {
        throw new ApiError(403, 'Only moderators can do this');
      }

      const joinRequest = await JoinRequest.findOne({
        _id: requestId,
        community: communityId,
      }).session(session);

      if (!joinRequest) {
        throw new ApiError(404, 'Join request not found');
      }

      if (joinRequest.status !== 'pending') {
        throw new ApiError(409, 'Join request already reviewed');
      }

      if (status === 'approved') {
        const membership = await Membership.exists({
          user: joinRequest.user,
          community: communityId,
        }).session(session);

        if (membership) {
          throw new ApiError(409, 'User is already a member');
        }

        await Membership.create(
          [
            {
              user: joinRequest.user,
              community: communityId,
              role: 'member',
            },
          ],
          { session }
        );

        const community = await Community.findByIdAndUpdate(
          communityId,
          { $inc: { membersCount: 1 } },
          { new: true, session }
        );

        if (!community) {
          throw new ApiError(404, 'Community not found');
        }
      }

      joinRequest.status = status;
      joinRequest.reviewedBy = moderatorId;
      joinRequest.reviewedAt = new Date();

      updatedRequest = await joinRequest.save({ session });
    });

    return updatedRequest;
  } finally {
    await session.endSession();
  }
};