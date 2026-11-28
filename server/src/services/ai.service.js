import { GoogleGenAI } from '@google/genai';
import Post from '../models/Post.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Gemini client (the API key stays on the server, never sent to the browser)
const ai = new GoogleGenAI({ apiKey: env.geminiKey });

// If the first model is busy, try the next one
const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

const generateSummary = async (prompt) => {
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text?.trim();
    } catch (error) {
      console.error(`Gemini error (${model}):`, error.message);
    }
  }

  throw new ApiError(502, 'AI service is unavailable, try again later');
};

export const summarizePost = async (postId) => {
  // 1) Find the post (ignore deleted / removed posts)
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
    isRemoved: false,
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // 2) Cache: if we already summarized this post, return the saved summary
  if (post.aiSummary) {
    return { summary: post.aiSummary, cached: true };
  }

  // 3) Short posts don't need a summary
  if (!post.body || post.body.trim().length < 50) {
    throw new ApiError(400, 'Post is too short to summarize');
  }

  // 4) Ask Gemini
  const prompt =
    'Summarize the following Reddit post in 2-3 short sentences. ' +
    'Write the summary in the SAME language the post is written in ' +
    '(an English post gets an English summary, an Arabic post gets an Arabic summary). ' +
    'Return only the summary, with no introduction.\n\n' +
    `Title: ${post.title}\n\n${post.body}`;

  const summary = await generateSummary(prompt);

  if (!summary) {
    throw new ApiError(502, 'AI returned an empty summary');
  }

  // 5) Save it so the next request is instant and free
  post.aiSummary = summary;
  await post.save({ timestamps: false });

  return { summary, cached: false };
};
