import axios from "axios";
import { cachedFetch, invalidateCache } from "./cache.js";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  register: async (name, email, password) => {
    const result = await api.post("/auth/register", { name, email, password }).then((r) => r.data);
    invalidateCache("admins");
    return result;
  },

  me: () => api.get("/auth/me").then((r) => r.data),
  getAdmins: () => cachedFetch("admins", () => api.get("/auth/users").then((r) => r.data)),

  changePassword: (oldPassword, newPassword) =>
    api.put("/auth/password", { oldPassword, newPassword }).then((r) => r.data),

  deleteAdmin: async (id) => {
    await api.delete(`/auth/${id}`);
    invalidateCache("admins");
  },

  getToken: () => localStorage.getItem("token"),

  getUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
