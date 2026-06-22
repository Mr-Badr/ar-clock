/**
 * sitemapPairs.js
 * Extended list of time-difference city pairs for sitemap coverage.
 * These are all verified 200 responses and target high-volume Arabic search queries.
 * POPULAR_PAIRS (the top 12) are handled separately in popularPairs.js for hub display.
 */

export const SITEMAP_PAIRS = [
  // Gulf: Saudi Arabia hub
  { from: 'saudi-arabia-riyadh', to: 'bahrain-manama' },
  { from: 'saudi-arabia-riyadh', to: 'qatar-doha' },
  { from: 'saudi-arabia-riyadh', to: 'oman-muscat' },
  { from: 'saudi-arabia-riyadh', to: 'lebanon-beirut' },
  { from: 'saudi-arabia-riyadh', to: 'turkey-istanbul' },
  { from: 'saudi-arabia-riyadh', to: 'germany-berlin' },
  { from: 'saudi-arabia-riyadh', to: 'pakistan-karachi' },
  { from: 'saudi-arabia-riyadh', to: 'india-new-delhi' },
  { from: 'saudi-arabia-riyadh', to: 'malaysia-kuala-lumpur' },
  { from: 'saudi-arabia-riyadh', to: 'indonesia-jakarta' },
  { from: 'saudi-arabia-riyadh', to: 'united-states-los-angeles' },
  { from: 'saudi-arabia-riyadh', to: 'united-states-chicago' },
  { from: 'saudi-arabia-riyadh', to: 'canada-toronto' },
  { from: 'saudi-arabia-riyadh', to: 'syria-damascus' },
  { from: 'saudi-arabia-riyadh', to: 'iraq-baghdad' },

  // Gulf: UAE hub
  { from: 'united-arab-emirates-dubai', to: 'saudi-arabia-riyadh' },
  { from: 'united-arab-emirates-dubai', to: 'india-new-delhi' },
  { from: 'united-arab-emirates-dubai', to: 'pakistan-karachi' },
  { from: 'united-arab-emirates-dubai', to: 'united-kingdom-london' },
  { from: 'united-arab-emirates-dubai', to: 'united-states-new-york-city' },
  { from: 'united-arab-emirates-dubai', to: 'germany-berlin' },
  { from: 'united-arab-emirates-dubai', to: 'malaysia-kuala-lumpur' },
  { from: 'united-arab-emirates-dubai', to: 'indonesia-jakarta' },
  { from: 'united-arab-emirates-dubai', to: 'egypt-cairo' },
  { from: 'united-arab-emirates-dubai', to: 'turkey-istanbul' },
  { from: 'united-arab-emirates-dubai', to: 'france-paris' },
  { from: 'united-arab-emirates-dubai', to: 'jordan-amman' },
  { from: 'united-arab-emirates-dubai', to: 'lebanon-beirut' },
  { from: 'united-arab-emirates-dubai', to: 'morocco-rabat' },
  { from: 'united-arab-emirates-dubai', to: 'qatar-doha' },
  { from: 'united-arab-emirates-dubai', to: 'bahrain-manama' },
  { from: 'united-arab-emirates-dubai', to: 'oman-muscat' },
  { from: 'united-arab-emirates-dubai', to: 'kuwait-kuwait-city' },
  { from: 'united-arab-emirates-dubai', to: 'iraq-baghdad' },

  // Egypt hub
  { from: 'egypt-cairo', to: 'saudi-arabia-riyadh' },
  { from: 'egypt-cairo', to: 'united-kingdom-london' },
  { from: 'egypt-cairo', to: 'france-paris' },
  { from: 'egypt-cairo', to: 'germany-berlin' },
  { from: 'egypt-cairo', to: 'united-states-new-york-city' },
  { from: 'egypt-cairo', to: 'turkey-istanbul' },
  { from: 'egypt-cairo', to: 'jordan-amman' },
  { from: 'egypt-cairo', to: 'iraq-baghdad' },
  { from: 'egypt-cairo', to: 'libya-tripoli' },
  { from: 'egypt-cairo', to: 'bahrain-manama' },
  { from: 'egypt-cairo', to: 'qatar-doha' },
  { from: 'egypt-cairo', to: 'oman-muscat' },
  { from: 'egypt-cairo', to: 'kuwait-kuwait-city' },
  { from: 'egypt-cairo', to: 'lebanon-beirut' },
  { from: 'egypt-cairo', to: 'united-arab-emirates-dubai' },

  // Gulf mini-hubs
  { from: 'kuwait-kuwait-city', to: 'united-arab-emirates-dubai' },
  { from: 'kuwait-kuwait-city', to: 'egypt-cairo' },
  { from: 'kuwait-kuwait-city', to: 'india-new-delhi' },
  { from: 'kuwait-kuwait-city', to: 'united-kingdom-london' },
  { from: 'bahrain-manama', to: 'egypt-cairo' },
  { from: 'bahrain-manama', to: 'united-arab-emirates-dubai' },
  { from: 'bahrain-manama', to: 'india-new-delhi' },
  { from: 'qatar-doha', to: 'egypt-cairo' },
  { from: 'qatar-doha', to: 'united-arab-emirates-dubai' },
  { from: 'qatar-doha', to: 'india-new-delhi' },
  { from: 'qatar-doha', to: 'united-kingdom-london' },
  { from: 'oman-muscat', to: 'egypt-cairo' },
  { from: 'oman-muscat', to: 'united-arab-emirates-dubai' },
  { from: 'oman-muscat', to: 'india-new-delhi' },

  // Jordan, Lebanon, Syria
  { from: 'jordan-amman', to: 'egypt-cairo' },
  { from: 'jordan-amman', to: 'united-kingdom-london' },
  { from: 'jordan-amman', to: 'united-arab-emirates-dubai' },
  { from: 'jordan-amman', to: 'germany-berlin' },
  { from: 'iraq-baghdad', to: 'saudi-arabia-riyadh' },
  { from: 'iraq-baghdad', to: 'united-arab-emirates-dubai' },
  { from: 'iraq-baghdad', to: 'turkey-istanbul' },
  { from: 'lebanon-beirut', to: 'egypt-cairo' },
  { from: 'lebanon-beirut', to: 'france-paris' },
  { from: 'lebanon-beirut', to: 'united-arab-emirates-dubai' },

  // North Africa
  { from: 'morocco-rabat', to: 'united-kingdom-london' },
  { from: 'morocco-rabat', to: 'spain-madrid' },
  { from: 'morocco-rabat', to: 'germany-berlin' },
  { from: 'morocco-rabat', to: 'united-states-new-york-city' },
  { from: 'morocco-rabat', to: 'saudi-arabia-riyadh' },
  { from: 'morocco-rabat', to: 'united-arab-emirates-dubai' },
  { from: 'algeria-algiers', to: 'france-paris' },
  { from: 'algeria-algiers', to: 'saudi-arabia-riyadh' },
  { from: 'algeria-algiers', to: 'egypt-cairo' },
  { from: 'tunisia-tunis', to: 'france-paris' },
  { from: 'tunisia-tunis', to: 'saudi-arabia-riyadh' },
  { from: 'tunisia-tunis', to: 'egypt-cairo' },
  { from: 'libya-tripoli', to: 'egypt-cairo' },
  { from: 'libya-tripoli', to: 'italy-rome' },

  // Turkey as hub
  { from: 'turkey-istanbul', to: 'egypt-cairo' },
  { from: 'turkey-istanbul', to: 'saudi-arabia-riyadh' },
  { from: 'turkey-istanbul', to: 'united-arab-emirates-dubai' },
  { from: 'turkey-istanbul', to: 'germany-berlin' },
  { from: 'turkey-istanbul', to: 'united-kingdom-london' },
];
