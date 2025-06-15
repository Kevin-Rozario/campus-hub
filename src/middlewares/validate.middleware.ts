import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import ApiError from "../utils/apiError.util.js";

export const validationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");
      return next(new ApiError(400, `Validation error: ${errorMessage}`));
    }

    req.body = result.data;

    next();
  };
};
