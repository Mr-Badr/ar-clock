'use client';

import React, { useState, useEffect } from 'react';
import SearchCity from './SearchCity.client';

export default function SearchCityWrapper({ mode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-14 animate-pulse bg-surface-2 rounded-2xl" />;
  }

  return <SearchCity mode={mode} />;
}
