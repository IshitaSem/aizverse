import type { Request, Response } from "express";
import { generateRoute } from "./navigation.service.js";
import type { RouteRequest } from "./navigation.schema.js";

export async function postRoute(req: Request, res: Response): Promise<void> {
  const input = req.body as RouteRequest;
  const result = await generateRoute(input);
  res.status(200).json(result);
}
