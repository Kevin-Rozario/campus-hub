import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getEventsByRole,
} from "../controllers/events.controller.js";

const router = Router();

router
  .route("/events")
  .get(authMiddleware, validateApiKey, checkRole, getEventsByRole)
  .post(authMiddleware, validateApiKey, checkRole, createEvent);

export default router;
