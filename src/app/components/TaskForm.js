import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "./Button";
import Input from "./Input";
import Label from "./Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog.js";

import { format } from "date-fns";

import { taskSchema } from "../configs/schema";

const TaskForm = ({ open, onOverlayClose, onFormSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (!initialData?.title) {
      reset({});
    }

    reset({
      title: initialData?.title || null,
      description: initialData?.description || null,
      dueDate: initialData?.dueDate
        ? format(new Date(initialData?.dueDate), "yyyy-MM-dd")
        : null,
    });
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={onOverlayClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.title ? "Редагувати завдання" : "Нове завдання"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            reset({});
            onOverlayClose();
            onFormSubmit(data);
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Назва</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Введи назву завдання"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Введи опис"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Закінчити до</Label>
            <div className="relative">
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={onOverlayClose}
              className={
                "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              }
            >
              Відмінити
            </Button>
            <Button
              type="submit"
              className={
                "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              }
            >
              {initialData?.title ? "Оновити" : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
