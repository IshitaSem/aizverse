import { z } from "zod";

export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const routeRequestSchema = z.object({
  stadiumId: z.string().min(1).max(64),
  origin: coordinateSchema,
  destination: z.object({
    label: z.string().min(1).max(120),
    coordinates: coordinateSchema,
  }),
  routeType: z.enum(["fastest", "accessible", "least_crowded"]).default("fastest"),
  language: z.enum(["en", "es", "fr", "ar", "hi", "pt"]).default("en"),
});

export type RouteRequest = z.infer<typeof routeRequestSchema>;

export const routeStepSchema = z.object({
  instruction: z.string(),
  distanceMeters: z.number().nonnegative(),
  landmark: z.string().optional(),
});

export type RouteStep = z.infer<typeof routeStepSchema>;
