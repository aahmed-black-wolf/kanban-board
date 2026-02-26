import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { COLUMNS, Status, Task } from "../../types";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "../task/task-card";
import { taskService } from "../../services/task-service";

export const KanbanBoard: React.FC = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const qc = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task;
    setActiveTask(task ?? null);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Optimistic updates handled via drag end
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    if (!activeTask) return;

    const overId = over.id as string;
    const overTask = over.data.current?.task as Task | undefined;

    const targetStatus = (
      overTask
        ? overTask.status
        : (COLUMNS.find((c) => c.id === overId)?.id ?? activeTask.status)
    ) as Status;

    if (activeTask.status === targetStatus && active.id === over.id) return;

    try {
      if (activeTask.status !== targetStatus) {
        await taskService.update(activeTask.id, {
          status: targetStatus,
          order: overTask?.order ?? 9999,
        });
      } else {
        const { data: columnTasks } =
          await taskService.getByStatus(targetStatus);
        const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
        const newIndex = columnTasks.findIndex((t) => t.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex);
          await Promise.all(
            reordered.map((task, index) =>
              taskService.update(task.id, { order: index }),
            ),
          );
        }
      }
      qc.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err) {
      console.error("Failed to update task:", err);
      qc.invalidateQueries({ queryKey: ["tasks"] });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 items-start overflow-x-auto pb-6">
        {COLUMNS.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
