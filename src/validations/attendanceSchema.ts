import { z } from "zod";

const attendanceSchema = z.array(
  z.object({
    studentId: z.string().min(1, "studentId is required"),
    courseId: z.string().min(1, "courseId is required"),
    status: z.enum(["Present", "Absent", "Late", "Excused"]),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Must be a valid ISO date string.",
    }),
  }),
);

export default attendanceSchema;
