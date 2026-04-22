#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 /path/to/backup.sql /path/to/output.sql" >&2
  exit 1
fi

backup_file="$1"
output_file="$2"

if [ ! -f "$backup_file" ]; then
  echo "Backup file not found: $backup_file" >&2
  exit 1
fi

extract_copy_block() {
  local table="$1"
  awk -v table="$table" '
    index($0, "COPY " table " FROM stdin;") == 1 { print; in_block=1; next }
    in_block {
      print
      if ($0 == "\\.") exit
    }
  ' "$backup_file"
}

countries_block="$(extract_copy_block "public.countries (id, country_code, country_slug, name_en, name_ar, timezone)")"
cities_block="$(extract_copy_block "public.cities (id, country_code, city_slug, name_en, name_ar, lat, lon, timezone, population, priority, is_capital)")"

if [ -z "$countries_block" ] || [ -z "$cities_block" ]; then
  echo "Could not find public.countries or public.cities COPY blocks in $backup_file" >&2
  exit 1
fi

cat > "$output_file" <<'SQL'
BEGIN;

TRUNCATE TABLE public.cities, public.countries CASCADE;
SQL

printf '\n%s\n\n' "$countries_block" >> "$output_file"
printf '%s\n\n' "$cities_block" >> "$output_file"

cat >> "$output_file" <<'SQL'
SELECT setval('public.countries_id_seq', COALESCE((SELECT MAX(id) FROM public.countries), 1), true);
SELECT setval('public.cities_id_seq', COALESCE((SELECT MAX(id) FROM public.cities), 1), true);

COMMIT;
SQL

echo "Wrote app-only geo import SQL to $output_file"
