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
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import registerSchema from "../validations/registerSchema.js";
import loginSchema from "../validations/loginSchema.js";

const router = Router();

router.post("/register", validationMiddleware(registerSchema), registerUser);
router.post("/login", validationMiddleware(loginSchema), loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/generate-key", authMiddleware, createApiKey);
router.get("/profile", authMiddleware, getProfile);
router.get("/refresh-token", refreshToken);

export default router;
