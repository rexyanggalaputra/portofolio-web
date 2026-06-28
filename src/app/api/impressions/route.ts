import { impressionSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { isPositiveImpression, pickDailyItems, prepareImpressionForStorage } from "@/lib/server/impressions";
import { assertRateLimit, getClientFingerprint, json, validationError } from "@/lib/server/request";

export async function GET() {
  const items = await prisma.clientImpression.findMany({
    where: { isVisible: true, isPositive: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
  });

  return json({ impressions: pickDailyItems(items, 10) });
}

export async function POST(request: Request) {
  try {
    const body = impressionSchema.parse(await request.json());

    if (body._honeypot) {
      return json({ ok: true });
    }

    const rateLimit = await assertRateLimit({
      request,
      action: "impression:create",
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimit.response;
    }

    const originalImpression = body.impression;
    const preparedImpression = prepareImpressionForStorage(originalImpression);
    const createdImpression = await prisma.clientImpression.create({
      data: {
        displayName: body.displayName,
        roleDivision: body.roleDivision,
        impression: preparedImpression,
        originalImpression,
        isPositive: isPositiveImpression(preparedImpression),
        ipHash: getClientFingerprint(request),
      },
      select: {
        id: true,
      },
    });

    await prisma.$executeRaw`
      UPDATE "ClientImpression"
      SET "originalImpression" = ${originalImpression}
      WHERE "id" = ${createdImpression.id}
    `;

    const impression = await prisma.clientImpression.findUniqueOrThrow({
      where: { id: createdImpression.id },
      select: {
        id: true,
        isPositive: true,
        originalImpression: true,
        createdAt: true,
      },
    });

    return json({ ok: true, impression }, { status: 201 });
  } catch (error) {
    return validationError(error);
  }
}
