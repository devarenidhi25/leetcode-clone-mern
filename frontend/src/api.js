import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constant.js";

const BACKEND_API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const executeCode = async (language, sourceCode) => {
  try {
    const payload = {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    };
    
    console.log("Executing code with backend:", payload);
    // Call backend execution endpoint instead of Piston
    const response = await BACKEND_API.post("/execute/execute", payload);
    return response.data;
  } catch (error) {
    console.error("Code execution error:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};

// Problems API
export const getProblems = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.tags) {
    if (Array.isArray(filters.tags)) {
      filters.tags.forEach(tag => params.append('tags', tag));
    } else {
      params.append('tags', filters.tags);
    }
  }
  if (filters.search) params.append('search', filters.search);
  if (filters.userId) params.append('userId', filters.userId);
  
  const response = await BACKEND_API.get(`/problems?${params.toString()}`);
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await BACKEND_API.get(`/problems/${id}`);
  return response.data;
};

export const getAllTags = async () => {
  const response = await BACKEND_API.get('/problems/tags/all');
  return response.data.tags;
};

// User API
export const getUserStats = async (userId) => {
  const response = await BACKEND_API.get(`/users/stats/${userId}`);
  return response.data;
};

export const getRecommendedProblems = async () => {
  const response = await BACKEND_API.get('/users/recommendations');
  return response.data;
};

export const updateStreak = async () => {
  const response = await BACKEND_API.post('/users/streak/update');
  return response.data;
};

// Friend API
export const sendFriendRequest = async (receiverId) => {
  const response = await BACKEND_API.post('/friends/send', { receiverId });
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await BACKEND_API.post('/friends/accept', { requestId });
  return response.data;
};

export const rejectFriendRequest = async (requestId) => {
  const response = await BACKEND_API.post('/friends/reject', { requestId });
  return response.data;
};

export const getFriendList = async (userId) => {
  const response = await BACKEND_API.get(`/friends/list/${userId}`);
  return response.data.friends;
};

export const getPendingRequests = async () => {
  const response = await BACKEND_API.get('/friends/requests/pending');
  return response.data.requests;
};

// Submission API
export const submitCode = async (userId, problemId, code, language, result) => {
  const response = await BACKEND_API.post('/submit', {
    userId,
    problemId,
    code,
    language,
    result,
    submissionTime: new Date(),
  });
  return response.data;
};

export const getSubmissions = async (userId, problemId) => {
  const response = await BACKEND_API.get(`/submit/${userId}/${problemId}`);
  return response.data;
};

export const getAllUserSubmissions = async (userId) => {
  const response = await BACKEND_API.get(`/submit/${userId}`);
  return response.data;
};