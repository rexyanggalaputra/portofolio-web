import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/server/prisma";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function validationError(error: unknown) {
  if (error instanceof ZodError) {
    return json(
      {
        error: "Validation failed",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  return json({ error: "Invalid request" }, { status: 400 });
}

export function getClientFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const raw = `${forwardedFor ?? realIp ?? "unknown"}:${userAgent}`;

  return hashValue(raw);
}

export function hashValue(value: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? "portfolio-local-dev-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function detectDevice(userAgent: string | null) {
  const value = userAgent?.toLowerCase() ?? "";
  if (/ipad|tablet/.test(value)) return "tablet";
  if (/mobile|android|iphone|ipod/.test(value)) return "mobile";
  return "desktop";
}

export async function assertRateLimit({
  request,
  action,
  limit,
  windowMs,
}: {
  request: Request;
  action: string;
  limit: number;
  windowMs: number;
}) {
  const key = getClientFingerprint(request);
  const since = new Date(Date.now() - windowMs);

  const count = await prisma.rateLimitEvent.count({
    where: {
      key,
      action,
      createdAt: {
        gte: since,
      },
    },
  });

  if (count >= limit) {
    return {
      limited: true,
      response: json({ error: "Too many requests. Please try again later." }, { status: 429 }),
    };
  }

  await prisma.rateLimitEvent.create({
    data: {
      key,
      action,
    },
  });

  return { limited: false, key };
}

export function parseLimit(value: string | null, fallback: number, max: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
}
