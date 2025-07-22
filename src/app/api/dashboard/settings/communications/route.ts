import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { db } from "@/server/db";
import { z } from "zod";

// Validation schema for communication settings
const CommunicationSettingsSchema = z.object({
  whatsapp: z.object({
    accessToken: z.string(),
    phoneNumberId: z.string(),
    webhookVerifyToken: z.string(),
    webhookSecret: z.string(),
    enabled: z.boolean(),
  }),
  telegram: z.object({
    botToken: z.string(),
    webhookSecret: z.string(),
    enabled: z.boolean(),
  }),
  signal: z.object({
    phoneNumber: z.string(),
    apiUrl: z.string(),
    enabled: z.boolean(),
  }),
});

// GET /api/dashboard/settings/communications - Get communication settings
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the practice user record
    const practiceUser = await db.practiceUser.findFirst({
      where: { email: user.email },
      include: { practice: true },
    });

    if (!practiceUser) {
      return NextResponse.json(
        { error: "Practice user record not found" },
        { status: 404 }
      );
    }

    // Get communication settings for the practice
    const communicationSettings = await db.communicationSettings.findFirst({
      where: { practiceId: practiceUser.practiceId },
    });

    let settings = {
      whatsapp: {
        accessToken: "",
        phoneNumberId: "",
        webhookVerifyToken: "",
        webhookSecret: "",
        enabled: false,
      },
      telegram: {
        botToken: "",
        webhookSecret: "",
        enabled: false,
      },
      signal: {
        phoneNumber: "",
        apiUrl: "http://localhost:8080",
        enabled: false,
      },
    };

    if (communicationSettings) {
      try {
        const parsedSettings = JSON.parse(communicationSettings.settings);
        settings = { ...settings, ...parsedSettings };
      } catch (error) {
        console.error("Error parsing communication settings:", error);
      }
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching communication settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/settings/communications - Save communication settings
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.type !== "practice") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CommunicationSettingsSchema.parse(body);

    // Find the practice user record
    const practiceUser = await db.practiceUser.findFirst({
      where: { email: user.email },
      include: { practice: true },
    });

    if (!practiceUser) {
      return NextResponse.json(
        { error: "Practice user record not found" },
        { status: 404 }
      );
    }

    // Save or update communication settings
    await db.communicationSettings.upsert({
      where: { practiceId: practiceUser.practiceId },
      update: {
        settings: JSON.stringify(validatedData),
        updatedAt: new Date(),
      },
      create: {
        practiceId: practiceUser.practiceId,
        settings: JSON.stringify(validatedData),
      },
    });

    // Update environment variables dynamically for the current session
    if (validatedData.whatsapp.enabled) {
      process.env.WHATSAPP_ACCESS_TOKEN = validatedData.whatsapp.accessToken;
      process.env.WHATSAPP_PHONE_NUMBER_ID = validatedData.whatsapp.phoneNumberId;
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = validatedData.whatsapp.webhookVerifyToken;
      process.env.WHATSAPP_WEBHOOK_SECRET = validatedData.whatsapp.webhookSecret;
    }

    if (validatedData.telegram.enabled) {
      process.env.TELEGRAM_BOT_TOKEN = validatedData.telegram.botToken;
      process.env.TELEGRAM_WEBHOOK_SECRET = validatedData.telegram.webhookSecret;
    }

    if (validatedData.signal.enabled) {
      process.env.SIGNAL_NUMBER = validatedData.signal.phoneNumber;
      process.env.SIGNAL_CLI_REST_API_URL = validatedData.signal.apiUrl;
    }

    return NextResponse.json({
      success: true,
      message: "Communication settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving communication settings:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
