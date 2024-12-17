"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { delay } from "../../utils/utils";
import { Column } from "../components/Column";
import useKanbanStore from "../store/useKanbanStore";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getTasks } = useKanbanStore();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const loadData = async () => {
      await delay(3000);
      setTasks(getTasks());
      setIsLoading(false);
    };
    loadData();
  }, []);

  const dragEndHandler = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newTasks = tasks.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      );

      setTasks(newTasks);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-8">
        <DndContext sensors={sensors} onDragEnd={dragEndHandler}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <Column
              status="TODO"
              tasks={tasks.filter((task) => task.status === "TODO")}
              isLoading={isLoading}
            />
            <Column
              status="IN_PROGRESS"
              tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
              isLoading={isLoading}
            />
            <Column
              status="DONE"
              tasks={tasks.filter((task) => task.status === "DONE")}
              isLoading={isLoading}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
