import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import prisma from "../config/db.config.js";
import ApiError from "../utils/apiError.util.js";
import ApiReponse from "../utils/apiResponse.util.js";

interface IEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  eventForRole: string[];
}

export const getEventsByRole = asyncHandler(
  async (req: Request, res: Response) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new ApiError(403, "User role not found");
    }

    const events = await prisma.event.findMany({
      where: {
        eventForRole: {
          has: userRole,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        location: true,
        createdAt: true,
        organizer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!events || events.length === 0) {
      throw new ApiError(404, "No events found");
    }

    res
      .status(200)
      .json(new ApiReponse(200, "Events retrieved successfully", events));
  }
);

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const {
    title,
    description,
    startDate,
    endDate,
    location,
    eventForRole,
  }: IEvent = req.body;

  if (!userId) {
    throw new ApiError(403, "User not found");
  }

  if (
    !title ||
    !description ||
    !startDate ||
    !endDate ||
    !location ||
    !Array.isArray(eventForRole) ||
    eventForRole.length === 0
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  if (start > end) {
    throw new ApiError(400, "Start date must be before end date");
  }

  if (start < new Date()) {
    throw new ApiError(400, "Start date must be in the future");
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      startDate: start,
      endDate: end,
      location,
      eventForRole,
      organizerId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      location: true,
      createdAt: true,
      organizer: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!event) {
    throw new ApiError(500, "Failed to create event");
  }

  res
    .status(201)
    .json(new ApiReponse(201, "Event created successfully", event));
});
