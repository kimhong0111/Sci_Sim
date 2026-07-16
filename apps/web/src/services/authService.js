import axios from "axios";
import { cachedFetch, invalidateCache } from "./cache.js";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
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
  async (err) => {
    const originalRequest = err.config;

    if (originalRequest.url.startsWith("/auth/") && !originalRequest.url.includes("refresh")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("token", data.token);
        processQueue(null, data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export const authService = {
  login: async (email, password) => {
    const data = await api.post("/auth/login", { email, password }).then((r) => r.data);
    invalidateCache();
    return data;
  },

  verifyPassword: (password, action) =>
    api.post("/auth/verify-password", { password, action }).then((r) => r.data),

  register: async (name, email, password, actionToken) => {
    const result = await api.post("/auth/register", { name, email, password, action_token: actionToken }).then((r) => r.data);
    invalidateCache("admins");
    return result;
  },

  refreshToken: () => api.post("/auth/refresh").then((r) => {
    localStorage.setItem("token", r.data.token);
    return r.data.token;
  }),

  me: () => api.get("/auth/me").then((r) => r.data),
  getAdmins: () => cachedFetch("admins", () => api.get("/auth/users").then((r) => r.data)),

  changePassword: (oldPassword, newPassword) =>
    api.put("/auth/password", { oldPassword, newPassword }).then((r) => r.data),

  deleteAdmin: async (id, actionToken) => {
    await api.delete(`/auth/${id}`, { data: { action_token: actionToken } });
    invalidateCache("admins");
  },

  getToken: () => localStorage.getItem("token"),

  getUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
