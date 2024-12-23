"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Search } from "lucide-react";

import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import Input from "../components/Input";
import Toaster from "../components/Toaster";
import Button from "../components/Button";

import useKanbanStore from "../store/useKanbanStore";
import { ThemeProvider } from "../providers/ThemeProvider";
import { delay } from "../utils/utils";

const KanbanBoard = () => {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTaskStatus, setProcessingTaskStatus] = useState("");
  const [taskToEdit, setTaskToEdit] = useState();
  const [searchValue, setSearchValue] = useState(
    searchParams?.get("search") || ""
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({});

  const timerRef = useRef();

  const router = useRouter();
  const pathname = usePathname();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const { initialTasks, getTasks, saveTasks } = useKanbanStore();

  const loadData = async (tasks) => {
    await delay(3000);
    setTasks(tasks);
    saveTasks(tasks);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData(getTasks());
  }, []);

  useEffect(() => {
    const haveUnfinished = tasks.some((task) => task.status !== "DONE");

    if (tasks.length && !haveUnfinished) {
      toastOpener();
      setToastConfig({
        title: "Congrats! 🎉",
        description: "You have completed all tasks!",
        action: (
          <Button
            className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8 mr-3"
            onClick={() => {
              setIsLoading(true);
              loadData(initialTasks);
            }}
          >
            Try again
          </Button>
        ),
      });
    }
  }, [tasks]);

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

    toastOpener();
    setToastConfig({
      title: "Все ок",
      description: "Завдання успішно збережено",
    });

    editTaskHandler();
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTaskHandler = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);

    toastOpener();
    setToastConfig({
      title: "Все ок",
      description: "Завдання успішно видалене",
    });

    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const toastOpener = () => {
    setToastOpen(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastOpen(true);
    }, 100);
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
        <Toaster
          open={toastOpen}
          onOpenChange={setToastOpen}
          toastConfig={toastConfig}
        />
      </div>
    </ThemeProvider>
  );
};

export default KanbanBoard;
