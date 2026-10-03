import apiClient from "@/lib/apiClient";
import { IWorkTask } from "@/types/work-task.type";

export const getAllWorkTasks = () => {
  return apiClient<{ data: IWorkTask[] }>("/work-tasks", {
    method: "GET",
  });
};

export const acceptWorkTask = (taskId: string) => {
  return apiClient(`/work-tasks/${taskId}/accept`, {
    method: "PATCH",
  });
};

export const rejectWorkTask = (
  taskId: string,
  payload: { rejectionReason: string },
) => {
  return apiClient(`/work-tasks/${taskId}/reject`, {
    method: "PATCH",
    body: payload,
  });
};

export const startWorkTask = (taskId: string) => {
  return apiClient(`/work-tasks/${taskId}/start`, {
    method: "PATCH",
  });
};

export const completeWorkTask = (
  taskId: string,
  payload: { repairNote: string },
) => {
  return apiClient(`/work-tasks/${taskId}/complete`, {
    method: "PATCH",
    body: payload,
  });
};

export const failWorkTask = (
  taskId: string,
  payload: { failureReason: string },
) => {
  return apiClient(`/work-tasks/${taskId}/fail`, {
    method: "PATCH",
    body: payload,
  });
};