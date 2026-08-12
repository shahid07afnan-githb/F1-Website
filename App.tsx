import React, { useState } from 'react';
import { Header, TabType } from './components/Header';
import { PitWallTelemetry } from './components/PitWallTelemetry';
import { AiRaceEngineer } from './components/AiRaceEngineer';
import { StrategySimulator } from './components/StrategySimulator';
import { DriverComparison } from './components/DriverComparison';
import { AeroAnatomy } from './components/AeroAnatomy';
import { RadioSoundboard } from './components/RadioSoundboard';
import { PitStopReactionGame } from './components/PitStopReactionGame';
import { F1Quiz } from './components/F1Quiz';
import { TelemetryState } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('telemetry');
  
  // Shared Live Telemetry State
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    speed: 312,
    rpm: 12800,
    gear: 7,
    throttle: 100,
    brake: 0,
    drs: 'ACTIVE',
    ersBattery: 82,
    tireCompound: 'Medium',
    tireTemp: 102,
    tireWear: 84,
    gForceX: 0.4,
    gForceY: 1.2,
    currentSector: 2,
    lapNumber: 18,
    totalLaps: 52,
    lapTimeMs: 88500,
    lastLapTime: '1:28.412',
    bestLapTime: '1:27.909',
    gapToLeader: '+1.824s',
    isSimulating: true,
  });

  const toggleSimulation = () => {
    setTelemetry((prev) => ({ ...prev, isSimulating: !prev.isSimulating }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black selection:bg-red-600 selection:text-white">
      
      {/* Top Header & Tab Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={telemetry.isSimulating}
        toggleSimulation={toggleSimulation}
      />

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'telemetry' && (
          <PitWallTelemetry telemetry={telemetry} setTelemetry={setTelemetry} />
        )}

        {activeTab === 'engineer' && (
          <AiRaceEngineer telemetry={telemetry} />
        )}

        {activeTab === 'strategy' && (
          <StrategySimulator />
        )}

        {activeTab === 'standings' && (
          <DriverComparison />
        )}

        {activeTab === 'aero' && (
          <AeroAnatomy />
        )}

        {activeTab === 'radio' && (
          <RadioSoundboard />
        )}

        {activeTab === 'pitstop' && (
          <PitStopReactionGame />
        )}

        {activeTab === 'quiz' && (
          <F1Quiz />
        )}
      </main>

      {/* High-Tech Pit Wall Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/90 py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>APEX F1 PIT WALL TELEMETRY ENGINE v2.6 • HIGH PRECISION DATA STREAM</span>
          </div>
          <div>
            <span>SCUDERIA & CONSTRUCTOR TELEMETRY ENCRYPTED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
