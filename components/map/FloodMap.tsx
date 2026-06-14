'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeatherStore } from '@/store/weatherStore';
import { useMapStore } from '@/store/mapStore';
import { calculateFloodRisk, getFloodRiskResult } from '@/lib/floodRiskEngine';
import { MONITORING_LOCATIONS, SEMARANG_CENTER, DEFAULT_ZOOM } from '@/lib/locations';
import { destroyLeafletMap } from '@/lib/map/leafletCleanup';
import { buildMarkerPopupHtml } from '@/lib/map/popupHtml';
import { RiskLegend } from './RiskLegend';
import { cn } from '@/lib/utils';
import type { AnalysisPhase } from '@/store/chatFlowStore';
import type { WeatherCondition } from '@/types';

function createRiskMarker(
  color: string,
  level: string,
  score: number,
  highlighted: boolean
): L.DivIcon {
  const isBAHAYA = level === 'BAHAYA';
  const isSIAGA = level === 'SIAGA';
  const scale = highlighted ? 1.15 : 1;

  return L.divIcon({
    className: highlighted ? 'map-marker-highlight' : '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26],
    html: `
      <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;transform:scale(${scale});transition:transform 0.3s ease;">
        ${highlighted || isBAHAYA ? `
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${color};opacity:0.5;animation:markerPulse 1.2s ease-out infinite;"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;border:1.5px solid ${color};opacity:0.3;animation:markerPulse 1.2s ease-out 0.4s infinite;"></div>
        ` : isSIAGA ? `
          <div style="position:absolute;inset:4px;border-radius:50%;border:2px solid ${color};opacity:0.3;animation:markerPulse 2.5s ease-out infinite;"></div>
        ` : ''}
        <div style="width:32px;height:32px;border-radius:50%;background:${color}22;border:2.5px solid ${color};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${color};font-family:system-ui,sans-serif;box-shadow:0 0 ${highlighted ? '20px' : '12px'} ${color}${highlighted ? '88' : '44'},0 2px 8px rgba(0,0,0,0.4);cursor:pointer;">
          ${score}
        </div>
      </div>
      <style>@keyframes markerPulse{0%{transform:scale(1);opacity:0.5}100%{transform:scale(2.2);opacity:0}}</style>
    `,
  });
}

interface FloodMapProps {
  height?: string;
  showLegend?: boolean;
  showScanBanner?: boolean;
  /** Mode analisis chat — tanpa popup marker */
  analysisMode?: boolean;
  analysisPhase?: AnalysisPhase;
  className?: string;
  instanceId?: string;
  interactive?: boolean;
}

