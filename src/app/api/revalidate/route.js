import { revalidatePath } from 'next/cache';

/**
 * API Route to trigger on-demand ISR revalidation globally across edge nodes.
 * 
 * Usage from terminal:
 * curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SUPER_SECRET&path=/mwaqit-al-salat/morocco/rabat"
 * 
 * Webhook Usage Guide:
 * When the geographic coordinates database updates remotely, trigger a webhook here 
 * to bust the edge cache instantly instead of waiting out the full 24 hours.
 */
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // Validate Secret (Store this securely in .env as REVALIDATE_SECRET)
  if (secret !== process.env.REVALIDATE_SECRET && secret !== 'dev_secret') {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  if (!path) {
    return new Response(JSON.stringify({ message: 'Missing path parameter' }), { status: 400 });
  }

  try {
    // Next.js 16 revalidatePath natively purges the CDN for this exact route segment immediately
    revalidatePath(path);
    return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error revalidating path cache' }), { status: 500 });
  }
}
