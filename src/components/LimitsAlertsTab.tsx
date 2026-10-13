import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Shield,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Smartphone,
  Flame,
  Send,
} from 'lucide-react';
import { CARRIER_PROFILES } from '../data/sampleData';
import { DailyLog } from '../types/telemetry';

interface LimitsAlertsTabProps {
  warningThreshold: number;
  setWarningThreshold: (val: number) => void;
  planLimitGB: number;
  setPlanLimitGB: (val: number) => void;
  dailyLogs: DailyLog[];
  onTriggerNotificationTest: () => void;
}

export const LimitsAlertsTab: React.FC<LimitsAlertsTabProps> = ({
  warningThreshold,
  setWarningThreshold,
  planLimitGB,
  setPlanLimitGB,
  dailyLogs,
  onTriggerNotificationTest,
}) => {
  const [selectedCarrier, setSelectedCarrier] = useState('t-mobile');
  const [dailySpikeThresholdGB, setDailySpikeThresholdGB] = useState(3.5);
  const [hardCapThrottleEnabled, setHardCapThrottleEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleSelectCarrier = (id: string) => {
    setSelectedCarrier(id);
    const profile = CARRIER_PROFILES.find((c) => c.id === id);
    if (profile) {
      setPlanLimitGB(profile.defaultQuotaGB);
    }
  };

  const handleExportCSV = () => {
    const totalGB = dailyLogs.reduce((sum, d) => sum + d.usageGB, 0);
    const rows = [
      ['Mobile Data Usage Tracker - Weekly Report'],
      ['Generated Date', new Date().toISOString()],
      ['Monthly Plan Limit (GB)', planLimitGB.toString()],
      ['Warning Threshold (%)', warningThreshold.toString()],
      ['Total 7-Day Usage (GB)', totalGB.toFixed(2)],
      ['Remaining Quota (GB)', Math.max(0, planLimitGB - totalGB).toFixed(2)],
      [''],
      ['Day', 'Label', 'Usage (GB)'],
      ...dailyLogs.map((d) => [d.day.toString(), d.label, d.usageGB.toString()]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((x) => `"${x}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_usage_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Weekly report CSV exported successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportJSON = () => {
    const totalGB = dailyLogs.reduce((sum, d) => sum + d.usageGB, 0);
    const exportObject = {
      timestamp: new Date().toISOString(),
      planLimitGB,
      warningThresholdPercent: warningThreshold,
      totalWeeklyUsageGB: totalGB,
      remainingGB: Math.max(0, planLimitGB - totalGB),
      usagePercent: ((totalGB / planLimitGB) * 100).toFixed(2),
      dailyLogs,
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cellular_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Telemetry JSON configuration exported!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Threshold & Sentinel Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Sentinel Threshold Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Adjust automated warnings and daily spike alerts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Warning Threshold Slider */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Monthly Quota Warning Trigger</span>
              </label>
              <span className="text-sm font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md tabular-nums">
                {warningThreshold}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Activates the amber warning banner and notification hooks when cumulative byte transfers cross this threshold.
            </p>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span>50% (Conservative)</span>
              <span className="text-blue-600 font-bold">90% (Recommended)</span>
              <span>95% (Aggressive)</span>
            </div>
          </div>

          {/* Daily Spike Ceiling */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Single-Day Spike Ceiling</span>
              </label>
              <span className="text-sm font-extrabold text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md tabular-nums">
                {dailySpikeThresholdGB} GB / day
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Highlights outlier days in amber on the 7-day histogram when single-day consumption exceeds this amount.
            </p>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.5"
              value={dailySpikeThresholdGB}
              onChange={(e) => setDailySpikeThresholdGB(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span>2.0 GB</span>
              <span className="text-blue-600 font-bold">3.5 GB (Default)</span>
              <span>6.0 GB</span>
            </div>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Enforce Hard Quota Throttle
                </div>
                <div className="text-[11px] text-slate-500">
                  Cap downstream socket speed to 128 kbps upon 100% exhaustion
                </div>
              </div>
            </div>
            <button
              onClick={() => setHardCapThrottleEnabled(!hardCapThrottleEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                hardCapThrottleEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
                  hardCapThrottleEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Simulate Push & SMS Alerts
                </div>
                <div className="text-[11px] text-slate-500">
                  Broadcast notification hook on threshold breach
                </div>
              </div>
            </div>
            <button
              onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                smsAlertsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
                  smsAlertsEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Test Alert Button */}
        <div className="mt-5 flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Sentinel Trigger Verification
              </div>
              <div className="text-[11px] text-slate-500">
                Fire an instant mock alert payload to verify UI and browser notification hooks
              </div>
            </div>
          </div>
          <button
            onClick={onTriggerNotificationTest}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Alert Now</span>
          </button>
        </div>
      </div>

      {/* Carrier Profiles & Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Carrier Preset Profiles
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Quickly configure monthly quotas based on popular cellular data tiers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {CARRIER_PROFILES.map((carrier) => (
            <button
              key={carrier.id}
              onClick={() => handleSelectCarrier(carrier.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedCarrier === carrier.id
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{carrier.name}</div>
              <div className="text-sm font-extrabold text-blue-600 mt-1">
                {carrier.defaultQuotaGB} GB Cap
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {carrier.cycleDaysRemaining} days remaining in cycle
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export & Data Archival */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Export Telemetry Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download recorded consumption metrics and calculations for CSE/IT demo reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
