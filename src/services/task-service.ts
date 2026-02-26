import axios from "axios";
import { Task, Status } from "../types";

const BASE_URL = "http://localhost:4000";

const api = axios.create({ baseURL: BASE_URL });

export const taskService = {
  getAll: async (): Promise<{ data: Task[]; total: number }> => {
    const response = await api.get("/tasks");
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  },

  // Fetches all tasks for a status — no pagination/search params sent to API.
  // React Query caches this; filtering/pagination happen client-side.
  getByStatus: async (
    status: Status,
  ): Promise<{ data: Task[]; total: number }> => {
    const response = await api.get("/tasks", {
      params: { status, _sort: "order" },
    });
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  },

  create: async (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    const response = await api.post("/tasks", {
      ...task,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
