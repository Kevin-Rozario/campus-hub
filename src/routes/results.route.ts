import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createResult,
  getResultsById,
} from "../controllers/results.controller.js";

const router = Router();

router.route("").post(authMiddleware, validateApiKey, checkRole, createResult);
router
  .route("/results/:studentId")
  .get(authMiddleware, validateApiKey, checkRole, getResultsById);

export default router;
