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
    reset({
      description: initialData?.description ? initialData.description : "",
      dueDate: initialData?.dueDate
        ? format(new Date(initialData?.dueDate), "yyyy-MM-dd")
        : undefined,
    });
  }, [initialData]);

  // TO-DO: check submit flow
  const onSubmitForm = (data) => {
    onFormSubmit(data);
    closeOverlay();
  };

  const closeOverlay = () => {
    reset();
    onOverlayClose();
  };

  return (
    <Dialog open={Boolean(open)} onOpenChange={closeOverlay}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.description ? "Редагувати завдання" : "Нове завдання"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Введи опис завдання"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Закінчити до</Label>
            <div className="relative">
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeOverlay}>Відмінити</Button>
            <Button type="submit">
              {initialData?.description ? "Оновити" : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
