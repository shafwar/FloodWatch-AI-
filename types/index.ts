// =============================================================================
// FloodWatch Semarang — Type Definitions
// =============================================================================

// ---------------------------------------------------------------------------
// Weather & Core Data Types
// ---------------------------------------------------------------------------

export type WeatherCondition =
  | 'Cerah'
  | 'Cerah Berawan'
  | 'Berawan'
  | 'Berawan Tebal'
  | 'Hujan Ringan'
  | 'Hujan Sedang'
  | 'Hujan Lebat'
  | 'Hujan Sangat Lebat';

export type ForecastWindow = 'Saat Ini' | '1 Jam Sebelum' | '1 Jam Kedepan' | '3 Jam Kedepan' | '6 Jam Kedepan';

export interface WeatherRecord {
  id: string;
  daerah: string;
  keterangan: ForecastWindow | string;
  waktu: string;
  kondisi: WeatherCondition;
  suhu_c: number;
  kelembapan: number;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Location Types
// ---------------------------------------------------------------------------

export interface MonitoringLocation {
  id: string;
  name: string;
  kode: string;
  lat: number;
  lng: number;
  district: string;
  kelurahan: string;
}

// ---------------------------------------------------------------------------
// Flood Risk Types
// ---------------------------------------------------------------------------

export type FloodLevel = 'AMAN' | 'WASPADA' | 'SIAGA' | 'BAHAYA';

export interface FloodRiskResult {
  score: number;
  level: FloodLevel;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Alert Types
// ---------------------------------------------------------------------------

export type AlertSeverity = 'information' | 'warning' | 'critical' | 'emergency';
export type AlertStatus = 'active' | 'resolved' | 'acknowledged';

export interface FloodAlert {
  id: string;
  locationId: string;
  daerah: string;
  kondisi: WeatherCondition;
  floodLevel: FloodLevel;
  floodScore: number;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  timestamp: string;
  resolvedAt?: string;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Dashboard / KPI Types
// ---------------------------------------------------------------------------

export interface KPIData {
  totalLocations: number;
  activeAlerts: number;
  highRiskAreas: number;
  avgTemperature: number;
  avgHumidity: number;
  lastUpdate: string;
}

// ---------------------------------------------------------------------------
// Chart / Analytics Types
// ---------------------------------------------------------------------------

export interface TemperatureDataPoint {
  time: string;
  [location: string]: number | string;
}

export interface HumidityDataPoint {
  time: string;
  [location: string]: number | string;
}

export interface RiskTrendPoint {
  time: string;
  aman: number;
  waspada: number;
  siaga: number;
  bahaya: number;
}

export interface WeatherDistributionItem {
  name: WeatherCondition;
  value: number;
  color: string;
}

// ---------------------------------------------------------------------------
// Realtime / Connection Types
// ---------------------------------------------------------------------------

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export type WeatherDataSource = 'bmkg' | 'csv' | 'hybrid';
export type BmkgStatus = 'online' | 'degraded' | 'offline';

export interface WeatherMeta {
  source: WeatherDataSource;
  bmkgStatus: BmkgStatus;
  activeSlot: string | null;
  nextSlotChange: string;
  fetchedAt: string;
  cacheExpiresAt: string;
  lastBmkgProbe: string;
  nextRetryAt: string | null;
  locationsOnline: number;
  locationsTotal: number;
  bmkgAnalysisDate: string | null;
}

export interface WeatherApiResponse {
  records: WeatherRecord[];
  historicalRecords: WeatherRecord[];
  meta: WeatherMeta;
}

export interface RealtimeState {
  connectionStatus: ConnectionStatus;
  lastUpdate: string | null;
  updateCount: number;
  meta: WeatherMeta | null;
}

// ---------------------------------------------------------------------------
// Map Types
// ---------------------------------------------------------------------------

export interface MapMarkerData {
  location: MonitoringLocation;
  weather: WeatherRecord | null;
  risk: FloodRiskResult | null;
}

// ---------------------------------------------------------------------------
// History Types
// ---------------------------------------------------------------------------

export interface HistoryRecord extends WeatherRecord {
  floodScore: number;
  floodLevel: FloodLevel;
}

// ---------------------------------------------------------------------------
// Forecast Types
// ---------------------------------------------------------------------------

export interface ForecastEntry {
  locationId: string;
  daerah: string;
  keterangan: string;
  waktu: string;
  kondisi: WeatherCondition;
  suhu_c: number;
  kelembapan: number;
  floodScore: number;
  floodLevel: FloodLevel;
}

// ---------------------------------------------------------------------------
// Settings Types
// ---------------------------------------------------------------------------

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  refreshInterval: number; // seconds
  mapStyle: 'standard' | 'satellite' | 'terrain';
  notifications: boolean;
  soundAlerts: boolean;
  autoCenter: boolean;
}
