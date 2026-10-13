import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { ThresholdStatus } from '../types/telemetry';

interface AlertBannerProps {
  status: ThresholdStatus;
  percentage: number;
  remainingGB: number;
  totalUsedGB: number;
  planLimitGB: number;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  status,
  percentage,
  remainingGB,
  totalUsedGB,
  planLimitGB,
}) => {
  const formattedPercent = percentage.toFixed(1);

  if (status === 'exceeded') {
    const overageGB = (totalUsedGB - planLimitGB).toFixed(1);
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-700 text-white">
                CRITICAL ALERT
              </span>
              <span className="text-xs text-rose-800 font-semibold tracking-wide">
                Real-time Bandwidth Sentinel
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-rose-950">
              WARNING: Data usage has reached {formattedPercent}% of your monthly limit! Quota exceeded by {overageGB} GB!
            </p>
          </div>
        </div>

        <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-rose-200/60 w-full sm:w-auto">
          <div className="text-[10px] font-bold tracking-widest text-rose-700 uppercase">
            RESTRICTION
          </div>
          <div className="text-xs font-semibold text-rose-900">
            Active Threshold Hook
          </div>
        </div>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-800 text-white">
                WARNING
              </span>
              <span className="text-xs text-amber-800 font-semibold tracking-wide">
                Real-time Bandwidth Sentinel
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-amber-950">
              WARNING: Data usage has reached {formattedPercent}% of your monthly limit! Please monitor high-bandwidth applications.
            </p>
          </div>
        </div>

        <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200/60 w-full sm:w-auto">
          <div className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">
            MONITORING
          </div>
          <div className="text-xs font-semibold text-amber-900">
            Active Threshold Hook
          </div>
        </div>
      </div>
    );
  }

  // Normal Status
  return (
    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-700 text-white">
              NORMAL
            </span>
            <span className="text-xs text-emerald-800 font-semibold tracking-wide">
              Real-time Bandwidth Sentinel
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-950">
            NOMINAL: Data usage is at {formattedPercent}% of your monthly limit ({remainingGB.toFixed(1)} GB remaining). No throttle risk.
          </p>
        </div>
      </div>

      <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200/60 w-full sm:w-auto">
        <div className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">
          MONITORING
        </div>
        <div className="text-xs font-semibold text-emerald-900">
          Active Threshold Hook
        </div>
      </div>
    </div>
  );
};
