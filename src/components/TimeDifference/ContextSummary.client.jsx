'use client';
import React, { useMemo } from 'react';
import ContextSummaryView from './ContextSummaryView';
import { buildContextSummaryLines } from './contextSummary';

export default function ContextSummary({ fromCity, toCity, diffData }) {
  const summary = useMemo(
    () => buildContextSummaryLines({ fromCity, toCity, diffData }),
    [fromCity, toCity, diffData],
  );

  return (
    <ContextSummaryView
      lines={summary}
      title="ملخص المقارنة"
      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
    />
  );
}
