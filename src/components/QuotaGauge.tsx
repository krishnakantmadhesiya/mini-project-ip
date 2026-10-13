import React from 'react';
import { GitCommit, AlertCircle } from 'lucide-react';
import { ThresholdStatus } from '../types/telemetry';

interface QuotaGaugeProps {
  percentage: number;
  planLimitGB: number;
  totalUsedGB: number;
  status: ThresholdStatus;
  warningThresholdPercent?: number; // default 90%
}

export const QuotaGauge: React.FC<QuotaGaugeProps> = ({
  percentage,
  planLimitGB,
  status,
  warningThresholdPercent = 90,
}) => {
  const clampedPercent = Math.min(Math.max(percentage, 0), 100);
  const formattedPercent = percentage.toFixed(1);
  const formattedLimit = planLimitGB.toFixed(1);

  // Bar Fill Color
  let barColorClass = 'bg-blue-600';
  if (status === 'warning') {
    barColorClass = 'bg-amber-700';
  } else if (status === 'exceeded') {
    barColorClass = 'bg-rose-600';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-blue-600 rotate-90" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Quota Consumption Gauge
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-blue-100 tabular-nums">
            {formattedPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Automated threshold trigger monitors ratio of cumulative daily byte transfers against total allocated envelope.
        </p>

        {/* Gauge Visualization */}
        <div className="mt-8 mb-6 relative">
          {/* Threshold marker label at 90% */}
          <div
            className="absolute -top-7 text-center -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${warningThresholdPercent}%` }}
          >
            <span className="text-[11px] font-extrabold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 shadow-2xs whitespace-nowrap">
              {warningThresholdPercent}% Alert
            </span>
            <div className="w-0.5 h-1.5 bg-amber-700" />
          </div>

          {/* Bar track */}
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/80">
            {/* 90% Alert vertical line inside track */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-600/70 z-10"
              style={{ left: `${warningThresholdPercent}%` }}
              title={`Warning threshold trigger: ${warningThresholdPercent}%`}
            />

            {/* Filled progress */}
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
              style={{ width: `${clampedPercent}%` }}
            />
          </div>

          {/* Scale labels below gauge */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-2">
            <span>0 GB (0%)</span>
            <span className="text-amber-800 font-bold">
              {warningThresholdPercent}% Warning Threshold
            </span>
            <span>{formattedLimit} GB (100%)</span>
          </div>
        </div>
      </div>

      {/* Bottom: State Logic Rule Box */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 mt-4">
        <div className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-2">
          STATE LOGIC RULE
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* < 90% Normal */}
          <div
            className={`py-1.5 px-2 rounded-lg text-center text-xs font-bold transition-all border ${
              status === 'normal'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-white text-emerald-700 border-slate-200'
            }`}
          >
            &lt; 90% Normal
          </div>

          {/* 90% - 99.9% Warning */}
          <div
            className={`py-1.5 px-2 rounded-lg text-center text-xs font-bold transition-all border ${
              status === 'warning'
                ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-500/30 shadow-xs'
                : 'bg-white text-amber-800 border-slate-200'
            }`}
          >
            90% - 99.9% Warning
          </div>

          {/* >= 100% Exceeded */}
          <div
            className={`py-1.5 px-2 rounded-lg text-center text-xs font-bold transition-all border ${
              status === 'exceeded'
                ? 'bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-500/30 shadow-xs'
                : 'bg-white text-rose-700 border-slate-200'
            }`}
          >
            &ge; 100% Exceeded
          </div>
        </div>
      </div>
    </div>
  );
};
