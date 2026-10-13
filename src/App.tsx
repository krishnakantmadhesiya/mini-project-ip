/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { PageHeader } from './components/PageHeader';
import { TelemetryInputs } from './components/TelemetryInputs';
import { AlertBanner } from './components/AlertBanner';
import { MetricCards } from './components/MetricCards';
import { QuotaGauge } from './components/QuotaGauge';
import { DailyConsumptionChart } from './components/DailyConsumptionChart';
import { AppBreakdownTab } from './components/AppBreakdownTab';
import { LimitsAlertsTab } from './components/LimitsAlertsTab';
import { UserModal } from './components/UserModal';
import {
  DEFAULT_PLAN_LIMIT_GB,
  DEFAULT_DAILY_LOGS,
  PRESET_DATASETS,
  INITIAL_APP_USAGE,
} from './data/sampleData';
import { DailyLog, ThresholdStatus, AppUsageItem } from './types/telemetry';
import { CheckCircle2, BellRing, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'alerts'>('overview');
  const [planLimitGB, setPlanLimitGB] = useState<number>(DEFAULT_PLAN_LIMIT_GB);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(DEFAULT_DAILY_LOGS);
  const [warningThreshold, setWarningThreshold] = useState<number>(90);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [dataSaverActive, setDataSaverActive] = useState<boolean>(false);
  const [apps, setApps] = useState<AppUsageItem[]>(INITIAL_APP_USAGE);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate sum of 7 daily logs via JS loop
  const totalUsedGB = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < dailyLogs.length; i++) {
      sum += Number(dailyLogs[i].usageGB) || 0;
    }
    return Math.round(sum * 100) / 100;
  }, [dailyLogs]);

  // Remaining quota
  const remainingGB = useMemo(() => {
    const rem = planLimitGB - totalUsedGB;
    return Math.round(rem * 100) / 100;
  }, [planLimitGB, totalUsedGB]);

  // Usage percentage
  const percentage = useMemo(() => {
    if (planLimitGB <= 0) return 0;
    return Math.round((totalUsedGB / planLimitGB) * 1000) / 10;
  }, [planLimitGB, totalUsedGB]);

  // Threshold Status
  const status: ThresholdStatus = useMemo(() => {
    if (percentage >= 100) return 'exceeded';
    if (percentage >= warningThreshold) return 'warning';
    return 'normal';
  }, [percentage, warningThreshold]);

  // Periodic telemetry heartbeat when live is enabled
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      // Small simulated background ping on the current day
      setDailyLogs((prev) => {
        const lastIndex = prev.length - 1;
        const currentVal = prev[lastIndex].usageGB;
        // subtle increment (0.01 GB) to demonstrate live telemetry
        const updated = Math.round((currentVal + 0.01) * 100) / 100;
        const newLogs = [...prev];
        newLogs[lastIndex] = { ...newLogs[lastIndex], usageGB: updated };
        return newLogs;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateDailyLog = (index: number, val: number) => {
    setDailyLogs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], usageGB: val };
      return copy;
    });
  };

  const handleCalculate = () => {
    showToast(`Telemetry recalculated: ${totalUsedGB.toFixed(1)} GB used of ${planLimitGB.toFixed(1)} GB (${percentage.toFixed(1)}%)`);
  };

  const handleLoadSample = () => {
    const demo = PRESET_DATASETS.twentyGbDemo;
    setPlanLimitGB(demo.limitGB);
    setDailyLogs(
      DEFAULT_DAILY_LOGS.map((item, idx) => ({
        ...item,
        usageGB: demo.dailyLogs[idx],
      }))
    );
    showToast('Loaded 20 GB sample demo data matching dashboard preview!');
  };

  const handleReset = () => {
    setPlanLimitGB(20);
    setDailyLogs(
      DEFAULT_DAILY_LOGS.map((item) => ({
        ...item,
        usageGB: 0,
      }))
    );
    showToast('Telemetry inputs reset to 0 GB.');
  };

  const handleToggleRestrict = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, restricted: !app.restricted } : app
      )
    );
    const target = apps.find((a) => a.id === appId);
    if (target) {
      showToast(
        target.restricted
          ? `Lifted background restriction for ${target.name}`
          : `Restricted background cellular data for ${target.name}`
      );
    }
  };

  const handleToggleDataSaver = () => {
    setDataSaverActive((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Cellular Data Saver enabled: Video streams throttled to save ~35%'
          : 'Cellular Data Saver disabled: Full resolution restored'
      );
      return next;
    });
  };

  const handleTriggerNotificationTest = () => {
    showToast(
      `[SIMULATED ALERT] Bandwidth Sentinel: Quota consumption reached ${percentage.toFixed(1)}%! Active alert broadcasted.`
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col antialiased">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-200 border border-slate-800">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        setIsLive={setIsLive}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Hero Header */}
        <PageHeader onLoadSample={handleLoadSample} />

        {/* Tab 1: Overview Dashboard (Matches the User Image Exactly) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Section 1: Inputs & Quota Controls */}
            <TelemetryInputs
              planLimitGB={planLimitGB}
              setPlanLimitGB={setPlanLimitGB}
              dailyLogs={dailyLogs}
              onUpdateDailyLog={handleUpdateDailyLog}
              onCalculate={handleCalculate}
              onLoadSample={handleLoadSample}
              onReset={handleReset}
            />

            {/* Section 2: Real-time Alert Banner */}
            <AlertBanner
              status={status}
              percentage={percentage}
              remainingGB={remainingGB}
              totalUsedGB={totalUsedGB}
              planLimitGB={planLimitGB}
            />

            {/* Section 3: Four Summary Metric Cards */}
            <MetricCards
              planLimitGB={planLimitGB}
              totalUsedGB={totalUsedGB}
              remainingGB={remainingGB}
              percentage={percentage}
              status={status}
            />

            {/* Section 4: Analytics Row (Gauge & Distribution Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 h-full">
                <QuotaGauge
                  percentage={percentage}
                  planLimitGB={planLimitGB}
                  totalUsedGB={totalUsedGB}
                  status={status}
                  warningThresholdPercent={warningThreshold}
                />
              </div>

              <div className="lg:col-span-7 h-full">
                <DailyConsumptionChart
                  dailyLogs={dailyLogs}
                  totalUsedGB={totalUsedGB}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: App Breakdown */}
        {activeTab === 'breakdown' && (
          <AppBreakdownTab
            apps={apps}
            totalWeeklyGB={totalUsedGB}
            onToggleRestrict={handleToggleRestrict}
            dataSaverActive={dataSaverActive}
            onToggleDataSaver={handleToggleDataSaver}
          />
        )}

        {/* Tab 3: Limits & Alerts */}
        {activeTab === 'alerts' && (
          <LimitsAlertsTab
            warningThreshold={warningThreshold}
            setWarningThreshold={setWarningThreshold}
            planLimitGB={planLimitGB}
            setPlanLimitGB={setPlanLimitGB}
            dailyLogs={dailyLogs}
            onTriggerNotificationTest={handleTriggerNotificationTest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Mobile Data Usage Tracker
            </span>
            <span>·</span>
            <span>Academic Mini-Project CSE / IT Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Bandwidth Sentinel v2.4</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-blue-600 hover:underline font-medium"
            >
              Telemetry Overview
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('breakdown')}
              className="text-blue-600 hover:underline font-medium"
            >
              Package Inspector
            </button>
          </div>
        </div>
      </footer>

      {/* User & SIM Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        planLimitGB={planLimitGB}
      />
    </div>
  );
}
