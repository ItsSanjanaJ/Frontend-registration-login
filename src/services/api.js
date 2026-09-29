import axios from "axios";

/**
 * Central Axios instance.
 * Requests use the frontend origin in development (Vite proxy) and production
 * (Vercel rewrite), so the browser can send the HttpOnly JWT cookie first-party.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const signupUser = (data) => api.post("/users/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");

export default api;