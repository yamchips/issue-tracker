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
    .max(65535)
    .optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedToUserId: z
    .string()
    .min(1, { message: "AssignedToUserId is required." })
    .max(255)
    .optional()
    .nullable(),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(5, { message: "Password should be more than 5 characters" }),
});
