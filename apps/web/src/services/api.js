import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const simulationService = {
  getAll: () => api.get("simulations").then((r) => r.data),
  getById: (id) => api.get(`/api/simulations/${id}`).then((r) => r.data),
  create: (data) => api.post("/simulations", data).then((r) => r.data),
  update: (id, data) => api.put(`/simulations/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/simulations/${id}`),
};
