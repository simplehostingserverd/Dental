import { NextRequest, NextResponse } from "next/server";
import { telegramService } from "@/lib/communications/telegram";

// POST /api/communications/telegram/webhook - Receive Telegram updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the request is from Telegram (optional but recommended)
    const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
    if (secretToken && process.env.TELEGRAM_WEBHOOK_SECRET) {
      if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
        console.log("Telegram webhook secret verification failed");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Process the incoming update
    await telegramService.processUpdate(body);

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    
    // Still return 200 to avoid webhook retries
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
