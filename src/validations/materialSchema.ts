import { z } from "zod";

const materialSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .toLowerCase()
    .trim(),
  url: z.string().url("Invalid URL").trim(),
  fileSize: z.number().min(10, "File size must be at least 10 bytes"),
  mimeType: z
    .enum(["application/pdf", "image/png", "image/jpeg", "text/plain"])
    .optional(),
});

export default materialSchema;
