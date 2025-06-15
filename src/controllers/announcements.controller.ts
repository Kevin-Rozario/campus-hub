import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import prisma from "../config/db.config.js";
import ApiReponse from "../utils/apiResponse.util.js";

interface IAnnouncement {
  title: string;
  body: string;
}

export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { title, body }: IAnnouncement = req.body;

    if (!userId) {
      throw new ApiError(403, "User not found");
    }

    if (!title || !body) {
      throw new ApiError(400, "All fields are required");
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        postedById: userId,
      },
      select: {
        id: true,
        title: true,
        body: true,
        postedById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!announcement) {
      throw new ApiError(500, "Failed to create announcement");
    }

    res
      .status(201)
      .json(
        new ApiReponse(201, "Announcement created successfully", announcement),
      );
  },
);

export const getAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        postedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!announcements || announcements.length === 0) {
      throw new ApiError(404, "No announcements found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(
          200,
          "Announcements retrieved successfully",
          announcements,
        ),
      );
  },
);
