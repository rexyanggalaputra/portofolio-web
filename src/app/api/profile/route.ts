import { prisma } from "@/lib/server/prisma";
import { json } from "@/lib/server/request";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!profile) {
    return json({ error: "Profile not found" }, { status: 404 });
  }

  return json({ profile });
}
