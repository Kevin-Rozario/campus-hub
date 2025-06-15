import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/announcements.controller.js";
import announcementSchema from "../validations/announcementSchema.js";

const router = Router();

router
  .route("/announcements")
  .get(authMiddleware, validateApiKey, checkRole, getAnnouncements)
  .post(
    authMiddleware,
    validateApiKey,
    checkRole,
    validationMiddleware(announcementSchema),
    createAnnouncement,
  );

export default router;
