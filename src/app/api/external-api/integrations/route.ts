import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "External API Integrations endpoint",
    data: { integrations: [] },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "Integration created",
    data: { 
      integrationId: "temp-integration-id",
      status: "active",
      config: body
    },
    timestamp: new Date().toISOString(),
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "Integration updated",
    data: { 
      integrationId: body.id,
      status: "updated",
      config: body
    },
    timestamp: new Date().toISOString(),
  });
}
