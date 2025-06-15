import { z } from "zod";

export const gradeEnum = z.enum([
  "A_PLUS",
  "A",
  "A_MINUS",
  "B_PLUS",
  "B",
  "B_MINUS",
  "C_PLUS",
  "C",
  "C_MINUS",
  "D_PLUS",
  "D",
  "D_MINUS",
  "F",
  "INCOMPLETE",
  "PASS",
  "FAIL",
]);

const singleResultSchema = z.object({
  studentId: z.string().min(1, "studentId is required"),
  courseId: z.string().min(1, "courseId is required"),
  grade: gradeEnum,
  numericGrade: z.number().min(0, "numericGrade must be a number ≥ 0"),
  maxPoints: z.number().min(0, "maxPoints must be a number ≥ 0"),
  examType: z.string().min(1, "examType is required"),
});

const resultSchema = z.array(singleResultSchema);

export default resultSchema;
