import React from 'react';
import { BarChart2, User, Radio, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'breakdown' | 'alerts';
  setActiveTab: (tab: 'overview' | 'breakdown' | 'alerts') => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  onOpenUserModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  setIsLive,
  onOpenUserModal,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Left */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <BarChart2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 leading-tight">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Mobile Data Usage
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Tracker
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Mini-Project • CSE / IT Demo
            </span>
          </div>
        </div>

        {/* Center: Live Telemetry Indicator / Toggle */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsLive(!isLive)}
            title="Click to toggle simulated live telemetry packets"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
              isLive
                ? 'bg-blue-50/80 text-emerald-700 border border-emerald-200/60 shadow-xs hover:bg-emerald-50'
                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] font-bold text-emerald-800">
              {isLive ? 'LIVE TELEMETRY' : 'TELEMETRY PAUSED'}
            </span>
            <Activity className="w-3.5 h-3.5 ml-0.5 text-emerald-600" />
          </button>
        </div>

        {/* Right: Tabs & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/60">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap ${
                activeTab === 'breakdown'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              App Breakdown
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Limits & Alerts
            </button>
          </nav>

          {/* User Avatar button */}
          <button
            onClick={onOpenUserModal}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            title="Subscriber Account & SIM Profile"
            aria-label="Subscriber Account"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
