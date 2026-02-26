import React, { useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { Column, Status } from "../../types";
import { useTasksByStatus } from "../../hooks/use-tasks";
import { TaskCard } from "../task/task-card";
import { AddTaskForm } from "../task/add-task-form";
import { CircularProgress } from "@mui/material";

interface KanbanColumnProps {
  column: Column;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const {
    tasks,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTasksByStatus(column.id as Status);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const taskIds = tasks.map((t) => t.id);

  // Infinite scroll sentinel — triggers client-side pagination
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasNextPage) return;
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-64 min-w-[256px] flex-shrink-0"
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: column.color }}
        />
        <span className="font-mono font-bold text-xs tracking-widest text-gray-600 uppercase">
          {column.label}
        </span>
        <span className="ml-auto font-mono text-xs text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">
          {total}
        </span>
      </div>

      {/* Tasks drop area */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 rounded-xl p-3 transition-colors duration-200 min-h-[200px]
          ${isOver ? "bg-blue-50 ring-2 ring-blue-200" : "bg-[#e8edf2]"}
        `}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <CircularProgress size={24} />
              </div>
            ) : tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8 text-xs font-mono text-gray-400"
              >
                No tasks
              </motion.div>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </AnimatePresence>
        </SortableContext>

        {/* Infinite scroll sentinel — loads next client-side page */}
        <div ref={loadMoreRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <CircularProgress size={16} />
          </div>
        )}

        <AddTaskForm status={column.id as Status} nextOrder={tasks.length} />
      </div>
    </motion.div>
  );
};
