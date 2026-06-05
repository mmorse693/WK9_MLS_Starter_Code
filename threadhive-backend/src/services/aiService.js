import { GoogleGenAI } from "@google/genai";
import Thread from "../models/Thread.js";
import Comment from "../models/Comment.js";
import { createAppError } from "../utils/createAppError.js";

let aiClient = null;

function getAiClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw createAppError("GEMINI_API_KEY is not configured", 500);
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export const summarizeThread = async (threadId) => {
  const thread = await Thread.findById(threadId)
    .populate({ path: "author", select: "name" })
    .populate({ path: "subreddit", select: "name" });

  if (!thread) throw createAppError("Thread not found", 404);

  const comments = await Comment.find({ thread: threadId })
    .populate("user", "name")
    .sort({ createdAt: 1 });

  const commentLines =
    comments.length > 0
      ? comments
          .map(
            (c, i) =>
              `  Comment ${i + 1} by ${c.user?.name ?? "Unknown"}: ${c.content}`
          )
          .join("\n")
      : "  (No comments yet)";

  const prompt = `You are summarizing a post from a Reddit-like community called ThreadHive.

Thread title: "${thread.title}"
Posted in: r/${thread.subreddit?.name ?? "unknown"}
Author: ${thread.author?.name ?? "Unknown"}

Thread content:
${thread.content}

Comments:
${commentLines}

Write a single concise paragraph (3–5 sentences) summarizing what this thread is about, the main point the author makes, and the overall sentiment or key themes in the comments. Do not include a heading — just the paragraph.`;

  const response = await getAiClient().models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};
