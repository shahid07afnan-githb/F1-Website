import React from 'react';
import { Gauge, Radio, Cpu, LineChart, Trophy, Zap, Shield, Play, HelpCircle } from 'lucide-react';

export type TabType = 'telemetry' | 'engineer' | 'strategy' | 'standings' | 'aero' | 'radio' | 'pitstop' | 'quiz';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isSimulating, toggleSimulation }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-red-900/40 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Live Status */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/30">
              <span className="font-black italic text-xl tracking-tighter text-white">F1</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-red-400 uppercase">
                  APEX PIT WALL
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest bg-red-950/80 text-red-400 border border-red-800/60 rounded">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                MONITORING TELEMETRY • AI STRATEGY ENGINE
              </p>
            </div>
          </div>

          {/* Quick Simulation Live Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSimulation}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all shadow-md ${
                isSimulating
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isSimulating ? 'TELEMETRY RUNNING' : 'PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>PIT TELEMETRY</span>
          </button>

          <button
            onClick={() => setActiveTab('engineer')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'engineer'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI RACE ENGINEER</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'strategy'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LineChart className="w-4 h-4 text-emerald-400" />
            <span>STRATEGY & UNDERCUT</span>
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'standings'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>DRIVERS & TEAMS</span>
          </button>

          <button
            onClick={() => setActiveTab('aero')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'aero'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span>CAR & AERO TECH</span>
          </button>

          <button
            onClick={() => setActiveTab('radio')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'radio'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-red-400" />
            <span>RADIO VAULT</span>
          </button>

          <button
            onClick={() => setActiveTab('pitstop')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'pitstop'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Play className="w-4 h-4 text-yellow-400" />
            <span>PIT STOP CHALLENGE</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>TRIVIA</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
