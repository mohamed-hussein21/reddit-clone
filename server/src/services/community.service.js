import mongoose from 'mongoose';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';

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