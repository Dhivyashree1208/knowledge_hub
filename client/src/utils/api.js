import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Attach token if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Authentication functions
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Document functions
export const getDocs = () => API.get("/docs");
export const getDoc = (id) => API.get(`/docs/${id}`);
export const createDoc = (data) => API.post("/docs", data);
export const updateDoc = (id, data) => API.put(`/docs/${id}`, data);
export const deleteDoc = (id) => API.delete(`/docs/${id}`);
export const searchDocs = (q) => API.get(`/docs/search/text?q=${q}`);
export const semanticSearch = (q) => API.get(`/docs/search/semantic?q=${q}`);
export const askQuestion = (question) => API.post(`/docs/qa`, { question });
export const getVersions = (id) => API.get(`/docs/${id}/versions`);
export const getRecentDocs = () => API.get(`/docs?limit=5`);

// New API functions for user profile and posts

// Fetch the logged-in user's profile
export const getUserProfile = () => API.get("/users/profile");

// Fetch the logged-in user's posts
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);

// Fetch all posts from all users (for viewing others' posts)
export const getAllPosts = () => API.get(`/posts`);

// Update user profile (if you want to provide update functionality)
export const updateUserProfile = (userId, data) => API.put(`/users/${userId}`, data);
