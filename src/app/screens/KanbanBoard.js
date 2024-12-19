"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { v4 as uuidv4 } from "uuid";

import Column from "../components/Column";
import TaskForm from "../components/TaskForm";

import useKanbanStore from "../store/useKanbanStore";
import { delay } from "../../utils/utils";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTaskStatus, setProcessingTaskStatus] = useState("");
  const [taskToEdit, setTaskToEdit] = useState();

  const { getTasks, saveTasks } = useKanbanStore();

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

  const editTaskHandler = (task) => {
    setTaskToEdit(task ? task : {});
    setProcessingTaskStatus(task ? task.status : "");
  };

  const submitTaskHandler = (taskData) => {
    let newTasks = taskToEdit?.description
      ? tasks.map((task) =>
          task.id === taskToEdit.id
            ? {
                ...task,
                ...taskData,
              }
            : task
        )
      : [
          ...tasks,
          {
            ...taskData,
            id: uuidv4(),
            status: processingTaskStatus,
          },
        ];

    editTaskHandler();
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTaskHandler = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks);
    saveTasks(newTasks);
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
              onAddTask={setProcessingTaskStatus}
              onEditTask={editTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
            <Column
              status="IN_PROGRESS"
              tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
              isLoading={isLoading}
              onAddTask={setProcessingTaskStatus}
              onEditTask={editTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
            <Column
              status="DONE"
              tasks={tasks.filter((task) => task.status === "DONE")}
              isLoading={isLoading}
              onAddTask={setProcessingTaskStatus}
              onEditTask={editTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
          </div>
        </DndContext>
        <TaskForm
          open={processingTaskStatus}
          onOverlayClose={editTaskHandler}
          onFormSubmit={submitTaskHandler}
          initialData={taskToEdit}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
