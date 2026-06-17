import { visitSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { assertRateLimit, detectDevice, json, validationError } from "@/lib/server/request";

export async function POST(request: Request) {
  try {
    const body = visitSchema.parse(await request.json());
    const rateLimit = await assertRateLimit({
      request,
      action: "analytics:visit",
      limit: 120,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimit.response;
    }

    const session = await prisma.visitSession.create({
      data: {
        visitorId: body.visitorId,
        path: body.path,
        referrer: body.referrer || null,
        device: detectDevice(request.headers.get("user-agent")),
        country: request.headers.get("x-vercel-ip-country") ?? null,
      },
      select: {
        id: true,
      },
    });

    return json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    return validationError(error);
  }
}
