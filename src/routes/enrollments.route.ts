import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import {
  createEnrollmentInBatch,
  getEnrollments,
  getEnrollmentsByCourseId,
  getEnrollmentsByStudentId,
} from "../controllers/enrollments.controller.js";
import enrollmentSchema from "../validations/enrollmentSchema.js";

const router = Router();

router
  .route("/all-enrollments")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollments)
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(enrollmentSchema),
    createEnrollmentInBatch,
  );
router
  .route("/student-enrollments/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollmentsByStudentId);
router
  .route("/course-enrollments/:courseId")
  .get(authMiddleware, validateApiKey, checkRole, getEnrollmentsByCourseId);

export default router;
