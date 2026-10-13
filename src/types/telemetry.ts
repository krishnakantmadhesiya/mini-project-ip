export interface DailyLog {
  day: number;
  label: string;
  usageGB: number;
  dateStr?: string;
}

export type ThresholdStatus = 'normal' | 'warning' | 'exceeded';

export interface TelemetryState {
  planLimitGB: number;
  dailyLogs: DailyLog[];
  warningThresholdPercent: number; // default 90%
  liveTelemetryActive: boolean;
}

export interface AppUsageItem {
  id: string;
  name: string;
  category: 'Streaming' | 'Social' | 'Web & Cloud' | 'System & Hotspot' | 'Gaming';
  usageGB: number;
  iconName: string;
  color: string;
  backgroundDataGB: number;
  foregroundDataGB: number;
  restricted: boolean;
}

export interface CarrierProfile {
  id: string;
  name: string;
  defaultQuotaGB: number;
  cycleDaysRemaining: number;
  speedTier: string;
}
