import {
  createApiKey,
  getProfile,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/generate-key", authMiddleware, createApiKey);
router.get("/profile", authMiddleware, getProfile);
router.get("/refresh-token", refreshToken);

export default router;
