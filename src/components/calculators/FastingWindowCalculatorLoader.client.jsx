'use client';

import dynamic from 'next/dynamic';

const FastingWindowCalculator = dynamic(
  () => import('./FastingWindowCalculator.client'),
  { ssr: false },
);

export default function FastingWindowCalculatorLoader() {
  return <FastingWindowCalculator />;
}
