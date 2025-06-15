import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import prisma from "../config/db.config.js";
import ApiError from "../utils/apiError.util.js";
import ApiReponse from "../utils/apiResponse.util.js";

interface ICourse {
  name: string;
  code: string;
  description: string;
}

interface IMaterial {
  title: string;
  url: string;
  fileSize: number;
  mimeType: string;
}

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      materials: {
        select: {
          id: true,
          title: true,
          url: true,
          fileSize: true,
          mimeType: true,
        },
      },
    },
  });

  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No courses found");
  }

  res
    .status(200)
    .json(new ApiReponse(200, "Courses retrieved successfully", courses));
});

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { name, code, description }: ICourse = req.body;

    if (!userId) {
      throw new ApiError(403, "User not found");
    }

    if (!name || !code || !description) {
      throw new ApiError(400, "All fields are required");
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        code,
      },
    });

    if (existingCourse) {
      throw new ApiError(409, "Course already exists");
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        createdById: userId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        credits: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!course) {
      throw new ApiError(500, "Failed to create course");
    }

    res
      .status(201)
      .json(new ApiReponse(201, "Course created successfully", course));
  }
);

export const getCourseMaterialById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Course ID is required");
    }

    const materials = await prisma.material.findMany({
      where: {
        courseId: id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        url: true,
        fileSize: true,
        mimeType: true,
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!materials || materials.length === 0) {
      throw new ApiError(404, "No materials found");
    }

    res
      .status(200)
      .json(new ApiReponse(200, "Materials retrieved successfully", materials));
  }
);

export const createCourseMaterialById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const courseId = req.params?.id;
    const { title, url, fileSize, mimeType }: IMaterial = req.body;

    if (!userId) {
      throw new ApiError(403, "User not found");
    }

    if (!courseId) {
      throw new ApiError(400, "Course ID is required");
    }

    if (!title || !url || !mimeType) {
      throw new ApiError(400, "All fields are required");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const material = await prisma.material.create({
      data: {
        title,
        url,
        fileSize,
        mimeType,
        courseId,
        uploadedById: userId,
      },
      select: {
        id: true,
        title: true,
        url: true,
        fileSize: true,
        mimeType: true,
        course: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!material) {
      throw new ApiError(500, "Failed to create material");
    }

    res
      .status(201)
      .json(new ApiReponse(201, "Material created successfully", material));
  }
);
