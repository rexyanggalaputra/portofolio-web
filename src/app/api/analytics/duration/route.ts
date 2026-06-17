import { durationSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { assertRateLimit, json, validationError } from "@/lib/server/request";

export async function POST(request: Request) {
  try {
    const body = durationSchema.parse(await request.json());
    const rateLimit = await assertRateLimit({
      request,
      action: "analytics:duration",
      limit: 600,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimit.response;
    }

    const existing = await prisma.visitSession.findUnique({
      where: {
        id: body.sessionId,
      },
      select: {
        durationMs: true,
      },
    });

    if (!existing) {
      return json({ error: "Visit session not found" }, { status: 404 });
    }

    await prisma.visitSession.update({
      where: {
        id: body.sessionId,
      },
      data: {
        durationMs: Math.max(existing.durationMs, body.durationMs),
      },
      select: {
        id: true,
      },
    });

    return json({ ok: true });
  } catch (error) {
    return validationError(error);
  }
}
