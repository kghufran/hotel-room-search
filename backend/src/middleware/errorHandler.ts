import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
