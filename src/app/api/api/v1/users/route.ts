import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "API Users endpoint",
    data: [],
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "User created",
    data: { id: "temp-id", ...body },
    timestamp: new Date().toISOString(),
  });
}
