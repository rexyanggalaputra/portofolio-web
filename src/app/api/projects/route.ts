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
    const limit = query.limit ?? 6;

    const projects = await prisma.project.findMany({
      where: {
        isVisible: true,
      },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }, { id: "asc" }],
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

    const hasMore = projects.length > limit;
    const items = hasMore ? projects.slice(0, limit) : projects;

    return json({
      projects: items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    return validationError(error);
  }
}
