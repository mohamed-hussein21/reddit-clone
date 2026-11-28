import mongoose from 'mongoose';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import JoinRequest from '../models/JoinRequest.js';

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
    const error = new Error('Community not found');
    error.statusCode = 404;
    throw error;
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
        const error = new Error('Community not found');
        error.statusCode = 404;
        throw error;
      }

      const membership = await Membership.exists({
        user: userId,
        community: community._id,
      }).session(session);

      if (membership) {
        const error = new Error('You are already a member');
        error.statusCode = 409;
        throw error;
      }

      if (community.type === 'private') {
        const existingRequest = await JoinRequest.exists({
          user: userId,
          community: community._id,
          status: 'pending',
        }).session(session);

        if (existingRequest) {
          const error = new Error(
            'You already have a pending join request'
          );
          error.statusCode = 409;
          throw error;
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
        const error = new Error('Community not found');
        error.statusCode = 404;
        throw error;
      }

      const membership = await Membership.findOne({
        user: userId,
        community: community._id,
      }).session(session);

      if (!membership) {
        const error = new Error('You are not a member');
        error.statusCode = 409;
        throw error;
      }

      if (community.creator.equals(userId)) {
        const error = new Error(
          'Transfer ownership before leaving the community'
        );
        error.statusCode = 403;
        throw error;
      }

      if (membership.role === 'moderator') {
        const moderatorsCount = await Membership.countDocuments({
          community: community._id,
          role: 'moderator',
        }).session(session);

        if (moderatorsCount <= 1) {
          const error = new Error(
            'Assign another moderator before leaving'
          );
          error.statusCode = 403;
          throw error;
        }
      }

      if (community.membersCount <= 0) {
        const error = new Error('Invalid members count');
        error.statusCode = 409;
        throw error;
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
    const error = new Error('Invalid request id');
    error.statusCode = 400;
    throw error;
  }

  if (!['approved', 'rejected'].includes(status)) {
    const error = new Error('Invalid request status');
    error.statusCode = 400;
    throw error;
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
        const error = new Error('Only moderators can do this');
        error.statusCode = 403;
        throw error;
      }

      const joinRequest = await JoinRequest.findOne({
        _id: requestId,
        community: communityId,
      }).session(session);

      if (!joinRequest) {
        const error = new Error('Join request not found');
        error.statusCode = 404;
        throw error;
      }

      if (joinRequest.status !== 'pending') {
        const error = new Error('Join request already reviewed');
        error.statusCode = 409;
        throw error;
      }

      if (status === 'approved') {
        const membership = await Membership.exists({
          user: joinRequest.user,
          community: communityId,
        }).session(session);

        if (membership) {
          const error = new Error('User is already a member');
          error.statusCode = 409;
          throw error;
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
          const error = new Error('Community not found');
          error.statusCode = 404;
          throw error;
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