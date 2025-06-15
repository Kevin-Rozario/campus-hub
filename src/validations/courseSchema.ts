import { z } from "zod";

const courseSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .toLowerCase()
    .trim(),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .toLowerCase()
    .trim(),
  credits: z.number().min(0, "Credits must be at least 0").optional(),
});

export default courseSchema;
