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
const MAX_COMMENTS_PER_POST = 4;

const COMMUNITIES = [
  {
    name: 'seed_programming',
    title: 'Programming',
    description: 'Code, bugs and everything in between',
    posts: [
      [
        'Is MERN still worth learning in 2026?',
        'I am a CS student and I keep hearing mixed opinions. Some say MERN is everywhere, others say companies moved to Next.js and TypeScript. What do you think a junior should focus on?',
      ],
      [
        'I spent 3 hours on a bug that was a missing semicolon',
        'The error message pointed to a completely different file. When I finally found it I did not know whether to laugh or cry. Please share your worst debugging stories so I feel better.',
      ],
      [
        'What is the best way to learn data structures?',
        'I understand arrays and linked lists, but trees and graphs feel impossible. Did you learn them from a book, a course, or by solving LeetCode problems?',
      ],
      [
        'Tabs or spaces? Our team is fighting about it',
        'Half of the team uses tabs and the other half uses spaces, and every pull request is full of formatting changes. Should we just add Prettier and stop arguing?',
      ],
      [
        'How do you stay motivated on side projects?',
        'I start a new project every month and never finish any of them. How do you keep going after the exciting first week is over?',
      ],
      [
        'Explain async and await like I am five',
        'I can use them but I do not really understand what happens behind the scenes. Why does my code sometimes run in a different order than I wrote it?',
      ],
      [
        'Git saved my project today',
        'I deleted a whole folder by mistake and thought I lost a week of work. One git checkout later everything was back. Commit often, people!',
      ],
      [
        'Which VS Code extensions do you use every day?',
        'I only have Prettier and ESLint. I feel like I am missing a lot of useful tools. What are your must have extensions?',
      ],
    ],
  },
  {
    name: 'seed_egypt',
    title: 'Egypt',
    description: 'News and talks about Egypt',
    posts: [
      [
        'Best places to visit in Cairo on a weekend?',
        'My cousins are visiting from abroad for two days. Besides the pyramids and the Egyptian Museum, where should I take them?',
      ],
      [
        'The traffic on the Ring Road today was crazy',
        'It took me two hours to get from Nasr City to Maadi. Is there any app that predicts traffic better than Google Maps here?',
      ],
      [
        'What is your favorite koshary place?',
        'I have tried a lot of places, but I am still looking for the perfect one. Share your favorite and what makes it special.',
      ],
      [
        'Tips for students looking for summer internships',
        'I am a third year engineering student. Where do companies in Egypt usually post internships, and when should I start applying?',
      ],
      [
        'Is it worth visiting Siwa in winter?',
        'I have seen beautiful photos of Siwa Oasis and I am planning a trip with friends. How cold does it get at night, and how many days do we need?',
      ],
      [
        'The new metro line made my commute so much easier',
        'I used to take two microbuses to get to university. Now it is one train and it is much faster. Anyone else noticed the difference?',
      ],
      [
        'What should I bring to Dahab for the first time?',
        'I am going diving for the first time next month. Any advice about what to pack and which dive centers are good for beginners?',
      ],
      [
        'Recommend Egyptian books for someone who loves history',
        'I finished a few books by Naguib Mahfouz and loved them. What should I read next to learn more about modern Egyptian history?',
      ],
    ],
  },
  {
    name: 'seed_football',
    title: 'Football',
    description: 'Matches, transfers and opinions',
    posts: [
      [
        'That last minute goal yesterday was unbelievable',
        'I had already turned off the TV and my brother started screaming. Best comeback I have seen this season.',
      ],
      [
        'Who is the most underrated player in the league right now?',
        'Everyone talks about the strikers, but I think the defensive midfielders are doing most of the work. Who do you think deserves more credit?',
      ],
      [
        'Should VAR be removed from football?',
        'It was supposed to make decisions fair, but now every goal takes five minutes to be confirmed. Is it improving the game or ruining the excitement?',
      ],
      [
        'Best football game for playing with friends?',
        'We are looking for something fun for a group of four. Is the newest edition worth buying, or should we stick with the old one?',
      ],
      [
        'Rate this summer transfer window from 1 to 10',
        'Some clubs spent a lot and still look weak, while others made smart cheap signings. Which club did the best business?',
      ],
      [
        'How do you improve your stamina for five a side?',
        'I play every Friday with my friends and I am tired after ten minutes. Any training routine you recommend?',
      ],
      [
        'The atmosphere in the stadium last night was amazing',
        'It was my first time watching a match live. The noise, the songs and the flags made it so much better than watching on TV.',
      ],
      [
        'Which coach would you bring to the national team?',
        'We need someone who can build a team for the long term, not just the next tournament. Who would you choose and why?',
      ],
    ],
  },
  {
    name: 'seed_movies',
    title: 'Movies',
    description: 'Reviews and recommendations',
    posts: [
      [
        'Movies with a plot twist you never saw coming',
        'I love films that make you want to watch them again right after they end. Please recommend some, but no spoilers in the titles!',
      ],
      [
        'Is it just me or are movies getting too long?',
        'Almost every new release is close to three hours. Some stories really need it, but many of them could lose forty minutes easily.',
      ],
      [
        'Best animated movie of all time?',
        'I watched a classic animated film with my little sister and it made me cry more than any drama. Which one is your favorite?',
      ],
      [
        'What is a movie that everyone loves but you do not?',
        'I know it is a famous classic, but I fell asleep twice while watching it. Share your unpopular opinions here.',
      ],
      [
        'Good movies to watch with family this weekend',
        'We want something that both kids and adults can enjoy. Comedy or adventure would be great.',
      ],
      [
        'Cinema or streaming at home?',
        'Tickets and snacks are getting expensive, but the big screen experience is hard to beat. Which one do you prefer for new releases?',
      ],
      [
        'Soundtracks that are better than the movie itself',
        'Sometimes I listen to a soundtrack for months even though I barely remember the movie. Which soundtracks do you love?',
      ],
      [
        'Which book should be turned into a movie next?',
        'There are so many great novels that would make amazing films. Which one would you like to see on the big screen?',
      ],
    ],
  },
  {
    name: 'seed_askcollege',
    title: 'Ask College',
    description: 'Questions for university students',
    posts: [
      [
        'How do you study for finals without burning out?',
        'I have five exams in eight days and I feel overwhelmed already. How do you split your time and when do you take breaks?',
      ],
      [
        'Is it normal to feel lost in the first year?',
        'Everyone around me seems to know exactly what they want. I am still not sure if I picked the right major.',
      ],
      [
        'Best note taking app for engineering students?',
        'I need something that handles equations and drawings. Do you use Notion, OneNote, or just paper?',
      ],
      [
        'How do you deal with a group project where nobody works?',
        'We have a big project due in three weeks and I am the only one who has done anything. Should I talk to the professor?',
      ],
      [
        'Is a master degree worth it for software engineers?',
        'Some people say experience matters more than degrees. Others say a master opens more doors abroad. What do you think?',
      ],
      [
        'What is one thing you wish you knew in your first semester?',
        'I am starting university next month. Please share any advice, big or small.',
      ],
      [
        'How many hours a day do you actually study?',
        'I see people online saying they study ten hours a day. Is that realistic, or is it better to study fewer focused hours?',
      ],
      [
        'Tips for giving a good presentation in class',
        'I get very nervous when I speak in front of people. How do you prepare so you do not forget everything on the day?',
      ],
    ],
  },
];

