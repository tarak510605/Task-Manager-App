import type { Stage, Task, TaskListResponse, TaskPayload } from "../types";
import { api } from "./api";

export interface TaskQuery {
  search?: string;
  stage?: Stage | "All";
  page?: number;
  limit?: number;
}

export const taskService = {
  async list(query: TaskQuery = {}) {
    const params = {
      ...query,
      stage: query.stage === "All" ? undefined : query.stage
    };

    const { data } = await api.get<TaskListResponse>(
      "/api/tasks",
      { params }
    );

    return data;
  },

  async create(payload: TaskPayload) {
    const { data } = await api.post<Task>(
      "/api/tasks",
      payload
    );

    return data;
  },

  async update(id: string, payload: TaskPayload) {
    const { data } = await api.put<Task>(
      `/api/tasks/${id}`,
      payload
    );

    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete<{ message: string }>(
      `/api/tasks/${id}`
    );

    return data;
  },

  async updateStage(id: string, stage: Stage) {
    const { data } = await api.patch<Task>(
      `/api/tasks/${id}/stage`,
      { stage }
    );

    return data;
  }
};