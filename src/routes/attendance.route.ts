import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import {
  createAttendance,
  getAttendanceByCourseId,
  getAttendanceByStudentId,
} from "../controllers/attendance.controller.js";
import attendanceSchema from "../validations/attendanceSchema.js";

const router = Router();

router
  .route("/take-attendance")
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(attendanceSchema),
    createAttendance,
  );

router
  .route("/student-attendance/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getAttendanceByStudentId);

router
  .route("/course-attendance/:courseId")
  .get(authMiddleware, validateApiKey, checkRole, getAttendanceByCourseId);

export default router;
