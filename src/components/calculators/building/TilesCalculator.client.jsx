'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calcTiles, TILE_PATTERNS, TILE_SIZES, fmt } from '@/lib/calculators/building/constants';

export default function TilesCalculator() {
  const [rooms, setRooms] = useState([{ name: 'غرفة 1', width: 4, length: 4 }]);
  const [tileSizeIndex, setTileSizeIndex] = useState('4'); // Default 60x60
  const [pattern, setPattern] = useState('straight');
  const [customBoxSize, setCustomBoxSize] = useState('');

  const updateRoom = (index, field, val) => {
    const nextValue = field === 'name' ? val : parseFloat(val) || 0;
    setRooms(
      rooms.map((room, roomIndex) => (
        roomIndex === index ? { ...room, [field]: nextValue } : room
      )),
    );
  };

  const addRoom = () => setRooms([...rooms, { name: `غرفة ${rooms.length + 1}`, width: 4, length: 4 }]);
  
  const removeRoom = (index) => {
    if (rooms.length > 1) {
      const newRooms = [...rooms];
      newRooms.splice(index, 1);
      setRooms(newRooms);
    }
  };

  const totalAreaM2 = rooms.reduce((acc, r) => acc + (r.width * r.length), 0);
  
  const selectedSize = TILE_SIZES[parseInt(tileSizeIndex)] || TILE_SIZES[4];
  const parsedBoxSize = Number.parseInt(customBoxSize, 10);
  const tilesPerBox = Number.isFinite(parsedBoxSize) && parsedBoxSize > 0 ? parsedBoxSize : selectedSize.defaultPerBox;

  const results = calcTiles(totalAreaM2, selectedSize.w, selectedSize.h, pattern, tilesPerBox);

  return (
    <div className="calc-app-grid calc-building-tool">
      <div className="space-y-6">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات البلاط والمساحات</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            
            {/* Tile Size & Pattern */}
            <div className="calc-form-grid">
              <div className="space-y-2">
                <Label>مقاس البلاط (سم)</Label>
                <Select value={tileSizeIndex} onValueChange={setTileSizeIndex}>
                  <SelectTrigger dir="rtl" aria-label="اختر مقاس البلاط">
                    <SelectValue placeholder="اختر المقاس" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {TILE_SIZES.map((size, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {size.label} <span className="text-xs text-text-secondary">({size.defaultPerBox} حبة/كرتون)</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>طريقة التركيب (تؤثر على الهدر)</Label>
                <div className="calc-building-choice-grid calc-building-choice-grid--patterns">
                  {TILE_PATTERNS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      aria-pressed={pattern === p.key}
                      onClick={() => setPattern(p.key)}
                      className={`calc-building-choice-card ${
                        pattern === p.key
                          ? 'is-active'
                          : ''
                      }`}
                    >
                      <span className="text-sm font-bold">{p.label}</span>
                      <span className="text-xs text-text-secondary">هدر {p.waste}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiles-box-count" className="flex justify-between items-center">
                  <span>عدد الحبات في الكرتون (اختياري)</span>
                  <span className="text-xs text-text-secondary">الافتراضي: {selectedSize.defaultPerBox}</span>
                </Label>
                <Input
                  id="tiles-box-count"
                  type="number"
                  min="1"
                  placeholder={`الافتراضي للمقاس: ${selectedSize.defaultPerBox}`}
                  value={customBoxSize}
                  onChange={(e) => setCustomBoxSize(e.target.value)}
                  className="calc-input"
                />
              </div>
            </div>

            {/* Rooms Setup */}
            <div className="calc-field">
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                <Label>المساحات / الغرف</Label>
                <span className="text-sm font-bold text-primary">{fmt(totalAreaM2, 1)} م² إجمالي</span>
              </div>

              <div className="calc-room-list">
                {rooms.map((room, index) => (
                  <div key={index} className="calc-room-card">
                    <div className="calc-room-card__fields">
                      <Input
                        aria-label={`اسم المساحة رقم ${index + 1}`}
                        type="text"
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        className="calc-room-name-input"
                      />
                      <div className="calc-room-dimensions">
                        <div className="calc-field">
                           <Label htmlFor={`tiles-room-length-${index}`} className="text-[10px] text-text-secondary">الطول (م)</Label>
                           <Input
                             id={`tiles-room-length-${index}`}
                             type="number"
                             min="0.1"
                             step="0.1"
                             value={room.length}
                             onChange={(e) => updateRoom(index, 'length', e.target.value)}
                             className="calc-input calc-room-number-input"
                           />
                        </div>
                        <span className="calc-room-multiply">×</span>
                        <div className="calc-field">
                           <Label htmlFor={`tiles-room-width-${index}`} className="text-[10px] text-text-secondary">العرض (م)</Label>
                           <Input
                             id={`tiles-room-width-${index}`}
                             type="number"
                             min="0.1"
                             step="0.1"
                             value={room.width}
                             onChange={(e) => updateRoom(index, 'width', e.target.value)}
                             className="calc-input calc-room-number-input"
                           />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeRoom(index)}
                      disabled={rooms.length === 1}
                      className="calc-room-remove"
                      aria-label={`حذف المساحة رقم ${index + 1}`}
                      title="حذف الغرفة"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addRoom}
                className="calc-room-add"
              >
                + إضافة غرفة أخرى
              </button>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="calc-results-panel">
        <Card className="calc-surface-card calc-result-card h-full relative overflow-hidden">
          <CardHeader className="pb-2 border-b border-[var(--border-subtle)]">
            <CardTitle className="calc-card-title text-base flex justify-between items-center">
              <span>الكمية المطلوبة للتركيب</span>
              <span className="text-xs font-normal text-text-secondary bg-[var(--bg-surface-2)] px-2 py-1 rounded-md border border-[var(--border-subtle)]">
                شامل {results.wasteFactor * 100}% نسبة هدر
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-8 space-y-8" aria-live="polite">
            <div className="flex flex-col items-center justify-center text-center">
              <h4 className="text-sm text-text-secondary font-medium mb-2">إجمالي الكراتين</h4>
              <div className="flex items-end justify-center mb-2">
                <span className="calc-result-value me-2">
                  {fmt(results.boxes)}
                </span>
                <span className="text-xl text-text-secondary font-medium pb-1">كرتون</span>
              </div>
              <div className="mt-2 inline-block rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-4 py-1 text-sm font-medium text-text-primary">
                إجمالي مساحة: {fmt(totalAreaM2, 1)} متر مربع
              </div>
            </div>

            <div className="calc-metric-grid calc-grid-2 calc-result-metrics">
              <div className="calc-metric-card text-center">
                <span className="calc-metric-card__label justify-center">العدد الفعلي (بحساب الهدر)</span>
                <span className="calc-metric-card__value">{fmt(results.tilesWithWaste)} بلاطة</span>
              </div>
              
              <div className="calc-metric-card text-center">
                <span className="calc-metric-card__label justify-center">تعبئة الكرتون الواحد</span>
                <span className="calc-metric-card__value">{tilesPerBox} حبات</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[var(--bg-surface-2)] rounded-lg text-sm text-text-primary px-4">
              <span>المتر المربع يحتاج بشكل صافي:</span>
              <span className="font-bold font-mono">{fmt(results.tilesPerM2, 1)} حبة / م²</span>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
