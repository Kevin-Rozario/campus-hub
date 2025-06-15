import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createCourse,
  createCourseMaterialById,
  getCourseMaterialById,
  getCourses,
} from "../controllers/courses.controller.js";

const router = Router();

router
  .route("/courses")
  .get(authMiddleware, validateApiKey, checkRole, getCourses)
  .post(authMiddleware, validateApiKey, checkRole, createCourse);

router
  .route("/courses/:courseId/materials")
  .get(authMiddleware, validateApiKey, checkRole, getCourseMaterialById)
  .post(authMiddleware, validateApiKey, checkRole, createCourseMaterialById);

export default router;
