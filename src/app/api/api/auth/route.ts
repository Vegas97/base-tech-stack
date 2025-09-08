import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "Authentication endpoint",
    data: { 
      token: "temp-token",
      user: { id: "temp-user-id", email: body.email }
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Auth status endpoint",
    data: { authenticated: false },
    timestamp: new Date().toISOString(),
  });
}
