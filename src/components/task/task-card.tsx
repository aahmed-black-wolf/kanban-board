import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { RiDeleteBin6Line, RiDraggable } from "react-icons/ri";
import { IconButton, Tooltip } from "@mui/material";
import { Task } from "../../types";
import { PriorityBadge } from "../ui/priority-badge";
import { useDeleteTask } from "../../hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  isDragOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDragOverlay = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const deleteTask = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          bg-white rounded-lg p-4 mb-2 border border-gray-100
          shadow-sm hover:shadow-md transition-shadow duration-200
          ${isDragOverlay ? "shadow-xl rotate-2 scale-105" : ""}
          ${isDragging ? "cursor-grabbing" : "cursor-default"}
          relative group
        `}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:!opacity-100 cursor-grab active:cursor-grabbing text-gray-400 transition-opacity"
        >
          <RiDraggable size={16} />
        </div>

        <div className="pl-2">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-mono font-semibold text-sm text-gray-800 leading-tight">
              {task.title}
            </h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => deleteTask.mutate(task.id)}
                  className="!text-red-400 hover:!text-red-600 !p-0.5"
                  disabled={deleteTask.isPending}
                >
                  <RiDeleteBin6Line size={14} />
                </IconButton>
              </Tooltip>
            </motion.div>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            {task.description}
          </p>
          <PriorityBadge priority={task.priority} />
        </div>
      </motion.div>
    </div>
  );
};
