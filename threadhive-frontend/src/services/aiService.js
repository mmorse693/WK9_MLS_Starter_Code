import axiosInstance from "../api/axiosInstance";
import { AI_API } from "../config/apiConfig.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchThreadSummary = async (threadId) => {
  const res = await axiosInstance.get(AI_API.SUMMARIZE(threadId), {
    headers: getAuthHeaders(),
  });
  return res.data.data.summary;
};

export const rephraseTextAPI = async (text, fieldType) => {
  const res = await axiosInstance.post(
    AI_API.REPHRASE,
    { text, fieldType },
    { headers: getAuthHeaders() }
  );
  return res.data.data.rephrased;
};
