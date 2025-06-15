import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import type { IUser } from "../utils/jwt.util.js";
import ApiError from "../utils/apiError.util.js";
import permissions from "../config/permissions.config.js";
import { hashApiKey } from "../utils/apiKey.util.js";
import prisma from "../config/db.config.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    throw new ApiError(403, "Access token or refresh token not found");
  }

  try {
    const user = verifyToken(accessToken, "access");
    if (!user) {
      throw new ApiError(401, "Access token is invalid or expired");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying access token:", error);
    throw new ApiError(401, "Access token is invalid or expired");
  }
};

export const checkRole = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (!userRole) {
    throw new ApiError(403, "User role not found");
  }

  const path = req.originalUrl;
  const method = req.method;

  const allowedRoles = (
    permissions as Record<string, Record<string, string[]>>
  )[path]?.[method];

  if (!allowedRoles || !allowedRoles.includes(userRole)) {
    throw new ApiError(403, "Access denied");
  }
  next();
};

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    throw new ApiError(403, "API key not found");
  }

  const hashedApiKey = hashApiKey(apiKey);
  const existingApiKey = await prisma.apiKey.findUnique({
    where: {
      key: hashedApiKey,
    },
  });

  if (!existingApiKey) {
    throw new ApiError(403, "Invalid API key");
  }

  next();
};
