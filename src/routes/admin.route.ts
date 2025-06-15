import { Router } from "express";
import {
  authMiddleware,
  checkRole,
  validateApiKey,
} from "../middlewares/auth.middleware.js";
import {
  changeUserRole,
  getAllUsers,
} from "../controllers/admin.controller.js";

const router = Router();

router
  .route("/admin/users")
  .get(authMiddleware, validateApiKey, checkRole, getAllUsers);

router
  .route("/admin/users/:id/role")
  .put(authMiddleware, checkRole, changeUserRole);

export default router;
