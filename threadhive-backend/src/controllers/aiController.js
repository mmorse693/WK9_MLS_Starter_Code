import { summarizeThread, rephraseText } from "../services/aiService.js";

export const getSummary = async (req, res) => {
  const summary = await summarizeThread(req.params.threadId);
  res.status(200).json({
    success: true,
    message: "Summary generated successfully",
    data: { summary },
  });
};

export const getRephrase = async (req, res) => {
  const { text, fieldType } = req.body;
  const rephrased = await rephraseText(text, fieldType);
  res.status(200).json({
    success: true,
    message: "Text rephrased successfully",
    data: { rephrased },
  });
};
