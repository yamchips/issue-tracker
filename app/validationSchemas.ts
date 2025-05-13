import { z } from "zod";

export const issuePatchSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(255)
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .default("")
    .optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedToUserId: z.string().optional().nullable(),
});
