'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { calculateFloodRisk, getFloodRiskResult, calculateRiskLabel } from '@/lib/floodRiskEngine';
import { getConditionConfig } from '@/lib/weatherConditions';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime, exportToCSV, average } from '@/lib/utils';
import { MONITORING_LOCATIONS } from '@/lib/locations';
import type { FloodLevel, WeatherCondition } from '@/types';
import { useWeatherStore } from '@/store/weatherStore';

const PAGE_SIZE = 15;

export function HistoryPageClient() {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState<FloodLevel | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const historicalRecords = useWeatherStore((s) => s.historicalRecords);
  const lastUpdate = useWeatherStore((s) => s.lastUpdate);
  const updateCount = useWeatherStore((s) => s.updateCount);

  const historyRecords = useMemo(() => {
    return historicalRecords.map((r) => {
      const floodScore = calculateFloodRisk(r.kondisi as WeatherCondition, r.kelembapan);
      const riskLevel = calculateRiskLabel(floodScore);
      return { ...r, floodScore, riskLevel };
    });
  }, [historicalRecords]);

  // Tren per jam — update otomatis saat data BMKG berubah
  const hourlyRiskData = useMemo(() => {
    const buckets = new Map<string, number[]>();
    historyRecords.forEach((r) => {
      const d = new Date(r.timestamp);
      const key = `${d.getHours().toString().padStart(2, '0')}:00`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(r.floodScore);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, scores]) => ({
        time,
        avgScore: Math.round(average(scores)),
      }));
  }, [historyRecords]);

  const dailyChartData = useMemo(() => {
    const days: Record<string, number[]> = {};
    historyRecords.forEach((r) => {
      const d = new Date(r.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!days[d]) days[d] = [];
      days[d].push(r.floodScore);
    });
    return Object.entries(days)
      .map(([date, scores]) => ({
        date,
        avgScore: Math.round(average(scores)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [historyRecords]);

  const riskYDomain = useMemo((): [number, number] => {
    const values = hourlyRiskData.map((d) => d.avgScore);
    if (!values.length) return [0, 50];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max(5, (max - min) * 0.3 || 5);
    return [Math.max(0, Math.floor(min - pad)), Math.min(100, Math.ceil(max + pad))];
  }, [hourlyRiskData]);

  const filtered = useMemo(() => {
    let data = historyRecords;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.daerah.toLowerCase().includes(q) || r.kondisi.toLowerCase().includes(q));
    }
    if (locationFilter !== 'ALL') {
      data = data.filter((r) => r.daerah === locationFilter);
    }
    if (riskFilter !== 'ALL') {
      data = data.filter((r) => r.riskLevel === riskFilter);
    }
    return data;
  }, [historyRecords, search, locationFilter, riskFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    exportToCSV(
      filtered.map((r) => ({
        Waktu: r.timestamp,
        Lokasi: r.daerah,
        Kondisi: r.kondisi,
        Suhu_C: r.suhu_c,
        Kelembapan: r.kelembapan,
        Skor_Banjir: r.floodScore,
        Level_Banjir: r.riskLevel,
      })),
      `floodwatch-history-${new Date().toISOString().slice(0, 10)}`
    );
  };

  return (
    <div className="space-y-6 w-full">
      {/* Live hourly risk */}
      <motion.div
        key={updateCount}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold">Tren Risiko (Live)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rata-rata skor risiko per jam · sinkron dengan data BMKG
            </p>
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 rounded-full px-3 py-1">
              <RefreshCw size={10} className="text-primary" />
              Update #{updateCount} · {formatDateTime(lastUpdate)}
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={hourlyRiskData}>
            <defs>
              <linearGradient id="histLiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} domain={riskYDomain} />
            <ReferenceLine y={40} stroke="#eab308" strokeDasharray="4 4" />
            <ReferenceLine y={70} stroke="#f97316" strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              formatter={(v) => [`${v ?? 0}`, 'Skor Risiko']}
              labelFormatter={(l) => `Jam ${l} WIB`}
            />
            <Area
              type="monotone"
              dataKey="avgScore"
              name="Skor Risiko"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#histLiveGrad)"
              dot={{ r: 3, fill: '#6366f1' }}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Daily summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="font-semibold mb-1">Tren Risiko Harian</h3>
        <p className="text-xs text-muted-foreground mb-4">Rata-rata skor 7 hari terakhir</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="avgScore" name="Rata-rata Risiko" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">Riwayat Data Cuaca</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} records</p>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 h-9 w-40 text-sm"
            />
          </div>

          <Select value={locationFilter} onValueChange={(v) => { if (v) { setLocationFilter(v); setPage(1); } }}>
            <SelectTrigger className="h-9 w-44 text-xs">
              <SelectValue placeholder="Semua Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Lokasi</SelectItem>
              {MONITORING_LOCATIONS.map((loc) => (
                <SelectItem key={loc.id} value={loc.name} className="text-xs">{loc.kelurahan}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={riskFilter} onValueChange={(v) => { if (v) { setRiskFilter(v as FloodLevel | 'ALL'); setPage(1); } }}>
            <SelectTrigger className="h-9 w-32 text-xs">
              <SelectValue placeholder="Semua Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Level</SelectItem>
              <SelectItem value="AMAN">AMAN</SelectItem>
              <SelectItem value="WASPADA">WASPADA</SelectItem>
              <SelectItem value="SIAGA">SIAGA</SelectItem>
              <SelectItem value="BAHAYA">BAHAYA</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-1.5">
            <Download size={12} />
            CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {['Waktu', 'Lokasi', 'Kondisi', 'Suhu', 'Kelembapan', 'Skor', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((record, idx) => {
                const cond = getConditionConfig(record.kondisi);
                const risk = getFloodRiskResult(record.floodScore);

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(record.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium max-w-[160px] truncate">{record.daerah}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span>{cond.icon}</span>
                        <span className="text-xs">{record.kondisi}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{record.suhu_c.toFixed(1)}°C</td>
                    <td className="px-4 py-3 text-xs font-mono">{record.kelembapan.toFixed(0)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${record.floodScore}%`, backgroundColor: risk.color }}
                          />
                        </div>
                        <span className="text-xs font-mono">{record.floodScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={record.riskLevel} size="sm" />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 text-xs rounded-lg ${page === pageNum ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-2 text-muted-foreground">...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
