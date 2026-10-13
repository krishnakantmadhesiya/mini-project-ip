import React, { useState } from 'react';
import {
  PieChart,
  Film,
  Camera,
  Globe,
  Wifi,
  Headphones,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { AppUsageItem } from '../types/telemetry';

interface AppBreakdownTabProps {
  apps: AppUsageItem[];
  totalWeeklyGB: number;
  onToggleRestrict: (appId: string) => void;
  dataSaverActive: boolean;
  onToggleDataSaver: () => void;
}

export const AppBreakdownTab: React.FC<AppBreakdownTabProps> = ({
  apps,
  totalWeeklyGB,
  onToggleRestrict,
  dataSaverActive,
  onToggleDataSaver,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter apps
  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Category aggregates
  const categories = ['All', 'Streaming', 'Social', 'Web & Cloud', 'System & Hotspot'];
  
  // Calculate total consumed by apps
  const appTotalGB = apps.reduce((sum, a) => {
    const factor = dataSaverActive && a.category === 'Streaming' ? 0.65 : 1;
    return sum + a.usageGB * factor;
  }, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Streaming':
        return <Film className="w-4 h-4 text-rose-500" />;
      case 'Social':
        return <Camera className="w-4 h-4 text-pink-500" />;
      case 'Web & Cloud':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'System & Hotspot':
        return <Wifi className="w-4 h-4 text-purple-500" />;
      default:
        return <PieChart className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Feature Callout */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
              Application Telemetry
            </span>
            <span className="text-xs text-slate-500 font-medium">Per-Package Socket Analyzer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            High-Bandwidth App Traffic Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Identify apps driving the 7-day usage peak. Streaming services represent {((8.0 / appTotalGB) * 100).toFixed(0)}% of cumulative transfers.
          </p>
        </div>

        {/* Data Saver Mode Switch */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Cellular Data Saver</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {dataSaverActive ? 'Saves ~35% on video bitrates' : 'Full resolution allowed'}
            </div>
          </div>
          <button
            onClick={onToggleDataSaver}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              dataSaverActive ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                dataSaverActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Category Distribution Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Category Share</span>
          <span className="text-xs text-slate-500 font-normal">
            Total App Consumption: <strong className="text-slate-900 font-bold">{appTotalGB.toFixed(1)} GB</strong>
          </span>
        </h3>

        {/* Stacked Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-2xs">
          <div
            style={{ width: '42%' }}
            className="bg-rose-500 hover:bg-rose-600 transition-colors"
            title="Streaming: 42%"
          />
          <div
            style={{ width: '31%' }}
            className="bg-pink-500 hover:bg-pink-600 transition-colors"
            title="Social: 31%"
          />
          <div
            style={{ width: '17%' }}
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
            title="Web & Cloud: 17%"
          />
          <div
            style={{ width: '10%' }}
            className="bg-purple-500 hover:bg-purple-600 transition-colors"
            title="System & Hotspot: 10%"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-700 font-medium">Streaming (42%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
            <span className="text-slate-700 font-medium">Social (31%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-slate-700 font-medium">Web & Cloud (17%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-700 font-medium">Hotspot & System (10%)</span>
          </div>
        </div>
      </div>

      {/* Apps Filter and Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Apps List */}
        <div className="divide-y divide-slate-100">
          {filteredApps.map((app) => {
            const effectiveUsage =
              dataSaverActive && app.category === 'Streaming'
                ? app.usageGB * 0.65
                : app.usageGB;
            const percentOfTotal =
              totalWeeklyGB > 0 ? ((effectiveUsage / totalWeeklyGB) * 100).toFixed(1) : '0';

            return (
              <div
                key={app.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${app.color}15`, color: app.color }}
                  >
                    {getCategoryIcon(app.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                      {app.restricted && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-sm">
                          Background Restricted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{app.category}</span>
                      <span>•</span>
                      <span>Foreground: {app.foregroundDataGB.toFixed(1)} GB</span>
                      <span>•</span>
                      <span>Background: {app.backgroundDataGB.toFixed(1)} GB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                      {effectiveUsage.toFixed(1)} GB
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {percentOfTotal}% of total week
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleRestrict(app.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      app.restricted
                        ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {app.restricted ? 'Lift Restriction' : 'Restrict Background'}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              No applications match "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
