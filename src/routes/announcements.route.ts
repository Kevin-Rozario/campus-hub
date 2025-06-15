import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/announcements.controller.js";

const router = Router();

router
  .route("/")
  .get(authMiddleware, validateApiKey, checkRole, getAnnouncements)
  .post(authMiddleware, validateApiKey, checkRole, createAnnouncement);

export default router;