export function FloodMap({
  height = '100%',
  showLegend = true,
  showScanBanner = true,
  analysisMode = false,
  analysisPhase,
  className,
  instanceId = 'default',
  interactive = false,
}: FloodMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isInitializingRef = useRef(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isReady, setIsReady] = useState(false);

  const records = useWeatherStore((s) => s.records);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const dashboardFocus = useMapStore((s) => s.dashboardFocus);

  const highlightIds = interactive ? (dashboardFocus?.locationIds ?? []) : [];
  const primaryId = interactive ? dashboardFocus?.primaryId : null;
  const isScanning = interactive && (dashboardFocus?.scanning ?? false);

  const markerData = useMemo(() => {
    return MONITORING_LOCATIONS.map((loc) => {
      const record =
        records.find((r) => r.keterangan === 'Saat Ini' && r.daerah === loc.name) ?? null;

      let score = 0;
      let level = 'AMAN';
      let color = '#22c55e';

      if (record) {
        score = calculateFloodRisk(record.kondisi as WeatherCondition, record.kelembapan);
        const risk = getFloodRiskResult(score);
        level = risk.level;
        color = risk.color;
      }

      return { loc, record, score, level, color };
    });
  }, [records]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isInitializingRef.current) return;

    let cancelled = false;
    isInitializingRef.current = true;
    setIsReady(false);

    const initMap = () => {
      if (cancelled || !containerRef.current) return;

      destroyLeafletMap(mapRef.current, containerRef.current);
      mapRef.current = null;
      markersLayerRef.current = null;
      markersRef.current.clear();

      const map = L.map(containerRef.current, {
        center: SEMARANG_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      if (!analysisMode) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      }

      const markersLayer = L.layerGroup().addTo(map);

      mapRef.current = map;
      markersLayerRef.current = markersLayer;
      isInitializingRef.current = false;
      setIsReady(true);
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(initMap);
    });

    return () => {
      cancelled = true;
      isInitializingRef.current = false;
      cancelAnimationFrame(frame);
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      destroyLeafletMap(mapRef.current, containerRef.current);
      mapRef.current = null;
      markersLayerRef.current = null;
      markersRef.current.clear();
      setIsReady(false);
    };
  }, [instanceId, analysisMode]);

  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer || !isReady) return;

    markersLayer.clearLayers();
    markersRef.current.clear();

    markerData.forEach(({ loc, record, score, level, color }) => {
      const highlighted = highlightIds.includes(loc.id);
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createRiskMarker(color, level, score, highlighted),
        zIndexOffset: highlighted ? 1000 : 0,
      });

      if (!analysisMode) {
        marker.bindPopup(buildMarkerPopupHtml(loc, record), {
          maxWidth: 280,
          minWidth: 260,
          className: 'flood-popup',
        });
      }

      marker.addTo(markersLayer);
      markersRef.current.set(loc.id, marker);
    });
  }, [markerData, isReady, highlightIds, analysisMode]);

  // Tutup popup saat mode analisis aktif
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !analysisMode) return;
    map.closePopup();
  }, [analysisMode, isReady, primaryId, isScanning]);

  // Fly to primary location (popup hanya di mode non-analisis)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !interactive || !primaryId) return;
    if (analysisMode && analysisPhase === 'scanning') return;

    const loc = MONITORING_LOCATIONS.find((l) => l.id === primaryId);
    if (!loc) return;

    const zoomLevel = analysisMode ? 13 : 14;
    map.flyTo([loc.lat, loc.lng], zoomLevel, {
      duration: analysisMode ? 1.0 : 1.4,
      easeLinearity: 0.25,
    });

    if (analysisMode) return;

    const timer = setTimeout(() => {
      markersRef.current.get(primaryId)?.openPopup();
    }, 900);

    return () => clearTimeout(timer);
  }, [primaryId, isReady, interactive, analysisMode, analysisPhase]);

  // Pan halus ke kanan/kiri/atas/bawah sebelum overlay loading (fase scanning)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !analysisMode || analysisPhase !== 'scanning' || !primaryId) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const loc = MONITORING_LOCATIONS.find((l) => l.id === primaryId);
    if (!loc) return;

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(t);
    };

    map.flyTo([loc.lat, loc.lng], 13, { duration: 1.0, easeLinearity: 0.25 });

    const pans: [number, number][] = [
      [110, 0],
      [-220, 0],
      [110, -75],
      [0, 150],
      [0, -75],
    ];

    let delay = 1100;
    pans.forEach(([x, y]) => {
      schedule(() => {
        map.panBy(L.point(x, y), { animate: true, duration: 0.6 });
      }, delay);
      delay += 620;
    });

    schedule(() => {
      map.flyTo([loc.lat, loc.lng], 13, { duration: 0.75, easeLinearity: 0.25 });
    }, delay);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [analysisPhase, primaryId, isReady, analysisMode]);

  // Scan animation — cycle markers (non-analisis saja)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !interactive || analysisMode) return;

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (!isScanning || highlightIds.length === 0) return;

    let idx = 0;
    const cycle = () => {
      const id = highlightIds[idx % highlightIds.length];
      const loc = MONITORING_LOCATIONS.find((l) => l.id === id);
      if (loc) {
        map.closePopup();
        map.flyTo([loc.lat, loc.lng], 13, { duration: 0.8, easeLinearity: 0.3 });
      }
      idx++;
    };

    cycle();
    scanIntervalRef.current = setInterval(cycle, 1400);

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [isScanning, highlightIds, isReady, interactive, analysisMode]);

  // Full map page flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || interactive) return;
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, isReady, interactive]);

  return (
    <div
      className={cn('relative', analysisMode && 'analysis-map-mode', className)}
      style={{ height }}
    >
      <div
        ref={containerRef}
        className="h-full w-full rounded-[inherit] z-0"
        style={{ minHeight: 120 }}
      />

      {!isReady && (
        <div className="absolute inset-0 bg-muted/10 animate-pulse rounded-[inherit] z-[1]" />
      )}

      {isScanning && analysisPhase !== 'scanning' && (
        <div className="absolute inset-0 z-[500] pointer-events-none rounded-[inherit] overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          {showScanBanner && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-background/90 border border-primary/30 px-3 py-1.5 text-[11px] text-primary shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              Menganalisis lokasi di peta...
            </div>
          )}
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
          <div className="pointer-events-auto">
            <RiskLegend />
          </div>
        </div>
      )}
    </div>
  );
}
