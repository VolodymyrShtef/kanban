import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import Skeleton from "./Skeleton";
import { statusConfig } from "../configs/core";

export function Column({ status, tasks, isLoading }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const filteredTasks = tasks;

  if (isLoading) {
    return (
      <div className="flex h-full w-80 flex-col rounded-lg border bg-card p-4">
        <div className="mb-4">
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-80 flex-col rounded-lg border bg-card p-4 ${statusConfig[status].color}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          {statusConfig[status].title}
          {filteredTasks.length > 0 && (
            <span className="ml-1 rounded-full bg-muted px-2 py-1 text-xs">
              {filteredTasks.length}
            </span>
          )}
        </h2>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-3">
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
