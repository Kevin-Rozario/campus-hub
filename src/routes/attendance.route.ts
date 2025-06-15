import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createAttendance,
  getAttendanceByCourseId,
  getAttendanceByStudentId,
} from "../controllers/attendance.controller.js";

const router = Router();

router
  .route("/attendance")
  .post(authMiddleware, validateApiKey, checkRole, createAttendance);

router
  .route("/attendance/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getAttendanceByStudentId);

router
  .route("/attendance/:courseId")
  .get(authMiddleware, validateApiKey, checkRole, getAttendanceByCourseId);

export default router;
