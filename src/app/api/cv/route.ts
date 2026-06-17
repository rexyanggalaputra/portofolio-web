import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { json } from "@/lib/server/request";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      cvUrl: true,
    },
  });

  if (!profile?.cvUrl) {
    return json({ error: "CV not found" }, { status: 404 });
  }

  return NextResponse.redirect(profile.cvUrl);
}
