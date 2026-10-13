import React from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  Gauge,
  Calendar,
  Calculator,
  LayoutGrid,
  RotateCcw,
  Info,
} from 'lucide-react';
import { DailyLog } from '../types/telemetry';

interface TelemetryInputsProps {
  planLimitGB: number;
  setPlanLimitGB: (val: number) => void;
  dailyLogs: DailyLog[];
  onUpdateDailyLog: (dayIndex: number, val: number) => void;
  onCalculate: () => void;
  onLoadSample: () => void;
  onReset: () => void;
}

export const TelemetryInputs: React.FC<TelemetryInputsProps> = ({
  planLimitGB,
  setPlanLimitGB,
  dailyLogs,
  onUpdateDailyLog,
  onCalculate,
  onLoadSample,
  onReset,
}) => {
  // Determine highest consumption day for "(Peak)" indicator
  const maxUsage = Math.max(...dailyLogs.map((d) => d.usageGB || 0));

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-6">
      {/* Top Header of the card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Telemetry Inputs & Plan Quota
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter subscriber monthly ceiling and 7-day recorded cellular usage
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/70 rounded-full text-xs text-slate-600 self-start sm:self-center font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Validation: Non-negative Float (GB)</span>
        </div>
      </div>

      {/* Main Inputs: Plan Limit and 7-Day Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-5 items-stretch">
        {/* Left: Monthly Plan Limit (GB) */}
        <div className="lg:col-span-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 tracking-wide">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Monthly Plan Limit (GB)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Maximum billing quota</p>
          </div>

          <div className="mt-3 relative flex items-center">
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={planLimitGB || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPlanLimitGB(isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xl font-bold text-slate-900 tabular-nums focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              placeholder="20"
            />
            <span className="absolute right-3.5 text-xs font-bold text-slate-500 pointer-events-none uppercase">
              GB
            </span>
          </div>
        </div>

        {/* Right: 7-Day Cellular Log */}
        <div className="lg:col-span-9 bg-slate-50/70 rounded-xl p-4 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 tracking-wide">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>7-Day Cellular Log (Daily Consumption in Gigabytes)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mt-3">
            {dailyLogs.map((log, index) => {
              const isPeak = maxUsage > 0 && log.usageGB === maxUsage;
              return (
                <div
                  key={log.day}
                  className={`flex flex-col p-2 rounded-lg border transition-all ${
                    isPeak
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <label className="text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
                    <span>Day {log.day}</span>
                    {isPeak && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded-sm">
                        Peak
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={log.usageGB}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateDailyLog(index, isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className={`w-full text-center text-sm font-bold tabular-nums rounded py-1 px-1 bg-transparent focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                      isPeak ? 'text-amber-900 font-extrabold' : 'text-slate-900'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onCalculate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate Usage</span>
          </button>

          <button
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Fields</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Updates summary cards, threshold alerts & chart</span>
        </div>
      </div>
    </section>
  );
};
