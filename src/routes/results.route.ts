import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import {
  createResult,
  getResultsById,
} from "../controllers/results.controller.js";
import resultSchema from "../validations/resultSchema.js";

const router = Router();

router
  .route("/upload-results")
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(resultSchema),
    createResult,
  );
router
  .route("/student-results/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getResultsById);

export default router;
