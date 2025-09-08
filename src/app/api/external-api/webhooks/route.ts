import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "Webhook received",
    data: { 
      webhookId: "temp-webhook-id",
      processed: true,
      payload: body
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "External API Webhooks endpoint",
    data: { webhooks: [] },
    timestamp: new Date().toISOString(),
  });
}
