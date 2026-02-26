import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { taskService } from "../services/task-service";
import { Status, Task } from "../types";
import { useBoardStore } from "../store/use-board-store";

const PAGE_SIZE = 5;

/**
 * Fetches ALL tasks for a given status (cached by React Query).
 * Filtering is done locally from the cached data using the Zustand search query.
 * Pagination is handled client-side with a "load more" counter.
 */
export const useTasksByStatus = (status: Status) => {
  const searchQuery = useBoardStore((s) => s.searchQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // React Query caches the full list per status — no search param sent to API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", status],
    queryFn: () => taskService.getByStatus(status),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  });

  const allTasks: Task[] = data?.data ?? [];

  // Local filtering by title or description (case-insensitive)
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allTasks;
    return allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q),
    );
  }, [allTasks, searchQuery]);

  // Client-side pagination slice
  const visibleTasks = filteredTasks.slice(0, visibleCount);
  const hasNextPage = visibleCount < filteredTasks.length;

  const fetchNextPage = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Reset visible count whenever search changes
  useMemo(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  return {
    tasks: visibleTasks,
    total: filteredTasks.length,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: false,
    isLoading,
    isError,
  };
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
};
