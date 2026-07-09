import { Schema, model, type InferSchemaType } from "mongoose";

const crowdReadingSchema = new Schema(
  {
    stadiumId: { type: String, required: true, index: true },
    zoneId: { type: String, required: true },
    zoneLabel: { type: String, required: true },
    densityPercent: { type: Number, required: true, min: 0, max: 100 },
    capacity: { type: Number, required: true, min: 0 },
    currentCount: { type: Number, required: true, min: 0 },
    recordedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true }
);

crowdReadingSchema.index({ stadiumId: 1, recordedAt: -1 });

export type CrowdReadingDocument = InferSchemaType<typeof crowdReadingSchema>;
export const CrowdReadingModel = model("CrowdReading", crowdReadingSchema);
