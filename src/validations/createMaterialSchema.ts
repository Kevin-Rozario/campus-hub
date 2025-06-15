import { z } from "zod";

const createMaterialSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .toLowerCase()
    .trim(),
  url: z.string().url("Invalid URL").trim(),
  fileSize: z.number().min(10, "File size must be at least 10 bytes"),
  mimeType: z
    .string()
    .min(3, "Mime type must be at least 3 characters")
    .optional(),
});

export default createMaterialSchema;
