'use client';

// =============================================================================
// FloodWatch Semarang — Monitoring Table
// Full-featured data table with search, sort, filter, CSV export
// =============================================================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, SortAsc, SortDesc, Filter,
  Thermometer, Droplets, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useWeatherStore } from '@/store/weatherStore';
import { calculateFloodRisk, calculateRiskLabel, getFloodRiskResult } from '@/lib/floodRiskEngine';
import { getConditionConfig } from '@/lib/weatherConditions';
import { formatDateTime, exportToCSV } from '@/lib/utils';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import type { WeatherCondition, FloodLevel } from '@/types';

type SortKey = 'daerah' | 'kondisi' | 'suhu_c' | 'kelembapan' | 'floodScore';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function MonitoringTable() {
  const allRecords = useWeatherStore((s) => s.records);
  const isLoading = useWeatherStore((s) => s.isLoading);
  const records = useMemo(() => allRecords.filter((r) => r.keterangan === 'Saat Ini'), [allRecords]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('floodScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [riskFilter, setRiskFilter] = useState<FloodLevel | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const processed = useMemo(() => records.map((r) => {
    const score = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
    return { ...r, floodScore: score, floodLevel: calculateRiskLabel(score) };
  }), [records]);

  const filtered = useMemo(() => {
    let data = processed;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) =>
        r.daerah.toLowerCase().includes(q) || r.kondisi.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== 'ALL') {
      data = data.filter((r) => r.floodLevel === riskFilter);
    }
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === 'string'
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [processed, search, riskFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleExport = () => {
    exportToCSV(
      filtered.map((r) => ({
        Lokasi: r.daerah,
        Kondisi: r.kondisi,
        Suhu_C: r.suhu_c,
        Kelembapan: r.kelembapan,
        Skor_Banjir: r.floodScore,
        Level_Banjir: r.floodLevel,
        Waktu: r.waktu,
      })),
      `floodwatch-monitoring-${new Date().toISOString().slice(0, 10)}`
    );
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <SortAsc size={12} className="text-primary" /> : <SortDesc size={12} className="text-primary" />
    ) : <SortAsc size={12} className="opacity-20" />;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Monitoring Real-Time</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} dari {records.length} titik pantau
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari lokasi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 h-9 w-44 text-sm"
              id="monitoring-search"
            />
          </div>
          {/* Risk filter */}
          <Select
            value={riskFilter}
            onValueChange={(v) => { setRiskFilter(v as FloodLevel | 'ALL'); setPage(1); }}
          >
            <SelectTrigger className="h-9 w-36 text-sm" id="risk-filter">
              <Filter size={12} className="mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Level</SelectItem>
              <SelectItem value="AMAN">AMAN</SelectItem>
              <SelectItem value="WASPADA">WASPADA</SelectItem>
              <SelectItem value="SIAGA">SIAGA</SelectItem>
              <SelectItem value="BAHAYA">BAHAYA</SelectItem>
            </SelectContent>
          </Select>
          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExport} id="export-csv-btn" className="h-9 gap-1.5">
            <Download size={13} />
            CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                { key: 'daerah', label: 'Lokasi' },
                { key: 'kondisi', label: 'Kondisi' },
                { key: 'suhu_c', label: 'Suhu' },
                { key: 'kelembapan', label: 'Kelembapan' },
                { key: 'floodScore', label: 'Skor Banjir' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="text-left px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    <SortIcon col={key as SortKey} />
                  </div>
                </th>
              ))}
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Memuat data cuaca...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Tidak ada data tersedia
                </td>
              </tr>
            ) : null}
            <AnimatePresence mode="popLayout">
              {paginated.map((record, idx) => {
                const condConfig = getConditionConfig(record.kondisi);
                const riskResult = getFloodRiskResult(record.floodScore);

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-xs leading-tight max-w-[180px]">{record.daerah}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{condConfig.icon}</span>
                        <span className="text-xs text-foreground">{record.kondisi}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Thermometer size={12} className="text-orange-400" />
                        <span className="font-mono">{record.suhu_c.toFixed(1)}°C</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Droplets size={12} className="text-blue-400" />
                        <span className="font-mono">{record.kelembapan.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${record.floodScore}%`,
                              backgroundColor: riskResult.color,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">{record.floodScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={record.floodLevel} size="sm" pulse={record.floodLevel === 'BAHAYA'} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(record.waktu)}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Halaman {page} dari {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            id="prev-page-btn"
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            id="next-page-btn"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
