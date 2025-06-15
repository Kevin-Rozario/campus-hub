import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createEnrollmentInBatch,
  getEnrollments,
  getEnrollmentsByCourseId,
  getEnrollmentsByStudentId,
} from "../controllers/enrollments.controller.js";

const router = Router();

router
  .route("/enrollments")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollments)
  .post(authMiddleware, validateApiKey, checkRole, createEnrollmentInBatch);
router
  .route("/enrollments/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollmentsByStudentId);
router
  .route("/enrollments/:courseId")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollmentsByCourseId);

export default router;
