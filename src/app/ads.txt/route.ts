import { getServerAdsConfig } from '@/lib/runtime-config';

function getAdsTxtLines() {
  const publisherId = getServerAdsConfig().clientId?.replace(/^ca-/, '') || null;
  const extraLines = String(process.env.ADS_TXT_EXTRA_LINES || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const lines = [];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }

  lines.push(...extraLines);

  if (lines.length === 0) {
    lines.push("# Configure ADSENSE_CLIENT_ID to publish ads.txt.");
  }

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
