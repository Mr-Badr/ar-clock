'use client';

import { Settings as SettingsIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function SettingsPanel({ settings, onSettingsChange }) {
  const colors = [
    { name: 'أزرق', value: '#3B82F6' },
    { name: 'أخضر', value: '#10B981' },
    { name: 'برتقالي', value: '#F59E0B' },
    { name: 'أحمر', value: '#EF4444' },
    { name: 'بنفسجي', value: '#8B5CF6' },
    { name: 'وردي', value: '#EC4899' }
  ];

  const handleToggle = (key) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleColorChange = (color) => {
    onSettingsChange({
      ...settings,
      clockColor: color
    });
  };

  const handleThemeToggle = () => {
    onSettingsChange({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  const handleReset = () => {
    onSettingsChange({
      theme: 'dark',
      is24Hour: true,
      showDate: true,
      useArabicNumerals: false,
      clockColor: '#3B82F6',
      useDigitalFont: true
    });
  };

  return (
    <Sheet portal={false}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground" // بدون أي تأثير على الخلفية
        >
          <SettingsIcon className="w-6 h-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
  side="left"
  className={`w-80 p-6 z-[9999] isolate
    ${settings.theme === 'dark' ? 'bg-card dark:text-foreground' : 'bg-card text-foreground'}`}
>


        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">الإعدادات</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">

          {/* خط رقمي */}
          <div className="flex items-center justify-between">
            <Label htmlFor="digital-font">خط رقمي</Label>
            <Switch
              id="digital-font"
              checked={settings.useDigitalFont ?? true}
              onCheckedChange={() => handleToggle('useDigitalFont')}
            />
          </div>

          {/* 24 ساعة */}
          <div className="flex items-center justify-between">
            <Label htmlFor="24hour">24 ساعة</Label>
            <Switch
              id="24hour"
              checked={settings.is24Hour}
              onCheckedChange={() => handleToggle('is24Hour')}
            />
          </div>

          {/* عرض التاريخ */}
          <div className="flex items-center justify-between">
            <Label htmlFor="show-date">عرض التاريخ</Label>
            <Switch
              id="show-date"
              checked={settings.showDate}
              onCheckedChange={() => handleToggle('showDate')}
            />
          </div>

          {/* الوضع الليلي */}
          <div className="flex items-center justify-between">
            <Label htmlFor="night-mode">الوضع الليلي</Label>
            <Switch
              id="night-mode"
              checked={settings.theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>

          {/* أرقام عربية */}
          <div className="flex items-center justify-between">
            <Label htmlFor="arabic-numerals">أرقام عربية</Label>
            <Switch
              id="arabic-numerals"
              checked={settings.useArabicNumerals}
              onCheckedChange={() => handleToggle('useArabicNumerals')}
            />
          </div>

          {/* ألوان الساعة */}
          <div className="space-y-2">
            <Label>ألوان الساعة</Label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    settings.clockColor === color.value
                      ? 'ring-2 ring-ring ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* إعادة تعيين الإعدادات */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            إعادة تعيين الإعدادات
          </Button>

        </div>
      </SheetContent>
    </Sheet>
  );
}
