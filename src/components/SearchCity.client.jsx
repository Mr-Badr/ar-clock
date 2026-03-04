'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, ChevronDown, Check, Loader2, X, Globe } from 'lucide-react';

/* Shadcn Components */
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

/**
 * components/SearchCity.client.jsx (Shadcn Edition)
 * 
 * Premium Hybrid Search UX with Shadcn/Radix:
 * - Country Selecor as a Searchable Popover.
 * - Global City search with Command interface.
 */

const LS_COUNTRY = 'waqt-preferred-country';

function stripDiacritics(str = '') {
  return str.replace(/[\u064B-\u065F\u0670]/g, '');
}

function highlightArabic(text, query) {
  if (!query || !text) return text;
  const normalized = stripDiacritics(text);
  const nQuery = stripDiacritics(query);
  const idx = normalized.indexOf(nQuery);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--accent-soft)] text-[var(--accent)] rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchCity({ onSelectCity = null, initialCity = null }) {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load countries & persistent pref
  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        
        // Priority 1: Use initialCity if passed
        if (initialCity?.country_slug) {
          const matched = data.find(c => c.slug === initialCity.country_slug);
          if (matched) {
            setSelectedCountry(matched);
            return;
          }
        }

        // Priority 2: LocalStorage fallback
        const saved = localStorage.getItem(LS_COUNTRY);
        if (saved) {
          const found = data.find(c => c.slug === saved);
          if (found) setSelectedCountry(found);
        }
      });
  }, [initialCity]);

  const performSearch = useCallback(async (q, countrySlug) => {
    if (!q.trim() && !countrySlug) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    try {
      let url = `/api/search-cities?q=${encodeURIComponent(q)}&country=${countrySlug || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setIsOpen(data.length > 0);
      }
    } catch (e) {
      console.error('Search error', e);
    }
  }, []);

  const onQueryChange = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(val, selectedCountry?.slug);
    }, 250);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`/api/nearest-city?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          if (res.ok) {
            const city = await res.json();
            if (onSelectCity) {
              onSelectCity(city);
            } else {
              router.push(`/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`);
            }
          }
        } catch (e) {
          console.error('Geo lookup failed', e);
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    );
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    if (country) localStorage.setItem(LS_COUNTRY, country.slug);
    else localStorage.removeItem(LS_COUNTRY);
    performSearch(query, country?.slug);
  };

  const handleSelectCity = (city) => {
    setQuery('');
    setIsOpen(false);
    if (onSelectCity) {
      onSelectCity(city);
    } else {
      router.push(`/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">

      <div className="flex flex-col md:flex-row gap-2 bg-[var(--bg-surface-2)] p-1 rounded-2xl shadow-lg border border-[var(--border-subtle)]">

        {/* Country Selector Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-14 md:w-[180px] justify-between text-sm hover:bg-[var(--accent-soft)] transition-all rounded-xl border-none"
            >
              <div className="flex items-center gap-2 truncate">
                <Globe size={18} className="text-[var(--accent)]" />
                <span className="truncate">{selectedCountry ? selectedCountry.name_ar : 'العالم'}</span>
              </div>
              <ChevronDown size={14} className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 z-[100] bg-[var(--bg-surface-1)] border-[var(--border-default)]" align="start" dir="rtl">
            <Command className="bg-transparent">
              <CommandInput placeholder="ابحث عن الدولة..." className="text-right" />
              <CommandList className="max-h-72 overflow-y-auto custom-scrollbar">
                <CommandEmpty>لا توجد نتائج</CommandEmpty>
                <CommandGroup heading="اختر الدولة">
                  <CommandItem
                    onSelect={() => handleSelectCountry(null)}
                    className="flex items-center justify-between py-3 px-4 hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
                  >
                    <span>جميع الدول</span>
                    {!selectedCountry && <Check size={16} className="text-[var(--accent)]" />}
                  </CommandItem>
                  {countries.map(c => (
                    <CommandItem
                      key={c.slug}
                      onSelect={() => handleSelectCountry(c)}
                      className="flex items-center justify-between py-3 px-4 hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
                    >
                      <span>{c.name_ar}</span>
                      {selectedCountry?.slug === c.slug && <Check size={16} className="text-[var(--accent)]" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Separator Line */}
        <div className="hidden md:block w-px h-8 self-center bg-[var(--border-subtle)]" />

        {/* City/Global Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--accent)] opacity-40 group-focus-within:opacity-100 transition-opacity">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => { if (results.length) setIsOpen(true); }}
            placeholder={selectedCountry ? `ابحث في ${selectedCountry.name_ar}...` : "ابحث عن المدينة (مثال: كندا، مكة)"}
            className="w-full h-14 pr-12 pl-12 bg-transparent border-none focus:ring-0 text-base placeholder:text-[var(--text-muted)] rounded-none"
          />

          {/* Results Modal/Overlay */}
          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 left-0 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-2xl shadow-2xl z-[90] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <Command>
                <CommandList className="max-h-[420px] overflow-y-auto custom-scrollbar">
                  <CommandGroup heading="المدن المقترحة">
                    {results.map((city) => (
                      <CommandItem
                        key={`${city.country_slug}-${city.city_slug}`}
                        onSelect={() => handleSelectCity(city)}
                        className="flex flex-col items-start px-6 py-4 hover:bg-[var(--accent-soft)] transition-all border-b border-[var(--border-subtle)] last:border-0 cursor-pointer text-right group/item"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-base text-[var(--text-primary)] group-hover/item:text-[var(--accent)] transition-colors">
                              {highlightArabic(city.city_name_ar, query)}
                            </span>
                            {!selectedCountry && (
                              <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[var(--bg-subtle)]">
                                {city.country_name_ar}
                              </span>
                            )}
                          </div>
                          {city.preview && (
                            <span className="text-[11px] font-bold text-[var(--accent)] opacity-80">
                              {city.preview}
                            </span>
                          )}
                        </div>
                        {city.city_name_en && (
                          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest mt-0.5">
                            {city.city_name_en}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>

        {/* Geolocation Button */}
        <Button
          onClick={handleGeoLocation}
          disabled={geoLoading}
          className="h-14 md:h-auto px-6 rounded-xl font-bold transition-all text-white bg-gradient-to-br from-[var(--accent)] to-[#38b2ac] hover:scale-[1.02] active:scale-95 shadow-lg shadow-[var(--accent-glow)]"
        >
          {geoLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <MapPin size={18} />
          )}
          <span className="mr-2">موقعي</span>
        </Button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
