import axios from "axios";
import { cachedFetch, invalidateCache } from "./cache.js";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
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
  getAll: () => cachedFetch("simulations", () => api.get("/simulations").then((r) => r.data)),
  getById: (id) => cachedFetch(`simulation_${id}`, () => api.get(`/simulations/${id}`).then((r) => r.data)),
  create: async (data) => {
    const created = await api.post("/simulations", data, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data);
    invalidateCache("simulations");
    return created;
  },
  createWithImage: async (data, file) => {
    const fd = toFormData(data);
    if (file) fd.append("image", file);
    const created = await api.post("/simulations", fd).then((r) => r.data);
    invalidateCache("simulations");
    return created;
  },
  update: async (id, data) => {
    const updated = await api.put(`/simulations/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data);
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
    return updated;
  },
  updateWithImage: async (id, data, file) => {
    const fd = toFormData(data);
    if (file) fd.append("image", file);
    const updated = await api.put(`/simulations/${id}`, fd).then((r) => r.data);
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
    return updated;
  },
  delete: async (id) => {
    await api.delete(`/simulations/${id}`);
    invalidateCache("simulations");
    invalidateCache(`simulation_${id}`);
  },
  getSubjects: () => cachedFetch("subjects", () => api.get("/subjects").then((r) => r.data)),
  getTopics: () => cachedFetch("topics", () => api.get("/topics").then((r) => r.data)),
  createSubject: async (name) => {
    const created = await api.post("/subjects", { name }).then((r) => r.data);
    invalidateCache("subjects");
    return created;
  },
  createTopic: async (name, subject_id) => {
    const created = await api.post("/topics", { name, subject_id }).then((r) => r.data);
    invalidateCache("topics");
    return created;
  },
};
