#!/usr/bin/env bash
set -Eeuo pipefail

PORT="${PORT:-3217}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="${TMPDIR:-/tmp}/miqatona-date-cache-smoke-${PORT}.log"
BEFORE_FILE="${TMPDIR:-/tmp}/miqatona-date-cache-before-${PORT}.txt"
AFTER_FILE="${TMPDIR:-/tmp}/miqatona-date-cache-after-${PORT}.txt"

npm run start -- --hostname 127.0.0.1 --port "${PORT}" >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" 2>/dev/null || true
  wait "${SERVER_PID}" 2>/dev/null || true
}
trap cleanup EXIT

ready=0
for attempt in $(seq 1 60); do
  if curl --silent --show-error --output /dev/null --max-time 2 "${BASE_URL}/robots.txt"; then
    ready=1
    break
  fi
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    cat "${LOG_FILE}"
    echo "Next.js server exited before becoming ready." >&2
    exit 1
  fi
  sleep 2
done

if [[ "${ready}" != "1" ]]; then
  cat "${LOG_FILE}"
  echo "Next.js server did not become ready." >&2
  exit 1
fi

# Capture the built date-route output before visiting previously unrequested params.
find .next/server/app -type f -path '*/date/*' -print 2>/dev/null | sort > "${BEFORE_FILE}"

curl --fail --silent --show-error --max-time 90 "${BASE_URL}/date/2036/12/31" -o /tmp/miqatona-gregorian-date-smoke.html
curl --fail --silent --show-error --max-time 90 "${BASE_URL}/date/hijri/1448/01/01" -o /tmp/miqatona-hijri-date-smoke.html

grep -qi '<title' /tmp/miqatona-gregorian-date-smoke.html
grep -qi '<title' /tmp/miqatona-hijri-date-smoke.html

# With cacheComponents enabled but no generateStaticParams on these routes,
# request-specific date pages must not be added to the persistent .next/server output.
find .next/server/app -type f -path '*/date/*' -print 2>/dev/null | sort > "${AFTER_FILE}"
new_files="$(comm -13 "${BEFORE_FILE}" "${AFTER_FILE}")"

if [[ -n "${new_files}" ]]; then
  echo "FAIL: visiting dynamic date routes created persistent route files:" >&2
  printf '%s\n' "${new_files}" >&2
  echo "Server log:" >&2
  cat "${LOG_FILE}" >&2
  exit 1
fi

echo "PASS: Gregorian and Hijri date routes returned HTML without adding persistent .next/server date-route files."
