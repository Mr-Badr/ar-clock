import { NextResponse } from 'next/server';

// /fahras itself was retired 2026-08-09 (owner directive — the discovery/directory page had
// no real traffic). This legacy /map redirect now goes straight to the homepage.
export function GET(request: Request): NextResponse {
  return NextResponse.redirect(new URL('/', request.url), 308);
}
