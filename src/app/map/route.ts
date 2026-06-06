import { NextResponse } from 'next/server';

export function GET(request: Request): NextResponse {
  return NextResponse.redirect(new URL('/fahras', request.url), 308);
}
