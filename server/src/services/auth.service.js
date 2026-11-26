import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

export function userData(user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        banner: user.banner,
        karma: user.karma,
        createdAt: user.createdAt
    };
}

export async function register(username, email, password) {
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        const error = new Error('Username or email already exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        displayName: username
    });

    return {
        user: userData(user),
        token: signToken(user._id.toString())
    };
}

export async function login(email, password) {
    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    return {
        user: userData(user),
        token: signToken(user._id.toString())
    };
}