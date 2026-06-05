import { summarizeThread } from "../services/aiService.js";

export const getSummary = async (req, res) => {
  const summary = await summarizeThread(req.params.threadId);
  res.status(200).json({
    success: true,
    message: "Summary generated successfully",
    data: { summary },
  });
};
