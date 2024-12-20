import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const TaskCard = ({ task, searchValue, onEditTask, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isMissed = task.dueDate && new Date(task.dueDate) < new Date();

  const highlightDescription = (description, query) => {
    if (!query) {
      return description;
    }

    const parts = description.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative rounded-lg border bg-card p-4 shadow-sm transition-all ${
        isDragging && "cursor-grabbing shadow-lg"
      } ${isDragging && "cursor-grabbing shadow-lg"} ${
        !isDragging && "cursor-grab hover:shadow-md"
      } ${isMissed && "border-red-500 bg-red-50 dark:bg-red-900/10"}`}
    >
      <div className="mb-2 flex items-start justify-between">
        <h5 className="font-medium">
          {searchValue
            ? highlightDescription(task.description, searchValue)
            : task.description}
        </h5>
        <div className="flex items-start justify-end">
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded p-1 hover:bg-accent">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onPointerDown={(e) => e.preventDefault()}
                  onSelect={() => {
                    onEditTask(task);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Редагувати
                </DropdownMenuItem>
                <DropdownMenuItem
                  onPointerDown={(e) => e.preventDefault()}
                  onSelect={() => onDeleteTask(task.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Видалити
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {task.dueDate && (
        <div className="text-xs text-muted-foreground">
          До: {format(new Date(task.dueDate), "PPP")}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
