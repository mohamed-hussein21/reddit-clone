// Fills the DB with fake users, communities, posts, comments and votes.
// SAFE for the shared database: it only deletes data that it created itself
// (users with an email ending in @seed.test and everything they own).
//
// Run:  npm.cmd run seed

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Vote from '../models/Vote.js';

const SEED_EMAIL_DOMAIN = '@seed.test';
const SEED_PASSWORD = 'password123';
const USERS_COUNT = 8;
const POSTS_COUNT = 60;
const MAX_COMMENTS_PER_POST = 4;

const COMMUNITIES = [
    { name: 'seed_programming', title: 'Programming', description: 'Code, bugs and everything in between' },
    { name: 'seed_egypt', title: 'Egypt', description: 'News and talks about Egypt' },
    { name: 'seed_football', title: 'Football', description: 'Matches, transfers and opinions' },
    { name: 'seed_movies', title: 'Movies', description: 'Reviews and recommendations' },
    { name: 'seed_askcollege', title: 'Ask College', description: 'Questions for university students' }
];

faker.seed(2026); // same fake data every time we run it

const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
const randomDateInLastDays = (days) => faker.date.recent({ days });

// 1) Remove only the data created by a previous seed run
const clearOldSeed = async () => {
    const seedUsers = await User.find({ email: { $regex: /@seed\.test$/ } }).distinct('_id');
    const seedCommunities = await Community.find({ creator: { $in: seedUsers } }).distinct('_id');
    const seedPosts = await Post.find({ community: { $in: seedCommunities } }).distinct('_id');
    const seedComments = await Comment.find({ post: { $in: seedPosts } }).distinct('_id');

    await Vote.deleteMany({ target: { $in: [...seedPosts, ...seedComments] } });
    await Vote.deleteMany({ user: { $in: seedUsers } });
    await Comment.deleteMany({ _id: { $in: seedComments } });
    await Post.deleteMany({ _id: { $in: seedPosts } });
    await Membership.deleteMany({ community: { $in: seedCommunities } });
    await Membership.deleteMany({ user: { $in: seedUsers } });
    await Community.deleteMany({ _id: { $in: seedCommunities } });
    await User.deleteMany({ _id: { $in: seedUsers } });

    console.log(`🧹 Removed old seed data (${seedUsers.length} users, ${seedPosts.length} posts)`);
};

// 2) Users
const createUsers = async () => {
    const password = await bcrypt.hash(SEED_PASSWORD, 12);

    const users = Array.from({ length: USERS_COUNT }, (_, i) => {
        const firstName = faker.person.firstName();

        return {
            username: `seed_${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${i}`,
            email: `user${i}${SEED_EMAIL_DOMAIN}`,
            password,
            displayName: firstName,
            bio: faker.person.bio()
        };
    });

    return User.insertMany(users);
};

// 3) Communities (first user creates them and is the moderator)
const createCommunities = async (creator) => {
    return Community.insertMany(
        COMMUNITIES.map((community) => ({ ...community, creator: creator._id, membersCount: 0 }))
    );
};

// 4) Memberships: every user joins 2-4 random communities
const createMemberships = async (users, communities) => {
    const memberships = [];

    // The creator is the moderator of every seed community
    communities.forEach((community) => {
        memberships.push({ user: users[0]._id, community: community._id, role: 'moderator' });
    });

    users.slice(1).forEach((user) => {
        const joined = faker.helpers.arrayElements(communities, { min: 2, max: 4 });

        joined.forEach((community) => {
            memberships.push({ user: user._id, community: community._id, role: 'member' });
        });
    });

    await Membership.insertMany(memberships);

    // Keep membersCount correct
    for (const community of communities) {
        const count = memberships.filter((m) => m.community.equals(community._id)).length;
        await Community.updateOne({ _id: community._id }, { membersCount: count });
    }

    return memberships;
};

// 5) Posts: each post is written by a member of its community
const createPosts = async (memberships) => {
    const posts = Array.from({ length: POSTS_COUNT }, () => {
        const membership = randomItem(memberships);

        return {
            title: faker.lorem.sentence({ min: 4, max: 10 }).replace(/\.$/, '?'),
            body: faker.lorem.paragraphs({ min: 1, max: 3 }),
            type: 'text',
            author: membership.user,
            community: membership.community
        };
    });

    const created = await Post.insertMany(posts);

    // Spread posts over the last 30 days so "New" sorting means something
    await Post.collection.bulkWrite(
        created.map((post) => {
            const date = randomDateInLastDays(30);
            return {
                updateOne: {
                    filter: { _id: post._id },
                    update: { $set: { createdAt: date, updatedAt: date } }
                }
            };
        })
    );

    return created;
};

// 6) Votes: real Vote documents, so the score matches the voting system
const createVotes = async (users, posts) => {
    const votes = [];

    posts.forEach((post) => {
        const voters = faker.helpers.arrayElements(users, { min: 0, max: users.length });

        voters.forEach((user) => {
            // 75% upvotes, 25% downvotes
            const value = Math.random() < 0.75 ? 1 : -1;
            votes.push({ user: user._id, target: post._id, targetType: 'Post', value });
        });
    });

    await Vote.insertMany(votes);

    // Update score / upvotes / downvotes from the votes we just created
    await Post.bulkWrite(
        posts.map((post) => {
            const postVotes = votes.filter((v) => v.target.equals(post._id));
            const upvotes = postVotes.filter((v) => v.value === 1).length;
            const downvotes = postVotes.length - upvotes;

            return {
                updateOne: {
                    filter: { _id: post._id },
                    update: { $set: { upvotes, downvotes, score: upvotes - downvotes } },
                    timestamps: false
                }
            };
        })
    );

    return votes;
};

// 7) Comments: a few top-level comments and replies per post
const createComments = async (users, posts) => {
    let total = 0;

    for (const post of posts) {
        const count = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
        const comments = [];

        for (let i = 0; i < count; i++) {
            const parent = comments.length > 0 && Math.random() < 0.4 ? randomItem(comments) : null;

            const comment = await Comment.create({
                body: faker.lorem.sentences({ min: 1, max: 3 }),
                author: randomItem(users)._id,
                post: post._id,
                parent: parent ? parent._id : null,
                depth: parent ? parent.depth + 1 : 0
            });

            comments.push(comment);
        }

        if (count > 0) {
            await Post.updateOne({ _id: post._id }, { commentsCount: count }, { timestamps: false });
        }

        total += count;
    }

    return total;
};

const seed = async () => {
    try {
        await connectDB();

        await clearOldSeed();

        const users = await createUsers();
        const communities = await createCommunities(users[0]);
        const memberships = await createMemberships(users, communities);
        const posts = await createPosts(memberships);
        const votes = await createVotes(users, posts);
        const commentsCount = await createComments(users, posts);

        console.log('✅ Seed finished:');
        console.log(`   ${users.length} users, ${communities.length} communities, ${memberships.length} memberships`);
        console.log(`   ${posts.length} posts, ${votes.length} votes, ${commentsCount} comments`);
        console.log(`   Login with any seed user, e.g. user1${SEED_EMAIL_DOMAIN} / ${SEED_PASSWORD}`);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seed();