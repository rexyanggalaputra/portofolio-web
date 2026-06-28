import { messageSchema } from "@/lib/server/schemas";
import { prisma } from "@/lib/server/prisma";
import { assertRateLimit, getClientFingerprint, json, validationError } from "@/lib/server/request";
import { sendTelegramMessage } from "@/lib/telegram";

function formatIndonesiaTime(date: Date) {
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date).replace(".", ":")} WIB`;
}

function formatTelegramMessage(message: { name: string; email: string | null; content: string; createdAt: Date }) {
  return `📩 New Portfolio Message

👤 Pengirim:
${message.name}

📧 Email:
${message.email || "-"}

💬 Isi Pesan:
${message.content}

🕒 Waktu Masuk:
${formatIndonesiaTime(message.createdAt)}

📌 Source:
Portfolio Contact Form`;
}

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
        name: true,
        email: true,
        content: true,
        createdAt: true,
      },
    });

    await sendTelegramMessage(formatTelegramMessage(message));

    return json({ ok: true, message: { id: message.id, createdAt: message.createdAt } }, { status: 201 });
  } catch (error) {
    return validationError(error);
  }
}
