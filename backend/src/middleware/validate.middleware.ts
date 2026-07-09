import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

/**
 * Validates and *replaces* the given request part with the parsed/coerced
 * output of the schema, so downstream handlers only ever see clean, typed
 * data. Throws ZodError on failure, caught by errorHandlerMiddleware.
 */
export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req[part] = schema.parse(req[part]);
    next();
  };
}
