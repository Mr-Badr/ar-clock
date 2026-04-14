"use client";

import { useMemo, useState } from 'react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VAT_COUNTRIES, VAT_FILTERS } from '@/lib/calculators/data';
import { formatPercent } from '@/lib/calculators/engine';

export default function VatRatesTable() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    return VAT_COUNTRIES.filter((country) => {
      const matchesFilter = filter === 'all' || country.region === filter;
      const normalizedQuery = query.trim();
      const matchesQuery =
        !normalizedQuery ||
        country.name.includes(normalizedQuery) ||
        country.currency.includes(normalizedQuery) ||
        country.note.includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    }).sort((a, b) => b.rate - a.rate);
  }, [filter, query]);

  return (
    <Card className="calc-surface-card">
      <CardHeader>
        <CardTitle className="calc-card-title">مقارنة نسب الضريبة الشائعة</CardTitle>
      </CardHeader>
      <CardContent className="calc-form-grid">
        <div className="calc-grid-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث باسم الدولة أو العملة"
          />
          <div className="calc-kbd-row">
            {VAT_FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip calc-chip-button ${filter === item.id ? 'is-active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-table-wrap">
          <Table className="economy-table">
            <TableHeader>
              <TableRow>
                <TableHead>الدولة</TableHead>
                <TableHead>النسبة</TableHead>
                <TableHead>العملة</TableHead>
                <TableHead>ملاحظة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.code}>
                  <TableCell>{row.flag} {row.name}</TableCell>
                  <TableCell>{formatPercent(row.rate, 0)}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
