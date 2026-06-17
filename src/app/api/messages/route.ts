import { messageSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { assertRateLimit, getClientFingerprint, json, validationError } from "@/lib/server/request";

export async function POST(request: Request) {
  try {
    const body = messageSchema.parse(await request.json());

    if (body._honeypot) {
      return json({ ok: true });
    }

    const rateLimit = await assertRateLimit({
      request,
      action: "message:create",
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimit.response;
    }

    const message = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email || null,
        content: body.content,
        ipHash: getClientFingerprint(request),
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return json({ ok: true, message }, { status: 201 });
  } catch (error) {
    return validationError(error);
  }
}
