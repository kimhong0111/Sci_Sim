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
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers.Pragma = "no-cache";
    config.params = { ...config.params, _t: Date.now() };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

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
        const { data } = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
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

function toFormData(data) {
  const fd = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === "Simulation_Config") {
      fd.append(key, JSON.stringify(val));
    } else if (val !== undefined && val !== null) {
      fd.append(key, val);
    }
  });
  return fd;
}

export const simulationService = {
  getAll: () => cachedFetch("simulations", () => api.get("/simulations?mine=true").then((r) => r.data)),
  getById: (id) => cachedFetch(`simulation_${id}`, () => api.get(`/simulations/${id}`).then((r) => r.data)),
  create: async (data, actionToken) => {
    const created = await api.post("/simulations", { ...data, action_token: actionToken }, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data);
    invalidateCache("simulations");
    return created;
  },
  createWithImage: async (data, file, actionToken) => {
    const fd = toFormData(data);
    fd.append("action_token", actionToken);
    if (file) fd.append("image", file);
    const created = await api.post("/simulations", fd).then((r) => r.data);
    invalidateCache("simulations");
    return created;
  },
  update: async (id, data, actionToken) => {
    const updated = await api.put(`/simulations/${id}`, { ...data, action_token: actionToken }, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data);
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
    return updated;
  },
  updateWithImage: async (id, data, file, actionToken) => {
    const fd = toFormData(data);
    fd.append("action_token", actionToken);
    if (file) fd.append("image", file);
    const updated = await api.put(`/simulations/${id}`, fd).then((r) => r.data);
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
    return updated;
  },
  delete: async (id, actionToken) => {
    await api.delete(`/simulations/${id}`, { data: { action_token: actionToken } });
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
  },
  getSubjects: () => cachedFetch("subjects", () => api.get("/subjects?mine=true").then((r) => r.data)),
  getTopics: () => cachedFetch("topics", () => api.get("/topics?mine=true").then((r) => r.data)),
  createSubject: async (name, actionToken) => {
    const created = await api.post("/subjects", { name, action_token: actionToken }).then((r) => r.data);
    invalidateCache("subjects");
    return created;
  },
  createTopic: async (name, subject_id, actionToken) => {
    const created = await api.post("/topics", { name, subject_id, action_token: actionToken }).then((r) => r.data);
    invalidateCache("topics");
    return created;
  },
  updateSubject: async (id, name, actionToken) => {
    const updated = await api.put(`/subjects/${id}`, { name, action_token: actionToken }).then((r) => r.data);
    invalidateCache("subjects");
    return updated;
  },
  deleteSubject: async (id, actionToken) => {
    await api.delete(`/subjects/${id}`, { data: { action_token: actionToken } });
    invalidateCache("subjects");
    invalidateCache("topics");
    invalidateCache("simulations");
  },
  updateTopic: async (id, name, subject_id, actionToken) => {
    const updated = await api.put(`/topics/${id}`, { name, subject_id, action_token: actionToken }).then((r) => r.data);
    invalidateCache("topics");
    return updated;
  },
  deleteTopic: async (id, actionToken) => {
    await api.delete(`/topics/${id}`, { data: { action_token: actionToken } });
    invalidateCache("topics");
    invalidateCache("simulations");
  },
};
