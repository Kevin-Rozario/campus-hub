import { z } from "zod";

const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .toLowerCase()
    .trim(),
  body: z
    .string()
    .min(3, "Body must be at least 3 characters")
    .toLowerCase()
    .trim(),
});

export default announcementSchema;
