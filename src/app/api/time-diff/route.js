import { NextResponse } from 'next/server';
import { getTimeDifference } from '@/lib/time-diff';

export async function POST(req) {
  try {
    const body = await req.json();
    const { from, to, dateTime } = body;

    if (!from || !to) {
      return NextResponse.json({ error: "Missing 'from' or 'to' parameters." }, { status: 400 });
    }

    const targetDate = dateTime ? new Date(dateTime) : new Date();

    const result = getTimeDifference(from, to, targetDate);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Server should provide aggressive stale-while-revalidate for APIs caching
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
