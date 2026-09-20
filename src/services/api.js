import axios from "axios";

/**
 * Central Axios instance.
 * - baseURL points directly at the Spring Boot backend.
 * - withCredentials: true tells the browser to send the HttpOnly JWT cookie
 *   with every request (cookies are NOT readable by JS, but the browser
 *   attaches them automatically).
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

export const signupUser = (data) => api.post("/users/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");