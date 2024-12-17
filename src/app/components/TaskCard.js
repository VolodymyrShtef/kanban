import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";

export function TaskCard({ task }) {
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
        <h4 className="font-medium">{task.description}</h4>
      </div>
      {task.dueDate && (
        <div className="text-xs text-muted-foreground">
          Due: {format(new Date(task.dueDate), "PPP")}
        </div>
      )}
    </div>
  );
}
