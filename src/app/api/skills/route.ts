import { prisma } from "@/lib/server/prisma";
import { json } from "@/lib/server/request";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });

  return json({ skills });
}
