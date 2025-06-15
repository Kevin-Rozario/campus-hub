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
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import eventSchema from "../validations/eventSchema.js";

const router = Router();

router
  .route("/events")
  .get(authMiddleware, validateApiKey, checkRole, getEventsByRole)
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(eventSchema),
    createEvent,
  );

export default router;
