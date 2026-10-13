import React from 'react';
import {
  CreditCard,
  RefreshCw,
  BatteryMedium,
  PieChart,
} from 'lucide-react';
import { ThresholdStatus } from '../types/telemetry';

interface MetricCardsProps {
  planLimitGB: number;
  totalUsedGB: number;
  remainingGB: number;
  percentage: number;
  status: ThresholdStatus;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  planLimitGB,
  totalUsedGB,
  remainingGB,
  percentage,
  status,
}) => {
  const formattedLimit = planLimitGB.toFixed(1);
  const formattedUsed = totalUsedGB.toFixed(1);
  const formattedRemaining = remainingGB <= 0 ? '0.0' : remainingGB.toFixed(1);
  const formattedPercent = percentage.toFixed(1);

  // Status-dependent subtext and color for remaining & percentage
  let remainingSubtext = `${formattedRemaining} GB buffer remaining`;
  let remainingColorClass = 'text-amber-700';
  let percentageSubtext = 'Approaching exhaustion';
  let percentageColorClass = 'text-amber-800';

  if (status === 'normal') {
    remainingSubtext = `${formattedRemaining} GB safe headroom`;
    remainingColorClass = 'text-emerald-700';
    percentageSubtext = 'Nominal usage pace';
    percentageColorClass = 'text-slate-900';
  } else if (status === 'exceeded') {
    const overage = (totalUsedGB - planLimitGB).toFixed(1);
    remainingSubtext = `${overage} GB deficit (Over quota)`;
    remainingColorClass = 'text-rose-700';
    percentageSubtext = 'Exceeded monthly limit';
    percentageColorClass = 'text-rose-700';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {/* 1. Monthly Limit */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            MONTHLY LIMIT
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              {formattedLimit}
            </span>
            <span className="text-base font-bold text-slate-700">GB</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Configured cap for cycle
          </p>
        </div>
      </div>

      {/* 2. Total Used */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TOTAL USED
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 tabular-nums tracking-tight">
              {formattedUsed}
            </span>
            <span className="text-base font-bold text-blue-700">GB</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Sum of 7 daily logs via JS loop
          </p>
        </div>
      </div>

      {/* 3. Remaining Quota */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            REMAINING QUOTA
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight ${remainingColorClass}`}
            >
              {formattedRemaining}
            </span>
            <span className="text-base font-bold text-slate-700">GB</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            {remainingSubtext}
          </p>
        </div>
      </div>

      {/* 4. Usage Percentage */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            USAGE PERCENTAGE
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200/70">
            <PieChart className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight ${percentageColorClass}`}
            >
              {formattedPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            {percentageSubtext}
          </p>
        </div>
      </div>
    </div>
  );
};
