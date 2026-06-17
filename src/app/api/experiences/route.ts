import { cursorQuerySchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { json, validationError } from "@/lib/server/request";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = cursorQuerySchema.parse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    const limit = query.limit ?? 3;

    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }, { id: "asc" }],
      take: limit + 1,
      ...(query.cursor
        ? {
            cursor: {
              id: query.cursor,
            },
            skip: 1,
          }
        : {}),
    });

    const hasMore = experiences.length > limit;
    const items = hasMore ? experiences.slice(0, limit) : experiences;

    return json({
      experiences: items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    return validationError(error);
  }
}
