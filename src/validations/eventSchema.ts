import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  location: z.string(),
  eventForRole: z.array(z.string().min(1)),
});

export default eventSchema;
