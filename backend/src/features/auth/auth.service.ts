import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../middleware/errorHandler.middleware.js";
import { UserModel } from "../../models/User.model.js";
import type { LoginRequest, RegisterRequest } from "./auth.schema.js";

const SALT_ROUNDS = 12;

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "fan" | "organizer" | "volunteer" | "security";
  };
}

function signToken(userId: string, role: string): string {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export async function registerUser(input: RegisterRequest): Promise<AuthResult> {
  const existing = await UserModel.findOne({ email: input.email }).lean();
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
  });

  return {
    token: signToken(user.id, user.role),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function loginUser(input: LoginRequest): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: input.email });

  // Same error for "no such user" and "wrong password" so the API never
  // reveals which emails are registered (a standard auth-enumeration guard).
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: signToken(user.id, user.role),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
