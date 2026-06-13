import { getAdsensePublisherId } from '@/lib/ads/account';

function getAdsTxtLines() {
  const publisherId = getAdsensePublisherId();
  const extraLines = String(process.env.ADS_TXT_EXTRA_LINES || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const lines = [];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }

  lines.push(...extraLines);

  return lines;
}

export function GET() {
  return new Response(`${getAdsTxtLines().join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
