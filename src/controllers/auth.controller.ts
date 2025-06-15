import asyncHandler from "../utils/asyncHandler.util.js";
import ApiReponse from "../utils/apiResponse.util.js";
import ApiError from "../utils/apiError.util.js";
import type { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/passwords.util.js";
import prisma from "../config/db.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.util.js";
import { generateApiKey, hashApiKey } from "../utils/apiKey.util.js";

export enum Role {
  student = "Student",
  faculty = "Faculty",
  admin = "Admin",
}

interface IRegisterUser {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  phoneNumber?: string;
}

interface ILoginUser {
  email: string;
  password: string;
}

interface ICookiesOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge?: number;
}

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, fullName, role, phoneNumber }: IRegisterUser =
      req.body;

    if (!email || !password || !fullName) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    if (role !== Role.student && role !== Role.faculty) {
      throw new ApiError(400, "Invalid role");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        phoneNumber,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(500, "Failed to register user");
    }

    res
      .status(201)
      .json(new ApiReponse(201, "User registered successfully", user));
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: ILoginUser = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      password: true,
    },
  });
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  const cookieOptions: ICookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .cookie("access-token", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .cookie("refresh-token", refreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .status(200)
    .json(
      new ApiReponse(200, "User logged in successfully", {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        accessToken,
        refreshToken,
      }),
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new ApiError(401, "User not found");
  }
  const { id } = req.user;

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: null,
    },
  });

  const cookieOptions: ICookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .clearCookie("access-token", cookieOptions)
    .clearCookie("refresh-token", cookieOptions)
    .status(200)
    .json(new ApiReponse(200, "User logged out successfully", {}));
});

export const createApiKey = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(401, "User not found");
    }
    const { id } = req.user;

    const existingKey = await prisma.apiKey.findFirst({
      where: { userId: id },
    });

    if (existingKey) {
      throw new ApiError(409, "API key already exists");
    }

    const apiKey = generateApiKey();
    if (!apiKey) {
      throw new ApiError(500, "Failed to generate API key");
    }

    const hashedApiKey = hashApiKey(apiKey);

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        apiKey: {
          create: {
            key: hashedApiKey,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      },
    });

    res
      .status(200)
      .json(new ApiReponse(201, "API key created successfully", { apiKey }));
  },
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new ApiError(401, "User not found");
  }
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiReponse(200, "User profile retrieved successfully", user));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token not found");
    }

    const user = verifyToken(refreshToken, "refresh");
    if (!user) {
      throw new ApiError(401, "Refresh token is invalid");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { refreshToken: true },
    });

    if (!existingUser || existingUser.refreshToken !== refreshToken) {
      throw new ApiError(403, "Refresh token mismatch or expired");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    if (!newRefreshToken || !newAccessToken) {
      throw new ApiError(500, "Failed to generate tokens");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    const cookieOptions: ICookiesOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res
      .cookie("access-token", newAccessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .cookie("refresh-token", newRefreshToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json(new ApiReponse(200, "User logged in successfully", null));
  },
);
