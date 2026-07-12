import axios from "axios";

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
  getAll: () => api.get("/simulations").then((r) => r.data),
  getById: (id) => api.get(`/simulations/${id}`).then((r) => r.data),
  create: (data) =>
    api.post("/simulations", data, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data),
  createWithImage: (data, file) => {
    const fd = toFormData(data);
    if (file) fd.append("image", file);
    return api.post("/simulations", fd).then((r) => r.data);
  },
  update: (id, data) =>
    api.put(`/simulations/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.data),
  updateWithImage: (id, data, file) => {
    const fd = toFormData(data);
    if (file) fd.append("image", file);
    return api.put(`/simulations/${id}`, fd).then((r) => r.data);
  },
  delete: (id) => api.delete(`/simulations/${id}`),
  getSubjects: () => api.get("/subjects").then((r) => r.data),
  getTopics: () => api.get("/topics").then((r) => r.data),
  createSubject: (name) => api.post("/subjects", { name }).then((r) => r.data),
  createTopic: (name, subject_id) => api.post("/topics", { name, subject_id }).then((r) => r.data),
};
