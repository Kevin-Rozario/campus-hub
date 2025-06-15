import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import {
  createCourse,
  createCourseMaterialById,
  getCourseMaterialById,
  getCourses,
} from "../controllers/courses.controller.js";
import courseSchema from "../validations/courseSchema.js";
import materialSchema from "../validations/materialSchema.js";

const router = Router();

router
  .route("/courses")
  .get(authMiddleware, validateApiKey, checkRole, getCourses)
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(courseSchema),
    createCourse,
  );

router
  .route("/courses/:courseId/materials")
  .get(authMiddleware, validateApiKey, checkRole, getCourseMaterialById)
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(materialSchema),
    createCourseMaterialById,
  );

export default router;
