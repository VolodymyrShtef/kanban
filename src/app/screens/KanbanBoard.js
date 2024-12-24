"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Search } from "lucide-react";

import Column from "../components/Column";
import TaskForm from "../components/TaskForm";
import Input from "../components/Input";
import Toaster from "../components/Toaster";
import Button from "../components/Button";

import useKanbanStore from "../store/useKanbanStore";
import { ThemeProvider } from "../providers/ThemeProvider";
import { delay, getTaskById, setBoard } from "../utils/utils";
import TaskCard from "../components/TaskCard";
import { dragEnd, dragOverHandler } from "../utils/dnd";

const KanbanBoard = () => {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTaskStatus, setProcessingTaskStatus] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchValue, setSearchValue] = useState(
    searchParams?.get("search") || ""
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({});

  const [boardSections, setBoardSections] = useState({});
  const [activeId, setActiveId] = useState(null);

  const timerRef = useRef();

  const router = useRouter();
  const pathname = usePathname();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { initialTasks, getTasks, saveTasks } = useKanbanStore();

  const dropAnimation = {
    ...defaultDropAnimation,
  };

  // Data fetching
  const loadData = async (tasks) => {
    await delay(3000);
    tasksSetter(tasks);
    setIsLoading(false);
  };

  // Lifecycle
  useEffect(() => {
    loadData(getTasks());
  }, []);

  useEffect(() => {
    setBoardSections(setBoard(tasks));

    const haveUnfinished = tasks.some((task) => task.status !== "DONE");

    if (tasks.length && !haveUnfinished) {
      toastOpener({
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

  // Managing tasks
  const tasksSetter = (tasks) => {
    setTasks(tasks);
    saveTasks(tasks);
  };

  const editTaskHandler = (task) => {
    setTaskToEdit(task ? task : null);
    setProcessingTaskStatus(task?.status ? task.status : null);
  };

  const submitTaskHandler = (taskData) => {
    let newTasks = taskToEdit?.title
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

    toastOpener({
      title: "Все ок",
      description: "Завдання успішно збережено",
    });

    taskToEdit?.title && editTaskHandler();
    tasksSetter(newTasks);
  };

  const deleteTaskHandler = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    tasksSetter(newTasks);

    toastOpener({
      title: "Все ок",
      description: "Завдання успішно видалене",
    });
  };

  // Toaster
  const toastOpener = (config) => {
    setToastOpen(false);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToastOpen(true);
    }, 100);

    setToastConfig(config);
  };

  // Drag & Drop
  const dragStartHandler = ({ active }) => {
    setActiveId(active.id);
  };

  const dragEndHandler = ({ active, over }) => {
    const overContainer = dragEnd(
      active,
      over,
      boardSections,
      setBoardSections
    );

    if (overContainer) {
      const newTasks = tasks.map((task) =>
        task.id === activeId ? { ...task, status: overContainer } : task
      );

      tasksSetter(newTasks);
      setActiveId(null);
    }
  };

  const task = activeId ? getTaskById(tasks, activeId) : null;

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={dragStartHandler}
          onDragOver={({ active, over }) => {
            dragOverHandler(active, over, boardSections, setBoardSections);
          }}
          onDragEnd={dragEndHandler}
        >
          <div className="flex justify-center flex-col sm:flex sm:flex-row sm:flex-wrap lg:flex-nowrap gap-6 overflow-x-auto pb-4">
            {Object.keys(boardSections).map((boardSectionKey) => (
              <Column
                key={boardSectionKey}
                id={boardSectionKey}
                tasks={boardSections[boardSectionKey]}
                isLoading={isLoading}
                searchValue={searchValue}
                onAddTask={setProcessingTaskStatus}
                onEditTask={editTaskHandler}
                onDeleteTask={deleteTaskHandler}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <TaskCard task={task} /> : null}
          </DragOverlay>
        </DndContext>
        <TaskForm
          open={Boolean(processingTaskStatus)}
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
