import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByTeam,
  updateTask,
  type CreateTaskRequest,
  type UpdateTaskRequest,
} from "@/api/apis/tasks.api";

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

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => createTask(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "team", variables.teamId],
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

    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", task.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", "team", task.teamId],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}