import axios from "axios";

/**
 * api - Axios instance configured with base URL and authentication token
 * Automatically attaches JWT token from localStorage to all requests
 */
const api = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL || "http://localhost:4000") + "/api",
});

/**
 * Request interceptor - Attaches authentication token to all API requests
 * Token is retrieved from localStorage and added to Authorization header
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
