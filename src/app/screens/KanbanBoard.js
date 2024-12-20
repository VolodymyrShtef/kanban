"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import Input from "../components/Input";

import useKanbanStore from "../store/useKanbanStore";
import { ThemeProvider } from "../providers/ThemeProvider";
import { delay } from "../utils/utils";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

const KanbanBoard = () => {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTaskStatus, setProcessingTaskStatus] = useState("");
  const [taskToEdit, setTaskToEdit] = useState();
  const [searchValue, setSearchValue] = useState(
    searchParams?.get("search") || ""
  );

  const { getTasks, saveTasks } = useKanbanStore();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      await delay(3000);

      setTasks(getTasks());
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }

    router.push(pathname + "?" + params.toString());
  }, [searchValue]);

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
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground mx-auto max-w-4xl p-2">
        <div className="mb-8 flex flex-col gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold mb-5">ЗАВДАННЯ</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Знайти..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <DndContext sensors={sensors} onDragEnd={dragEndHandler}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <Column
              status="TODO"
              tasks={tasks.filter((task) => task.status === "TODO")}
              isLoading={isLoading}
              searchValue={searchValue}
              onAddTask={setProcessingTaskStatus}
              onEditTask={editTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
            <Column
              status="IN_PROGRESS"
              tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
              isLoading={isLoading}
              searchValue={searchValue}
              onAddTask={setProcessingTaskStatus}
              onEditTask={editTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
            <Column
              status="DONE"
              tasks={tasks.filter((task) => task.status === "DONE")}
              isLoading={isLoading}
              searchValue={searchValue}
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
    </ThemeProvider>
  );
};

export default KanbanBoard;
