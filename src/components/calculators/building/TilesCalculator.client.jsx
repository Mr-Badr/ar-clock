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
    const newRooms = [...rooms];
    newRooms[index][field] = field === 'name' ? val : parseFloat(val) || 0;
    setRooms(newRooms);
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
  const tilesPerBox = customBoxSize ? parseInt(customBoxSize) : selectedSize.defaultPerBox;

  const results = calcTiles(totalAreaM2, selectedSize.w, selectedSize.h, pattern, tilesPerBox);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title text-xl">مواصفات البلاط والمساحات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Tile Size & Pattern */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>مقاس البلاط (سم)</Label>
                <Select value={tileSizeIndex} onValueChange={setTileSizeIndex}>
                  <SelectTrigger dir="rtl">
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
                <div className="grid grid-cols-2 gap-2">
                  {TILE_PATTERNS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPattern(p.key)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        pattern === p.key
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent bg-accent/5 hover:bg-accent/10'
                      }`}
                    >
                      <span className="text-xl mb-1">{p.icon}</span>
                      <span className="text-sm font-bold">{p.label}</span>
                      <span className="text-xs text-text-secondary">هدر {p.waste}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex justify-between items-center">
                  <span>عدد الحبات في الكرتون (اختياري)</span>
                  <span className="text-xs text-text-secondary">الافتراضي: {selectedSize.defaultPerBox}</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder={`الافتراضي للمقاس: ${selectedSize.defaultPerBox}`}
                  value={customBoxSize}
                  onChange={(e) => setCustomBoxSize(e.target.value)}
                />
              </div>
            </div>

            {/* Rooms Setup */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-accent/10 pb-2">
                <Label>المساحات / الغرف</Label>
                <span className="text-sm font-bold text-primary">{fmt(totalAreaM2, 1)} م² إجمالي</span>
              </div>

              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div key={index} className="flex gap-2 items-end bg-accent/5 p-3 rounded-xl border border-accent/10">
                    <div className="flex-1 space-y-2">
                      <Input
                        type="text"
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        className="h-8 text-sm font-bold bg-transparent border-none px-0 focus-visible:ring-0"
                      />
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                           <Label className="text-[10px] text-text-secondary">الطول (م)</Label>
                           <Input
                             type="number"
                             min="0.1"
                             step="0.1"
                             value={room.length}
                             onChange={(e) => updateRoom(index, 'length', e.target.value)}
                             className="text-center h-9"
                           />
                        </div>
                        <span className="text-text-secondary translate-y-2">×</span>
                        <div className="flex-1">
                           <Label className="text-[10px] text-text-secondary">العرض (م)</Label>
                           <Input
                             type="number"
                             min="0.1"
                             step="0.1"
                             value={room.width}
                             onChange={(e) => updateRoom(index, 'width', e.target.value)}
                             className="text-center h-9"
                           />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeRoom(index)}
                      disabled={rooms.length === 1}
                      className="h-9 px-3 flex items-center justify-center rounded-md bg-base border border-accent/20 hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-30 mb-[2px]"
                      title="حذف الغرفة"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={addRoom}
                className="w-full py-2 text-sm text-primary font-medium border border-primary border-dashed rounded-lg hover:bg-primary/5 transition-colors"
              >
                + إضافة غرفة أخرى
              </button>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <Card className="calc-result-card h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <CardHeader className="pb-2 border-b border-accent/10">
            <CardTitle className="calc-card-title text-base flex justify-between items-center">
              <span>الكمية المطلوبة للتركيب</span>
              <span className="text-xs font-normal text-text-secondary bg-base px-2 py-1 rounded-md border border-accent/10">
                شامل {results.wasteFactor * 100}% نسبة هدر
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-8 space-y-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h4 className="text-sm text-text-secondary font-medium mb-2">إجمالي الكراتين</h4>
              <div className="flex items-end justify-center mb-2">
                <span className="text-5xl font-black text-primary mr-2" style={{ fontFamily: 'var(--font-ibm-plex-sans-arabic)' }}>
                  {fmt(results.boxes)}
                </span>
                <span className="text-xl text-text-secondary font-medium pb-1">كرتون</span>
              </div>
              <div className="text-sm font-medium text-text-primary px-4 py-1 bg-accent/5 rounded-full inline-block mt-2">
                إجمالي مساحة: {fmt(totalAreaM2, 1)} متر مربع
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-accent/10">
              <div className="flex flex-col justify-center p-4 bg-base rounded-xl border border-accent/10 text-center">
                <span className="text-2xl mb-2">🔲</span>
                <span className="text-xs text-text-secondary mb-1">العدد الفعلي (بحساب الهدر)</span>
                <span className="font-bold text-lg">{fmt(results.tilesWithWaste)} بلاطة</span>
              </div>
              
              <div className="flex flex-col justify-center p-4 bg-base rounded-xl border border-accent/10 text-center">
                <span className="text-2xl mb-2">📦</span>
                <span className="text-xs text-text-secondary mb-1">تعبئة الكرتون الواحد</span>
                <span className="font-bold text-lg">{tilesPerBox} حبات</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg text-sm text-text-primary px-4">
              <span>المتر المربع يحتاج بشكل صافي:</span>
              <span className="font-bold font-mono">{fmt(results.tilesPerM2, 1)} حبة / م²</span>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
