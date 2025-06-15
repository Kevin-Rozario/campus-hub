import { z } from "zod";

const singleEnrollmentSchema = z.object({
  studentId: z.string().min(1, "studentId is required"),
  courseId: z.string().min(1, "courseId is required"),
});

const enrollmentSchema = z.array(singleEnrollmentSchema);

export default enrollmentSchema;
