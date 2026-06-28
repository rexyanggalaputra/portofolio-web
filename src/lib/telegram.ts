const TELEGRAM_SEND_TIMEOUT_MS = 5000;
const TELEGRAM_MAX_RETRIES = 2;

function getTelegramEnv() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.");
    return null;
  }

  return { botToken, chatId };
}

async function postTelegramMessage({
  botToken,
  chatId,
  message,
}: {
  botToken: string;
  chatId: string;
  message: string;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_SEND_TIMEOUT_MS);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(`Telegram API responded with ${response.status}${details ? `: ${details}` : ""}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendTelegramMessage(message: string): Promise<void> {
  const env = getTelegramEnv();
  if (!env) return;

  for (let attempt = 0; attempt <= TELEGRAM_MAX_RETRIES; attempt += 1) {
    try {
      await postTelegramMessage({ ...env, message });
      return;
    } catch (error) {
      const isFinalAttempt = attempt === TELEGRAM_MAX_RETRIES;

      if (isFinalAttempt) {
        console.error("Telegram notification failed after retries.", error);
        return;
      }

      console.warn(`Telegram notification attempt ${attempt + 1} failed. Retrying...`, error);
    }
  }
}
