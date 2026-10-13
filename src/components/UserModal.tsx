import React from 'react';
import { X, User, Cpu, ShieldCheck, Phone, Calendar, RefreshCcw } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  planLimitGB: number;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, planLimitGB }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
            JD
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">John Doe (Subscriber)</h3>
            <p className="text-xs text-slate-500">CSE / IT Demo Environment</p>
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              MSISDN (Cellular Number)
            </span>
            <span className="font-bold text-slate-900 font-mono">+1 (555) 019-2834</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SIM Status & IMSI
            </span>
            <span className="font-bold text-emerald-700 font-mono">ACTIVE (eSIM #8901)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Cycle Reset Date
            </span>
            <span className="font-bold text-slate-900">October 20, 2026 (in 7 days)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5 text-blue-600" />
              Active Tier
            </span>
            <span className="font-bold text-blue-600">{planLimitGB} GB 5G High-Speed Data</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
