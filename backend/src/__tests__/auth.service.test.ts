import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// UserModel is mocked at the module level so these stay true unit tests —
// no live MongoDB connection required, matching the pattern used by the
// other feature service tests in this suite.
vi.mock("../models/User.model.js", () => ({
  UserModel: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

const { UserModel } = await import("../models/User.model.js");
const { registerUser, loginUser } = await import("../features/auth/auth.service.js");

describe("registerUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws a 409 AppError when the email is already registered", async () => {
    vi.mocked(UserModel.findOne).mockReturnValue({ lean: () => Promise.resolve({ _id: "1" }) } as any);

    await expect(
      registerUser({ name: "Ana", email: "ana@example.com", password: "password123", role: "fan" })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("hashes the password before storing the user (never stores plaintext)", async () => {
    vi.mocked(UserModel.findOne).mockReturnValue({ lean: () => Promise.resolve(null) } as any);
    let storedHash = "";
    vi.mocked(UserModel.create).mockImplementation(((doc: any) => {
      storedHash = doc.passwordHash;
      return Promise.resolve({ id: "u1", name: doc.name, email: doc.email, role: doc.role });
    }) as any);

    await registerUser({ name: "Ana", email: "ana@example.com", password: "password123", role: "fan" });

    expect(storedHash).not.toBe("password123");
    expect(await bcrypt.compare("password123", storedHash)).toBe(true);
  });

  it("returns a token and the public user shape (no passwordHash)", async () => {
    vi.mocked(UserModel.findOne).mockReturnValue({ lean: () => Promise.resolve(null) } as any);
    vi.mocked(UserModel.create).mockImplementation(((doc: any) =>
      Promise.resolve({ id: "u1", name: doc.name, email: doc.email, role: doc.role })) as any);

    const result = await registerUser({ name: "Ana", email: "ana@example.com", password: "password123", role: "organizer" });

    expect(result.token).toEqual(expect.any(String));
    expect(result.user).toEqual({ id: "u1", name: "Ana", email: "ana@example.com", role: "organizer" });
    expect(result.user).not.toHaveProperty("passwordHash");
  });
});

describe("loginUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects with 401 when no user matches the email", async () => {
    vi.mocked(UserModel.findOne).mockResolvedValue(null as any);

    await expect(loginUser({ email: "nobody@example.com", password: "whatever" })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("rejects with 401 when the password doesn't match — same error as unknown email", async () => {
    const hash = await bcrypt.hash("correct-password", 4);
    vi.mocked(UserModel.findOne).mockResolvedValue({
      id: "u1",
      name: "Ana",
      email: "ana@example.com",
      role: "fan",
      passwordHash: hash,
    } as any);

    await expect(loginUser({ email: "ana@example.com", password: "wrong-password" })).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });

  it("returns a token on valid credentials", async () => {
    const hash = await bcrypt.hash("correct-password", 4);
    vi.mocked(UserModel.findOne).mockResolvedValue({
      id: "u1",
      name: "Ana",
      email: "ana@example.com",
      role: "security",
      passwordHash: hash,
    } as any);

    const result = await loginUser({ email: "ana@example.com", password: "correct-password" });
    expect(result.token).toEqual(expect.any(String));
    expect(result.user.role).toBe("security");
  });
});
