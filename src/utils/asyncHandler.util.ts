import type { Request, Response, NextFunction } from "express";

type ExpressRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

const asyncHandler = (requestHandler: ExpressRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err: Error) =>
      next(err),
    );
  };
};

export default asyncHandler;
