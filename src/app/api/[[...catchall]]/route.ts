import { NextRequest, NextResponse } from 'next/server';

// Catch-all route for API 404s - returns JSON instead of HTML
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Not Found", 
      message: "The requested API endpoint does not exist",
      path: request.nextUrl.pathname
    }, 
    { status: 404 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Not Found", 
      message: "The requested API endpoint does not exist",
      path: request.nextUrl.pathname
    }, 
    { status: 404 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Not Found", 
      message: "The requested API endpoint does not exist",
      path: request.nextUrl.pathname
    }, 
    { status: 404 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Not Found", 
      message: "The requested API endpoint does not exist",
      path: request.nextUrl.pathname
    }, 
    { status: 404 }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Not Found", 
      message: "The requested API endpoint does not exist",
      path: request.nextUrl.pathname
    }, 
    { status: 404 }
  );
}
