import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["fan", "organizer", "volunteer", "security"],
      default: "fan",
    },
  },
  { timestamps: true }
);

// passwordHash is deliberately excluded from the default JSON shape so it
// can never leak into an API response even if a route forgets to strip it.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const safeRet = ret as typeof ret & { passwordHash?: string };
    Reflect.deleteProperty(safeRet, "passwordHash");
    return safeRet;
  },
});

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
