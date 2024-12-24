import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import Skeleton from "./Skeleton";

import { statusConfig } from "../configs/core";

const Column = ({
  id,
  tasks,
  isLoading,
  searchValue,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const filteredTasks = searchValue
    ? tasks.filter((task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase())
      )
    : tasks;

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
      className={`flex h-full w-80 flex-col rounded-xl overflow-hidden border bg-card ${statusConfig[id].color}`}
    >
      <div className={"p-4"}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">
            {statusConfig[id].title}
            {filteredTasks.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-2 py-1 text-xs">
                {filteredTasks.length}
              </span>
            )}
          </h2>
        </div>
        <SortableContext
          id={id}
          items={filteredTasks}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="flex-1 space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                searchValue={searchValue}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      <div
        role="button"
        className={`flex-1 mt-3 border-t bg-card px-4 py-2 text-center font-bold bg-muted ${statusConfig[id].color}`}
        onClick={() => onAddTask(id)}
      >
        Нове завдання
      </div>
    </div>
  );
};

export default Column;
