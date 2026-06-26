import { impressionSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { assertRateLimit, getClientFingerprint, json, validationError } from "@/lib/server/request";

const positiveKeywords = [
  "good",
  "great",
  "excellent",
  "amazing",
  "helpful",
  "clear",
  "patient",
  "insightful",
  "reliable",
  "valuable",
  "positive",
  "recommended",
  "impressive",
  "useful",
  "supportive",
  "professional",
  "bagus",
  "baik",
  "keren",
  "mantap",
  "jelas",
  "sabar",
  "membantu",
  "informatif",
  "rapi",
  "responsif",
  "recommended",
];

const negativeKeywords = ["bad", "poor", "confusing", "late", "slow", "unclear", "buruk", "jelek", "bingung", "kurang", "lama"];

export async function GET() {
  const items = await prisma.clientImpression.findMany({
    where: { isVisible: true, isPositive: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 50,
  });

  const shuffled = items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .slice(0, 10)
    .map(({ item }) => item);

  return json({ impressions: shuffled });
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

    const impression = await prisma.clientImpression.create({
      data: {
        displayName: body.displayName,
        roleDivision: body.roleDivision,
        impression: body.impression,
        isPositive: isPositiveImpression(body.impression),
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

function isPositiveImpression(value: string) {
  const normalized = value.toLowerCase();
  const positiveScore = positiveKeywords.reduce((score, keyword) => score + Number(normalized.includes(keyword)), 0);
  const negativeScore = negativeKeywords.reduce((score, keyword) => score + Number(normalized.includes(keyword)), 0);

  return positiveScore > 0 && positiveScore >= negativeScore;
}
