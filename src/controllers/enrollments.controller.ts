import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import prisma from "../config/db.config.js";
import ApiError from "../utils/apiError.util.js";
import ApiReponse from "../utils/apiResponse.util.js";

interface IEnrollment {
  studentId: string;
  courseId: string;
}

export const getEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: {
        enrolledAt: "desc",
      },
      select: {
        id: true,
        enrolledAt: true,
        student: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        course: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    if (!enrollments || enrollments.length === 0) {
      throw new ApiError(404, "No enrollments found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(200, "Enrollments retrieved successfully", enrollments),
      );
  },
);

export const getEnrollmentsByCourseId = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
      throw new ApiError(400, "Course ID is required");
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    if (!enrollments || enrollments.length === 0) {
      throw new ApiError(404, "No enrollments found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(200, "Enrollments retrieved successfully", enrollments),
      );
  },
);

export const getEnrollmentsByStudentId = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;

    if (!studentId) {
      throw new ApiError(400, "Student ID is required");
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    if (!enrollments || enrollments.length === 0) {
      throw new ApiError(404, "No enrollments found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(200, "Enrollments retrieved successfully", enrollments),
      );
  },
);

export const createEnrollmentInBatch = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollments: IEnrollment[] = req.body;

    if (!Array.isArray(enrollments) || enrollments.length === 0) {
      throw new ApiError(400, "At least one enrollment is required");
    }

    const validatedEnrollments = enrollments.map((enrollment, index) => {
      const { studentId, courseId } = enrollment;

      if (!studentId || !courseId) {
        throw new ApiError(
          400,
          `Missing fields in enrollment at index ${index}`,
        );
      }

      return {
        studentId,
        courseId,
      };
    });

    const createdEnrollments = await prisma.enrollment.createMany({
      data: validatedEnrollments,
      skipDuplicates: true,
    });

    if (createdEnrollments.count === 0) {
      throw new ApiError(400, "No enrollments were created");
    }

    res.status(201).json(
      new ApiReponse(
        201,
        `${createdEnrollments.count} enrollment(s) created successfully`,
        {
          createdCount: createdEnrollments.count,
        },
      ),
    );
  },
);
