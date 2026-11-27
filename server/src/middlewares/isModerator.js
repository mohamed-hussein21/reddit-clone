import mongoose from 'mongoose';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';

// Loads the community from req.params.id
// Sends 400 / 404 and returns null if it can't
async function loadCommunity(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: 'Invalid community id' });
    return null;
  }

  const community = await Community.findById(id);

  if (!community) {
    res.status(404).json({ message: 'Community not found' });
    return null;
  }

  return community;
}

// Only moderators of the community can continue
// Must be used after protect (needs req.user)
export async function isModerator(req, res, next) {
  try {
    const community = await loadCommunity(req, res);
    if (!community) return;

    const isMod = await Membership.exists({
      user: req.user._id,
      community: community._id,
      role: 'moderator',
    });

    if (!isMod) {
      return res.status(403).json({ message: 'Only moderators can do this' });
    }

    req.community = community;
    next();
  } catch (error) {
    next(error);
  }
}

// Only the owner (creator) of the community can continue
// Used for actions like transferring ownership
// Must be used after protect (needs req.user)
export async function isCommunityOwner(req, res, next) {
  try {
    const community = await loadCommunity(req, res);
    if (!community) return;

    if (!community.creator.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the community owner can do this' });
    }

    req.community = community;
    next();
  } catch (error) {
    next(error);
  }
}
