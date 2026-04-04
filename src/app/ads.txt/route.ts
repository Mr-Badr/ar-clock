function normalizePublisherId(rawValue: string | undefined) {
  const trimmed = String(rawValue || "").trim();
  if (!trimmed.startsWith("ca-pub-")) return null;
  return trimmed.replace(/^ca-/, "");
}

function getAdsTxtLines() {
  const publisherId =
    normalizePublisherId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)
    || normalizePublisherId(process.env.ADSENSE_CLIENT_ID);
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
    lines.push("# Configure NEXT_PUBLIC_ADSENSE_CLIENT_ID or ADSENSE_CLIENT_ID to publish ads.txt.");
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
