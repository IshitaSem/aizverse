import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorWithStatus = Error & { status?: number; statusCode?: number };

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handler. Never leaks stack traces or internal error
 * detail to clients in production; always logs full detail server-side.
 */
export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const isProd = process.env.NODE_ENV === "production";

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Request failed validation",
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      req.log?.error({ err }, "Non-operational AppError");
    }
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  const status = (err as ErrorWithStatus).status ?? (err as ErrorWithStatus).statusCode ?? 500;
  const isPayloadTooLarge = status === 413 || (err as Error).name === "PayloadTooLargeError";

  if (isPayloadTooLarge) {
    res.status(413).json({
      error: "PayloadTooLarge",
      message: "Request payload is too large",
    });
    return;
  }

  req.log?.error({ err }, "Unhandled error");

  res.status(status).json({
    error: "InternalServerError",
    message: isProd ? "Something went wrong. Please try again." : (err as Error).message,
  });
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ error: "NotFound", message: `Route ${req.method} ${req.path} not found` });
}
