import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import prisma from "../config/db.config.js";
import ApiReponse from "../utils/apiResponse.util.js";

interface IAttendance {
  studentId: string;
  courseId: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  date: Date;
  notes?: string;
}

export const getAttendanceByCourseId = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;

    if (!courseId) {
      throw new ApiError(400, "Course ID is required");
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        date: true,
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
        createdAt: true,
      },
    });

    if (!attendance || attendance.length === 0) {
      throw new ApiError(404, "No attendance found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(200, "Attendance retrieved successfully", attendance)
      );
  }
);

export const getAttendanceByStudentId = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;

    if (!studentId) {
      throw new ApiError(400, "Student ID is required");
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        date: true,
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
        createdAt: true,
      },
    });

    if (!attendance || attendance.length === 0) {
      throw new ApiError(404, "No attendance found");
    }

    res
      .status(200)
      .json(
        new ApiReponse(200, "Attendance retrieved successfully", attendance)
      );
  }
);

export const createAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const records: IAttendance[] = req.body;

    if (!userId) {
      throw new ApiError(403, "User not found");
    }

    if (!Array.isArray(records) || records.length === 0) {
      throw new ApiError(400, "At least one record is required");
    }

    const validatedRecords = records.map((record, index) => {
      const { studentId, courseId, status, date } = record;

      if (!studentId || !courseId || !status || !date) {
        throw new ApiError(400, `Missing fields in record at index ${index}`);
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, `Invalid date in record at index ${index}`);
      }

      return {
        studentId,
        courseId,
        status,
        date: parsedDate,
        facultyId: userId,
      };
    });

    const attendance = await prisma.attendance.createMany({
      data: validatedRecords,
      skipDuplicates: true,
    });

    res
      .status(201)
      .json(new ApiReponse(201, "Attendance taken successfully", attendance));
  }
);
