// utils/api.js — Axios instance with automatic JWT injection
//
// Every API call automatically includes the Authorization header
// if a token exists in localStorage.

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillforge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem("skillforge_token");
      localStorage.removeItem("skillforge_stream_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
