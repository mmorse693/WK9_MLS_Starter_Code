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
