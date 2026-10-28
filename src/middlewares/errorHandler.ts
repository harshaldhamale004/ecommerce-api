import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route ${req.url} not found` });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // MSSQL unique constraint violation
  if (err.number === 2627 || err.number === 2601) {
    return res.status(409).json({ success: false, error: "Duplicate value, record already exists" });
  }
  const status = err instanceof AppError ? err.statusCode : 500;
  res.status(status).json({ success: false, error: err.message || "Server error" });
};