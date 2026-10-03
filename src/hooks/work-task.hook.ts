import { acceptWorkTask, completeWorkTask, failWorkTask, getAllWorkTasks, rejectWorkTask, startWorkTask } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllWorkTasks = (enabled = true) => {
  return useQuery({
    queryKey: ["work-tasks"],
    queryFn: getAllWorkTasks,
    enabled,
    retry: false,
  });
};

export const useAcceptWorkTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptWorkTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-tasks"],
      });
    },
  });
};

export const useRejectWorkTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      rejectionReason,
    }: {
      taskId: string;
      rejectionReason: string;
    }) => rejectWorkTask(taskId, { rejectionReason }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-tasks"],
      });
    },
  });
};

export const useStartWorkTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startWorkTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-tasks"],
      });
    },
  });
};

export const useCompleteWorkTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      repairNote,
    }: {
      taskId: string;
      repairNote: string;
    }) => completeWorkTask(taskId, { repairNote }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-tasks"],
      });
    },
  });
};

export const useFailWorkTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      failureReason,
    }: {
      taskId: string;
      failureReason: string;
    }) => failWorkTask(taskId, { failureReason }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["work-tasks"],
      });
    },
  });
};