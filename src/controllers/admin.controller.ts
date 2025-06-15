import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import prisma from "../config/db.config.js";
import ApiReponse from "../utils/apiResponse.util.js";
import { Role } from "./auth.controller.js";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      isActive: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  res
    .status(200)
    .json(new ApiReponse(200, "Users retrieved successfully", users));
});

export const changeUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role }: { role: Role } = req.body;

    if (!id) {
      throw new ApiError(400, "User ID is required");
    }

    if (!role) {
      throw new ApiError(400, "Role is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        fullName: true,
        role: true,
      },
    });

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user role");
    }

    res
      .status(200)
      .json(new ApiReponse(200, "User role updated successfully", updatedUser));
  }
);