const COMMENTS = [
  'This is so true, I had the same experience last year.',
  'Great question! I have been wondering about this too.',
  'I disagree a bit. In my opinion it depends on the situation.',
  'Thanks for sharing, this was really helpful.',
  'Can you explain more? I did not fully understand.',
  'Same here! Glad I am not the only one.',
  'I tried this and it worked perfectly for me.',
  'Honestly, I think people overthink this.',
  'Following this thread, I want to know the answer too.',
  'This made my day, thank you.',
  'Good point, I never thought about it this way.',
  'I would recommend starting small and building from there.',
  'Underrated post. More people need to see this.',
  'Haha, this happened to me yesterday.',
  'Do you have any sources for this? I would like to read more.',
  'Agreed. Consistency matters more than anything.',
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
      bio: faker.person.bio(),
    };
  });

  return User.insertMany(users);
};

// 3) Communities (first user creates them and is the moderator)
const createCommunities = async (creator) => {
  return Community.insertMany(
    COMMUNITIES.map(({ posts: _posts, ...community }) => ({
      ...community,
      creator: creator._id,
      membersCount: 0,
    }))
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
const createPosts = async (communities, memberships) => {
  const posts = [];

  COMMUNITIES.forEach((seedCommunity) => {
    const community = communities.find((c) => c.name === seedCommunity.name);
    const members = memberships.filter((m) => m.community.equals(community._id));

    seedCommunity.posts.forEach(([title, body]) => {
      posts.push({
        title,
        body,
        type: 'text',
        author: randomItem(members).user,
        community: community._id,
      });
    });
  });

  const created = await Post.insertMany(posts);

  // Spread posts over the last 30 days so "New" sorting means something
  await Post.collection.bulkWrite(
    created.map((post) => {
      const date = randomDateInLastDays(30);
      return {
        updateOne: {
          filter: { _id: post._id },
          update: { $set: { createdAt: date, updatedAt: date } },
        },
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
          timestamps: false,
        },
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
        body: randomItem(COMMENTS),
        author: randomItem(users)._id,
        post: post._id,
        parent: parent ? parent._id : null,
        depth: parent ? parent.depth + 1 : 0,
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
    const posts = await createPosts(communities, memberships);
    const votes = await createVotes(users, posts);
    const commentsCount = await createComments(users, posts);

    console.log('✅ Seed finished:');
    console.log(
      `   ${users.length} users, ${communities.length} communities, ${memberships.length} memberships`
    );
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
