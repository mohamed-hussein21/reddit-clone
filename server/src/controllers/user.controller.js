import * as userService from '../services/user.service.js';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

export async function getProfile(req, res) {
    const user = await userService.getProfile(req.params.username);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.json(user);
}

export async function updateProfile(req, res) {
    const { displayName, bio } = req.body || {};
    const data = {};

    if (displayName !== undefined) {
        if (typeof displayName !== 'string' || displayName.length > 30) {
            return res.status(400).json({
                message: 'Display name cannot exceed 30 characters'
            });
        }

        data.displayName = displayName.trim();
    }

    if (bio !== undefined) {
        if (typeof bio !== 'string' || bio.length > 200) {
            return res.status(400).json({
                message: 'Bio cannot exceed 200 characters'
            });
        }

        data.bio = bio.trim();
    }

    const user = await userService.updateProfile(req.user._id, data);

    res.json(user);
}

export async function uploadAvatar(req, res) {
    if (!req.file) {
        return res.status(400).json({
            message: 'Select an image first'
        });
    }

    const buffer = req.file.buffer;
    const isPng =
        buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';

    const isJpeg =
        buffer.subarray(0, 3).toString('hex') === 'ffd8ff';

    if (!isPng && !isJpeg) {
        return res.status(400).json({
            message: 'Invalid image file'
        });
    }

    const extension = isPng ? '.png' : '.jpg';
    const filename = randomUUID() + extension;

    await mkdir('uploads', { recursive: true });
    await writeFile('uploads/' + filename, buffer);

    const user = await userService.updateProfile(req.user._id, {
        avatar: '/uploads/' + filename
    });

    res.json(user);
}

export async function getUserPosts(req, res) {
    const user = await userService.getProfile(req.params.username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const posts = await userService.getUserPosts(user._id);

    res.json(posts);
}

export async function getUserComments(req, res) {
    const user = await userService.getProfile(req.params.username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const comments = await userService.getUserComments(user._id);

    res.json(comments);
}

export async function getMyCommunities(req, res) {
    const communities = await userService.getUserCommunities(req.user._id);

    res.json(communities);
}