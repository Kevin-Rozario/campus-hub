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
  },
);

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const Events: IEvent[] = req.body;

  if (!userId) {
    throw new ApiError(403, "User not found");
  }

  if (!Array.isArray(Events) || Events.length === 0) {
    throw new ApiError(400, "At least one event is required");
  }

  const validatedEvents = Events.map((event, index) => {
    const { title, description, startDate, endDate, location, eventForRole } =
      event;

    if (!title || !description || !startDate || !endDate || !location) {
      throw new ApiError(400, `Missing fields in event at index ${index}`);
    }

    if (!Array.isArray(eventForRole) || eventForRole.length === 0) {
      throw new ApiError(
        400,
        `At least one role is required in event at index ${index}`,
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, `Invalid date format in event at index ${index}`);
    }

    if (start > end) {
      throw new ApiError(
        400,
        `Start date must be before end date in event at index ${index}`,
      );
    }

    if (start < new Date()) {
      throw new ApiError(
        400,
        `Start date must be in the future in event at index ${index}`,
      );
    }

    return {
      title,
      description,
      startDate: start,
      endDate: end,
      location,
      eventForRole,
      organizerId: userId,
    };
  });

  const created = await prisma.event.createMany({
    data: validatedEvents,
    skipDuplicates: true,
  });

  if (created.count === 0) {
    throw new ApiError(400, "No events were created");
  }

  res.status(201).json(
    new ApiReponse(201, `${created.count} event(s) created successfully`, {
      createdCount: created.count,
    }),
  );
});
