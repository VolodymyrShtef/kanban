import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, "Опис завдання має містити мін 3 символи")
    .nullable(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => {
      return value ? new Date(value) : undefined;
    }),
  createdAt: z
    .date()
    .optional()
    .transform(() => new Date()),
});
