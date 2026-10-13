import React from 'react';
import { PlayCircle } from 'lucide-react';

interface PageHeaderProps {
  onLoadSample: () => void;
  sampleLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  onLoadSample,
  sampleLabel = 'Load Sample Demo Data (20 GB Demo)',
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 pt-2">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mobile Data Usage Tracker
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-500 font-normal">
          Weekly Cellular & Mobile Data Consumption Analytics Dashboard
        </p>
      </div>

      <div className="shrink-0">
        <button
          onClick={onLoadSample}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlayCircle className="w-4 h-4 fill-white/20" />
          <span>{sampleLabel}</span>
        </button>
      </div>
    </div>
  );
};
