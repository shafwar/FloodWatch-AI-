// =============================================================================
// FloodWatch Semarang — Weather Condition Mappings
// =============================================================================

import type { WeatherCondition } from '@/types';

export interface ConditionConfig {
  label: WeatherCondition;
  labelEn: string;
  icon: string;          // emoji or icon name for quick rendering
  baseRiskScore: number;
  color: string;         // Tailwind color class
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const CONDITION_CONFIG: Record<WeatherCondition, ConditionConfig> = {
  'Cerah': {
    label: 'Cerah',
    labelEn: 'Clear',
    icon: '☀️',
    baseRiskScore: 0,
    color: '#22c55e',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  'Cerah Berawan': {
    label: 'Cerah Berawan',
    labelEn: 'Partly Cloudy',
    icon: '⛅',
    baseRiskScore: 10,
    color: '#84cc16',
    textColor: 'text-lime-400',
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/30',
  },
  'Berawan': {
    label: 'Berawan',
    labelEn: 'Cloudy',
    icon: '☁️',
    baseRiskScore: 20,
    color: '#94a3b8',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
  },
  'Berawan Tebal': {
    label: 'Berawan Tebal',
    labelEn: 'Overcast',
    icon: '🌥️',
    baseRiskScore: 35,
    color: '#64748b',
    textColor: 'text-slate-500',
    bgColor: 'bg-slate-600/10',
    borderColor: 'border-slate-600/30',
  },
  'Hujan Ringan': {
    label: 'Hujan Ringan',
    labelEn: 'Light Rain',
    icon: '🌦️',
    baseRiskScore: 50,
    color: '#3b82f6',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  'Hujan Sedang': {
    label: 'Hujan Sedang',
    labelEn: 'Moderate Rain',
    icon: '🌧️',
    baseRiskScore: 75,
    color: '#f59e0b',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  'Hujan Lebat': {
    label: 'Hujan Lebat',
    labelEn: 'Heavy Rain',
    icon: '⛈️',
    baseRiskScore: 90,
    color: '#f97316',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  'Hujan Sangat Lebat': {
    label: 'Hujan Sangat Lebat',
    labelEn: 'Extreme Rain',
    icon: '🌊',
    baseRiskScore: 100,
    color: '#ef4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
};

export const ALL_CONDITIONS = Object.keys(CONDITION_CONFIG) as WeatherCondition[];

export const getConditionConfig = (kondisi: string): ConditionConfig =>
  CONDITION_CONFIG[kondisi as WeatherCondition] ?? CONDITION_CONFIG['Berawan'];

export const CONDITION_CHART_COLORS: Record<WeatherCondition, string> = {
  'Cerah': '#22c55e',
  'Cerah Berawan': '#84cc16',
  'Berawan': '#94a3b8',
  'Berawan Tebal': '#64748b',
  'Hujan Ringan': '#3b82f6',
  'Hujan Sedang': '#f59e0b',
  'Hujan Lebat': '#f97316',
  'Hujan Sangat Lebat': '#ef4444',
};
