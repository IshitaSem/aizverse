import type { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";
import type { LoginRequest, RegisterRequest } from "./auth.schema.js";

export async function postRegister(req: Request, res: Response): Promise<void> {
  const result = await registerUser(req.body as RegisterRequest);
  res.status(201).json(result);
}

export async function postLogin(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body as LoginRequest);
  res.status(200).json(result);
}
