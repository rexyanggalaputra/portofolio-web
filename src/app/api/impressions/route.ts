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

    const preparedImpression = prepareImpressionForStorage(body.impression);
    const impression = await prisma.clientImpression.create({
      data: {
        displayName: body.displayName,
        roleDivision: body.roleDivision,
        impression: preparedImpression,
        isPositive: isPositiveImpression(preparedImpression),
        ipHash: getClientFingerprint(request),
      },
      select: {
        id: true,
        isPositive: true,
        createdAt: true,
      },
    });

    return json({ ok: true, impression }, { status: 201 });
  } catch (error) {
    return validationError(error);
  }
}
