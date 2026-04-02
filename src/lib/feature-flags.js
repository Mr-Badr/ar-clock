const truthy = new Set(['1', 'true', 'yes', 'on']);

function flag(value, fallback = false) {
  if (!value) return fallback;
  return truthy.has(value.toLowerCase());
}

export const featureFlags = {
  holidaysNewMetadataPipeline: flag(process.env.FF_HOLIDAYS_NEW_METADATA, true),
  holidaysNewContentResolver: flag(process.env.FF_HOLIDAYS_CONTENT_RESOLVER, true),
  holidaysSectionizedUi: flag(process.env.FF_HOLIDAYS_SECTIONIZED_UI, false),
  seoStrictCleanup: flag(process.env.FF_SEO_STRICT_CLEANUP, true),
  observabilityLogs: flag(process.env.FF_OBSERVABILITY_LOGS, false),
  eventsShardIndex: flag(process.env.FF_EVENTS_SHARD_INDEX, true),
  eventsPublishedOnly: flag(process.env.FF_EVENTS_PUBLISHED_ONLY, true),
};
