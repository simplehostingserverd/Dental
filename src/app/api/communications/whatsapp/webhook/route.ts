import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/communications/whatsapp";

// GET /api/communications/whatsapp/webhook - Webhook verification
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

    if (mode === "subscribe" && token === verifyToken) {
      console.log("WhatsApp webhook verified successfully");
      return new NextResponse(challenge, { status: 200 });
    } else {
      console.log("WhatsApp webhook verification failed");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error verifying WhatsApp webhook:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 500 }
    );
  }
}

// POST /api/communications/whatsapp/webhook - Receive WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the webhook signature (optional but recommended)
    const signature = request.headers.get("x-hub-signature-256");
    if (signature && process.env.WHATSAPP_WEBHOOK_SECRET) {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
      
      if (`sha256=${expectedSignature}` !== signature) {
        console.log("WhatsApp webhook signature verification failed");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Process the incoming message
    await whatsappService.processIncomingMessage(body);

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    
    // Still return 200 to avoid webhook retries
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
