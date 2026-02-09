'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { X, Check, ChevronsUpDown, Globe } from 'lucide-react';
import { worldCountries } from '@/lib/world-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function AddTimezoneModal({ open, onClose, onAdd }) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openTimezone, setOpenTimezone] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [customTitle, setCustomTitle] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedCountry(null);
      setSelectedTimezone(null);
      setCustomTitle('');
    }
  }, [open]);

  const handleSelectCountry = (countryCode) => {
    const country = worldCountries.find(c => c.code === countryCode);
    setSelectedCountry(country);
    setSelectedTimezone(null);
    setCustomTitle('');
    setOpenCountry(false);
  };

  const handleSelectTimezone = (tz) => {
    setSelectedTimezone(tz);
    // Extract city name from timezone string (e.g., "Asia/Riyadh" -> "Riyadh")
    const cityName = tz.split('/').pop().replace(/_/g, ' ');
    setCustomTitle(cityName);
    setOpenTimezone(false);
  };

  const handleAdd = () => {
    if (!selectedCountry || !selectedTimezone) return;

    onAdd({
      name: customTitle,
      timezone: selectedTimezone,
      country: selectedCountry.name
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2 border-b border-border/10">
          <DialogTitle className="text-2xl font-light">إضافة ساعة جديدة</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label className="text-foreground-muted">الدولة</Label>
            <Popover open={openCountry} onOpenChange={setOpenCountry}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCountry}
                  className="w-full justify-between bg-surface border-border hover:bg-surface/80 h-12 text-lg hover:text-foreground"
                >
                  {selectedCountry ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      {selectedCountry.name}
                    </span>
                  ) : (
                    <span className="text-foreground-muted">اختر الدولة...</span>
                  )}
                  <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px] p-0 bg-popover border-border" align="start">
                <Command>
                  <CommandInput placeholder="ابحث عن دولة..." className="text-right" />
                  <CommandList>
                    <CommandEmpty>لم يتم العثور على دولة.</CommandEmpty>
                    <CommandGroup>
                      {worldCountries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => handleSelectCountry(country.code)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span className="text-xl">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="text-xs text-muted-foreground mr-auto">{country.englishName}</span>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountry?.code === country.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Timezone Selection - Only active if Country selected */}
          <div className={cn("space-y-2 transition-opacity duration-200", !selectedCountry && "opacity-50 pointer-events-none")}>
            <Label className="text-foreground-muted">المنطقة الزمنية</Label>
            <Popover open={openTimezone} onOpenChange={setOpenTimezone}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!selectedCountry}
                  aria-expanded={openTimezone}
                  className="w-full justify-between bg-surface border-border hover:bg-surface/80 h-12 text-lg hover:text-foreground"
                >
                  {selectedTimezone ? (
                    selectedTimezone.split('/').pop().replace(/_/g, ' ')
                  ) : (
                    <span className="text-foreground-muted">اختر المنطقة الزمنية...</span>
                  )}
                  <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[450px] p-0 bg-popover border-border" align="start">
                <Command>
                  <CommandInput placeholder="ابحث عن منطقة زمنية..." className="text-right" />
                  <CommandList>
                    <CommandEmpty>لم يتم العثور على منطقة زمنية.</CommandEmpty>
                    <CommandGroup>
                      {selectedCountry?.timezones.map((tz) => (
                        <CommandItem
                          key={tz}
                          value={tz}
                          onSelect={() => handleSelectTimezone(tz)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "ml-2 h-4 w-4",
                              selectedTimezone === tz ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {tz}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Title Input */}
          <div className={cn("space-y-2 transition-opacity duration-200", !selectedTimezone && "opacity-50 pointer-events-none")}>
            <Label className="text-foreground-muted">العنوان</Label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="مثال: الرياض"
              disabled={!selectedTimezone}
              className="bg-surface border-border h-12 text-lg"
            />
          </div>
        </div>

        <div className="p-6 pt-2 flex justify-end gap-3 bg-surface/30">
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-surface text-foreground-muted hover:text-foreground"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedCountry || !selectedTimezone || !customTitle}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
          >
            إضافة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
