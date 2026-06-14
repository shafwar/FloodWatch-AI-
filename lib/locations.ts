// =============================================================================
// FloodWatch Semarang — Monitoring Locations Configuration
// 10 observation points across Semarang with realistic WGS84 coordinates
// =============================================================================

import type { MonitoringLocation } from '@/types';

export const MONITORING_LOCATIONS: MonitoringLocation[] = [
  {
    id: 'semarang-tengah-miroto',
    name: 'Semarang Tengah (Miroto)',
    kode: '33.74.01.1001',
    lat: -6.9875,
    lng: 110.4205,
    district: 'Semarang Tengah',
    kelurahan: 'Miroto',
  },
  {
    id: 'semarang-utara-bandarharjo',
    name: 'Semarang Utara (Bandarharjo)',
    kode: '33.74.02.1001',
    lat: -6.9591,
    lng: 110.4163,
    district: 'Semarang Utara',
    kelurahan: 'Bandarharjo',
  },
  {
    id: 'tembalang',
    name: 'Tembalang (Kel. Tembalang)',
    kode: '33.74.10.1006',
    lat: -7.0576,
    lng: 110.4385,
    district: 'Tembalang',
    kelurahan: 'Tembalang',
  },
  {
    id: 'wonodri',
    name: 'Semarang Selatan (Wonodri)',
    kode: '33.74.07.1006',
    lat: -7.0062,
    lng: 110.4152,
    district: 'Semarang Selatan',
    kelurahan: 'Wonodri',
  },
  {
    id: 'candi',
    name: 'Candisari (Candi)',
    kode: '33.74.08.1001',
    lat: -7.0185,
    lng: 110.4097,
    district: 'Candisari',
    kelurahan: 'Candi',
  },
  {
    id: 'jatingaleh',
    name: 'Candisari (Jatingaleh)',
    kode: '33.74.08.1002',
    lat: -7.0312,
    lng: 110.4029,
    district: 'Candisari',
    kelurahan: 'Jatingaleh',
  },
  {
    id: 'gemah',
    name: 'Pedurungan (Gemah)',
    kode: '33.74.06.1007',
    lat: -7.0082,
    lng: 110.4521,
    district: 'Pedurungan',
    kelurahan: 'Gemah',
  },
  {
    id: 'pedurungan-kidul',
    name: 'Pedurungan (Pedurungan Kidul)',
    kode: '33.74.06.1008',
    lat: -7.0198,
    lng: 110.4612,
    district: 'Pedurungan',
    kelurahan: 'Pedurungan Kidul',
  },
  {
    id: 'banyumanik',
    name: 'Banyumanik (Kel. Banyumanik)',
    kode: '33.74.11.1005',
    lat: -7.0643,
    lng: 110.4248,
    district: 'Banyumanik',
    kelurahan: 'Banyumanik',
  },
  {
    id: 'srondol-kulon',
    name: 'Banyumanik (Srondol Kulon)',
    kode: '33.74.11.1006',
    lat: -7.0756,
    lng: 110.4076,
    district: 'Banyumanik',
    kelurahan: 'Srondol Kulon',
  },
];

export const LOCATION_MAP = Object.fromEntries(
  MONITORING_LOCATIONS.map((loc) => [loc.id, loc])
);

export const LOCATION_BY_NAME = Object.fromEntries(
  MONITORING_LOCATIONS.map((loc) => [loc.name, loc])
);

export const SEMARANG_CENTER: [number, number] = [-7.0051, 110.4381];
export const DEFAULT_ZOOM = 12;
