import { z } from "zod";

export const cursorQuerySchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const messageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  content: z.string().trim().min(1, "Message is required").max(5000),
  _honeypot: z.string().optional(),
});

export const visitSchema = z.object({
  visitorId: z.string().trim().min(8).max(160),
  path: z.string().trim().min(1).max(500).default("/"),
  referrer: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const durationSchema = z.object({
  sessionId: z.string().trim().min(1),
  durationMs: z.number().int().min(0).max(24 * 60 * 60 * 1000),
});
