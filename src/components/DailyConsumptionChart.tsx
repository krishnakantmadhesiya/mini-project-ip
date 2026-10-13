import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { DailyLog } from '../types/telemetry';

interface DailyConsumptionChartProps {
  dailyLogs: DailyLog[];
  totalUsedGB: number;
}

export const DailyConsumptionChart: React.FC<DailyConsumptionChartProps> = ({
  dailyLogs,
  totalUsedGB,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Find peak day
  const maxUsage = Math.max(...dailyLogs.map((d) => d.usageGB || 0));
  const peakLog = dailyLogs.find((d) => d.usageGB === maxUsage && maxUsage > 0);

  // Base scale height calculation (max 100%, min height for visual balance)
  const chartCeiling = Math.max(maxUsage * 1.25, 4.5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              7-Day Daily Consumption Distribution
            </h3>
          </div>
          {peakLog && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs rounded-md shadow-2xs whitespace-nowrap">
              Peak: Day {peakLog.day} ({peakLog.usageGB.toFixed(1)} GB)
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Dynamic vertical bar histogram visualizing relative daily bandwidth strain.
        </p>

        {/* Visual Histogram Chart Area */}
        <div className="mt-6 bg-[#eff4ff]/60 rounded-xl p-4 sm:p-5 border border-blue-100/80">
          <div className="h-56 sm:h-60 flex items-end justify-between gap-2 sm:gap-3 px-1 sm:px-4 pt-6 pb-2">
            {dailyLogs.map((log) => {
              const isPeak = maxUsage > 0 && log.usageGB === maxUsage;
              const heightPercent = chartCeiling > 0 ? (log.usageGB / chartCeiling) * 100 : 0;
              const isHovered = hoveredDay === log.day;
              const percentOfWeek = totalUsedGB > 0 ? ((log.usageGB / totalUsedGB) * 100).toFixed(1) : '0';

              return (
                <div
                  key={log.day}
                  onMouseEnter={() => setHoveredDay(log.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-md px-2.5 py-1.5 shadow-lg whitespace-nowrap flex flex-col items-center pointer-events-none">
                      <span className="font-bold">
                        Day {log.day}: {log.usageGB.toFixed(1)} GB
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {percentOfWeek}% of weekly total {log.dateStr ? `• ${log.dateStr}` : ''}
                      </span>
                      <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
                    </div>
                  )}

                  {/* Value label on top of bar */}
                  <span
                    className={`text-[11px] sm:text-xs font-bold mb-1.5 tabular-nums transition-colors ${
                      isPeak ? 'text-amber-900 font-extrabold' : 'text-slate-700'
                    }`}
                  >
                    {log.usageGB.toFixed(1)}G
                  </span>

                  {/* The Bar */}
                  <div className="w-full max-w-[42px] flex items-end justify-center h-full">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isPeak
                          ? 'bg-[#784b00] hover:bg-[#603b00] shadow-xs'
                          : 'bg-[#004ac6] hover:bg-[#003da6]'
                      }`}
                      style={{
                        height: `${Math.max(heightPercent, 4)}%`,
                      }}
                    />
                  </div>

                  {/* Day label on X-axis */}
                  <span
                    className={`text-[11px] sm:text-xs font-semibold mt-2.5 transition-colors ${
                      isPeak
                        ? 'text-blue-700 font-bold'
                        : isHovered
                        ? 'text-slate-900 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    Day {log.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-between text-xs text-slate-600 mt-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6] inline-block" />
          <span className="text-slate-700 font-medium">Blue Bar: Standard Daily Usage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#784b00] inline-block" />
          <span className="text-slate-700 font-medium">Amber Bar: Peak Daily Spike</span>
        </div>
      </div>
    </div>
  );
};
