import { prisma } from "@/lib/server/prisma";
import { json } from "@/lib/server/request";

export async function GET() {
  const faqs = await prisma.faq.findMany({
    where: {
      isVisible: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return json({ faqs });
}
