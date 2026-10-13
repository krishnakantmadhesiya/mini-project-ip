import { DailyLog, AppUsageItem, CarrierProfile } from '../types/telemetry';

export const DEFAULT_PLAN_LIMIT_GB = 20;

export const DEFAULT_DAILY_LOGS: DailyLog[] = [
  { day: 1, label: 'Day 1', usageGB: 2, dateStr: 'Mon, Oct 7' },
  { day: 2, label: 'Day 2', usageGB: 3, dateStr: 'Tue, Oct 8' },
  { day: 3, label: 'Day 3', usageGB: 2, dateStr: 'Wed, Oct 9' },
  { day: 4, label: 'Day 4', usageGB: 3, dateStr: 'Thu, Oct 10' },
  { day: 5, label: 'Day 5', usageGB: 2, dateStr: 'Fri, Oct 11' },
  { day: 6, label: 'Day 6', usageGB: 3, dateStr: 'Sat, Oct 12' },
  { day: 7, label: 'Day 7', usageGB: 4, dateStr: 'Sun, Oct 13' },
];

export const PRESET_DATASETS = {
  twentyGbDemo: {
    name: '20 GB Demo (95.0% Warning)',
    limitGB: 20,
    dailyLogs: [2, 3, 2, 3, 2, 3, 4],
  },
  fifteenGbNormal: {
    name: '15 GB Normal (60.0% Normal)',
    limitGB: 25,
    dailyLogs: [2, 2.5, 1.8, 2.2, 2, 2.3, 2.2],
  },
  twentyFiveGbExceeded: {
    name: '25 GB Plan (105.0% Exceeded)',
    limitGB: 20,
    dailyLogs: [2.5, 3.5, 3.0, 4.0, 2.5, 3.0, 2.5],
  },
  lightUser: {
    name: '10 GB Light Saver (45.0% Safe)',
    limitGB: 10,
    dailyLogs: [0.5, 0.8, 0.6, 0.7, 0.5, 0.9, 0.5],
  },
};

export const INITIAL_APP_USAGE: AppUsageItem[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Streaming',
    usageGB: 4.8,
    iconName: 'video',
    color: '#ef4444',
    backgroundDataGB: 0.6,
    foregroundDataGB: 4.2,
    restricted: false,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Streaming',
    usageGB: 3.2,
    iconName: 'film',
    color: '#e11d48',
    backgroundDataGB: 0.2,
    foregroundDataGB: 3.0,
    restricted: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    usageGB: 3.1,
    iconName: 'camera',
    color: '#ec4899',
    backgroundDataGB: 0.9,
    foregroundDataGB: 2.2,
    restricted: false,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social',
    usageGB: 2.8,
    iconName: 'music',
    color: '#06b6d4',
    backgroundDataGB: 0.4,
    foregroundDataGB: 2.4,
    restricted: false,
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    category: 'Web & Cloud',
    usageGB: 1.8,
    iconName: 'globe',
    color: '#3b82f6',
    backgroundDataGB: 0.3,
    foregroundDataGB: 1.5,
    restricted: false,
  },
  {
    id: 'drive',
    name: 'Google Drive & Photos',
    category: 'Web & Cloud',
    usageGB: 1.4,
    iconName: 'cloud',
    color: '#10b981',
    backgroundDataGB: 1.1,
    foregroundDataGB: 0.3,
    restricted: false,
  },
  {
    id: 'hotspot',
    name: 'Personal Hotspot / Tethering',
    category: 'System & Hotspot',
    usageGB: 1.1,
    iconName: 'wifi',
    color: '#8b5cf6',
    backgroundDataGB: 0.1,
    foregroundDataGB: 1.0,
    restricted: false,
  },
  {
    id: 'spotify',
    name: 'Spotify & Podcasts',
    category: 'Streaming',
    usageGB: 0.8,
    iconName: 'headphones',
    color: '#22c55e',
    backgroundDataGB: 0.2,
    foregroundDataGB: 0.6,
    restricted: false,
  },
];

export const CARRIER_PROFILES: CarrierProfile[] = [
  {
    id: 't-mobile',
    name: 'T-Mobile 5G Ultra Wideband',
    defaultQuotaGB: 20,
    cycleDaysRemaining: 7,
    speedTier: '5G Full Throttle',
  },
  {
    id: 'verizon',
    name: 'Verizon 5G Do More',
    defaultQuotaGB: 25,
    cycleDaysRemaining: 12,
    speedTier: 'Premium Network Access',
  },
  {
    id: 'att',
    name: 'AT&T Unlimited Extra',
    defaultQuotaGB: 30,
    cycleDaysRemaining: 5,
    speedTier: '5G Fast Cap',
  },
  {
    id: 'jio',
    name: 'Jio True 5G Prime',
    defaultQuotaGB: 20,
    cycleDaysRemaining: 9,
    speedTier: 'True 5G Standalone',
  },
];
