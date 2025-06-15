import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util.js";
import prisma from "../config/db.config.js";
import ApiError from "../utils/apiError.util.js";
import ApiReponse from "../utils/apiResponse.util.js";

enum IGradeType {
  a_plus = "A_PLUS",
  a = "A",
  a_minus = "A_MINUS",
  b_plus = "B_PLUS",
  b = "B",
  b_minus = "B_MINUS",
  c_plus = "C_PLUS",
  c = "C",
  c_minus = "C_MINUS",
  d_plus = "D_PLUS",
  d = "D",
  d_minus = "D_MINUS",
  f = "F",
  incomplete = "INCOMPLETE",
  pass = "PASS",
  fail = "FAIL",
}

interface IResult {
  studentId: string;
  courseId: string;
  grade?: IGradeType;
  numericGrade?: number;
  maxPoints?: number;
  examType?: string;
}

export const getResultsById = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;

    if (!studentId) {
      throw new ApiError(400, "Student ID is required");
    }

    const results = await prisma.result.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        course: {
          select: {
            code: true,
            name: true,
          },
        },
        grade: true,
        numericGrade: true,
        maxPoints: true,
        examType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!results || results.length === 0) {
      throw new ApiError(404, "No results found");
    }

    res
      .status(200)
      .json(new ApiReponse(200, "Results retrieved successfully", results));
  },
);

export const createResult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const {
      studentId,
      courseId,
      grade,
      numericGrade,
      maxPoints,
      examType,
    }: IResult = req.body;

    if (!userId) {
      throw new ApiError(403, "User not found");
    }

    if (!studentId || !courseId) {
      throw new ApiError(400, "All fields are required");
    }

    const result = await prisma.result.create({
      data: {
        studentId,
        courseId,
        grade,
        numericGrade,
        maxPoints,
        examType,
        declaredById: userId,
      },
      select: {
        id: true,
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        course: {
          select: {
            code: true,
            name: true,
          },
        },
        grade: true,
        numericGrade: true,
        maxPoints: true,
        examType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!result) {
      throw new ApiError(500, "Failed to create result");
    }

    res
      .status(201)
      .json(new ApiReponse(201, "Result created successfully", result));
  },
);
