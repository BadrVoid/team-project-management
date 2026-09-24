import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  getTaskDetails,
  getTasksByTeam,
  updateTask,
  updateTaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/api/apis/tasks.api";

export function useMyTasks() {
  return useQuery({
    queryKey: ["tasks", "my"],
    queryFn: getMyTasks,
  });
}

export function useTasksByTeam(teamId: string) {
  return useQuery({
    queryKey: ["tasks", "team", teamId],
    queryFn: () => getTasksByTeam(teamId),
    enabled: !!teamId,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
  });
}

export function useTaskDetails(taskId: string) {
  return useQuery({
    queryKey: ["tasks", "details", taskId],
    queryFn: () => getTaskDetails(taskId),
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => createTask(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "team", variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "my"],
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskRequest;
    }) => updateTask(taskId, data),

    onSuccess: (task, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.taskId, "details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "team", task.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "my"],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onSuccess: (_, taskId) => {
      queryClient.removeQueries({
        queryKey: ["tasks", taskId],
      });

      queryClient.removeQueries({
        queryKey: ["tasks", taskId, "details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: Parameters<typeof updateTaskStatus>[1];
    }) => updateTaskStatus(taskId, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}