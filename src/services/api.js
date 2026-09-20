import axios from "axios";

/**
 * Central Axios instance.
 * - baseURL comes from the Vite environment variable.
 * - withCredentials: true tells the browser to send the HttpOnly JWT cookie
 *   with every request.
 */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export const signupUser = (data) => api.post("/users/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");