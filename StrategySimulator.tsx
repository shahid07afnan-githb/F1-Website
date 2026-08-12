import React, { useState } from 'react';
import { CIRCUITS } from '../data/f1Data';
import { Circuit } from '../types';
import { LineChart, Zap, ShieldAlert, Thermometer, Clock, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

export const StrategySimulator: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(CIRCUITS[1]); // Silverstone
  const [startCompound, setStartCompound] = useState<'Soft' | 'Medium' | 'Hard'>('Medium');
  const [targetCompound, setTargetCompound] = useState<'Soft' | 'Medium' | 'Hard'>('Hard');
  const [pitLap, setPitLap] = useState<number>(22);
  const [useTwoStop, setUseTwoStop] = useState<boolean>(false);
  const [secondPitLap, setSecondPitLap] = useState<number>(38);
  const [secondCompound, setSecondCompound] = useState<'Soft' | 'Medium' | 'Hard'>('Soft');
  const [safetyCarMode, setSafetyCarMode] = useState<boolean>(false);
  const [trackTemp, setTrackTemp] = useState<number>(38); // °C

  // Calculate estimated lap time evolution & total race time
  const baseLapTimeSec = 88.5; // ~1:28.500
  const pitLossSec = safetyCarMode ? 12.5 : 22.0;

  // Calculate stint lap times
  const calculateTotalTime = () => {
    let totalSec = 0;
    const laps = selectedCircuit.laps;

    if (!useTwoStop) {
      // 1-Stop strategy
      for (let lap = 1; lap <= laps; lap++) {
        const isStint1 = lap <= pitLap;
        const compound = isStint1 ? startCompound : targetCompound;
        const lapInStint = isStint1 ? lap : lap - pitLap;
        
        // Base pace per compound
        const compoundOffset = compound === 'Soft' ? -0.8 : compound === 'Medium' ? 0.0 : 0.6;
        // Thermal wear degradation per lap
        const degRate = compound === 'Soft' ? 0.12 : compound === 'Medium' ? 0.07 : 0.04;
        
        const lapTime = baseLapTimeSec + compoundOffset + lapInStint * degRate;
        totalSec += lapTime;
      }
      totalSec += pitLossSec; // 1 pit stop penalty
    } else {
      // 2-Stop strategy
      for (let lap = 1; lap <= laps; lap++) {
        const isStint1 = lap <= pitLap;
        const isStint2 = lap > pitLap && lap <= secondPitLap;
        const compound = isStint1 ? startCompound : isStint2 ? targetCompound : secondCompound;
        const lapInStint = isStint1 ? lap : isStint2 ? lap - pitLap : lap - secondPitLap;

        const compoundOffset = compound === 'Soft' ? -0.8 : compound === 'Medium' ? 0.0 : 0.6;
        const degRate = compound === 'Soft' ? 0.12 : compound === 'Medium' ? 0.07 : 0.04;

        const lapTime = baseLapTimeSec + compoundOffset + lapInStint * degRate;
        totalSec += lapTime;
      }
      totalSec += pitLossSec * 2; // 2 pit stops penalty
    }

    return totalSec;
  };

  const totalSeconds = calculateTotalTime();
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2);

  // Undercut Delta calculation (pitting 2 laps earlier than competitor)
  const undercutGain = (1.8 + Math.random() * 0.8).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-emerald-400" />
            <h2 className="font-black text-white text-lg tracking-wide uppercase">RACE STRATEGY & UNDERCUT CALCULATOR</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            OPTIMIZE PIT STOP WINDOWS, TIRE DEGRADATION CURVES & SAFETY CAR OPPORTUNITIES
          </p>
        </div>

        {/* Selected Circuit Pill */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-2xl">{selectedCircuit.flag}</span>
          <div>
            <div className="text-xs font-bold text-white uppercase">{selectedCircuit.name}</div>
            <div className="text-[11px] font-mono text-slate-400">{selectedCircuit.laps} LAPS • {selectedCircuit.lengthKm} KM</div>
          </div>
        </div>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Strategy Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            STINT & COMPOUND BUILDER
          </h3>

          {/* Circuit Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              GRAND PRIX VENUE
            </label>
            <select
              value={selectedCircuit.id}
              onChange={(e) => {
                const c = CIRCUITS.find((item) => item.id === e.target.value);
                if (c) {
                  setSelectedCircuit(c);
                  setPitLap(Math.floor(c.laps * 0.4));
                  setSecondPitLap(Math.floor(c.laps * 0.7));
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white font-semibold text-xs rounded-lg p-2.5 focus:border-red-500 focus:outline-none"
            >
              {CIRCUITS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name} ({c.laps} Laps)
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Mode Toggle (1-Stop vs 2-Stop) */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300">STRATEGY TYPE:</span>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                onClick={() => setUseTwoStop(false)}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  !useTwoStop ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400'
                }`}
              >
                1-STOP
              </button>
              <button
                onClick={() => setUseTwoStop(true)}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  useTwoStop ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400'
                }`}
              >
                2-STOP
              </button>
            </div>
          </div>

          {/* Stint 1 Config */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-400 flex justify-between">
              <span>STINT 1 (START)</span>
              <span>LAPS 1 TO {pitLap}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['Soft', 'Medium', 'Hard'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setStartCompound(c)}
                  className={`p-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                    startCompound === c
                      ? c === 'Soft'
                        ? 'bg-red-950 border-red-500 text-red-300'
                        : c === 'Medium'
                        ? 'bg-yellow-950 border-yellow-500 text-yellow-300'
                        : 'bg-slate-800 border-white text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {c === 'Soft' ? '🔴 SOFT' : c === 'Medium' ? '🟡 MEDIUM' : '⚪ HARD'}
                </button>
              ))}
            </div>

            {/* Pit Stop Lap Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>PIT STOP LAP:</span>
                <span className="text-white font-bold">LAP {pitLap}</span>
              </div>
              <input
                type="range"
                min={8}
                max={useTwoStop ? secondPitLap - 5 : selectedCircuit.laps - 8}
                value={pitLap}
                onChange={(e) => setPitLap(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Stint 2 Config */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 flex justify-between">
              <span>STINT 2</span>
              <span>
                LAPS {pitLap + 1} TO {useTwoStop ? secondPitLap : selectedCircuit.laps}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Soft', 'Medium', 'Hard'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setTargetCompound(c)}
                  className={`p-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                    targetCompound === c
                      ? c === 'Soft'
                        ? 'bg-red-950 border-red-500 text-red-300'
                        : c === 'Medium'
                        ? 'bg-yellow-950 border-yellow-500 text-yellow-300'
                        : 'bg-slate-800 border-white text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {c === 'Soft' ? '🔴 SOFT' : c === 'Medium' ? '🟡 MEDIUM' : '⚪ HARD'}
                </button>
              ))}
            </div>
          </div>

          {/* Stint 3 Config (If 2-Stop) */}
          {useTwoStop && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 flex justify-between">
                <span>STINT 3 (FINAL)</span>
                <span>LAPS {secondPitLap + 1} TO {selectedCircuit.laps}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['Soft', 'Medium', 'Hard'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSecondCompound(c)}
                    className={`p-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                      secondCompound === c
                        ? c === 'Soft'
                          ? 'bg-red-950 border-red-500 text-red-300'
                          : c === 'Medium'
                          ? 'bg-yellow-950 border-yellow-500 text-yellow-300'
                          : 'bg-slate-800 border-white text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {c === 'Soft' ? '🔴 SOFT' : c === 'Medium' ? '🟡 MEDIUM' : '⚪ HARD'}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>2ND PIT STOP LAP:</span>
                  <span className="text-white font-bold">LAP {secondPitLap}</span>
                </div>
                <input
                  type="range"
                  min={pitLap + 5}
                  max={selectedCircuit.laps - 5}
                  value={secondPitLap}
                  onChange={(e) => setSecondPitLap(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Environmental Toggles: Safety Car & Track Temp */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>SAFETY CAR PIT WINDOW</span>
              </span>
              <button
                onClick={() => setSafetyCarMode(!safetyCarMode)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold border transition-all ${
                  safetyCarMode
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {safetyCarMode ? 'ACTIVE (-10s LOSS)' : 'GREEN FLAG'}
              </button>
            </div>
          </div>

        </div>

        {/* Middle & Right Columns: Calculated Strategy Telemetry Results & Visual Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Estimated Race Duration */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>ESTIMATED RACE TIME</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {minutes}m {seconds}s
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                AVG PACE: {(totalSeconds / selectedCircuit.laps).toFixed(3)}s / LAP
              </div>
            </div>

            {/* Projected Undercut Gain */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>UNDERCUT DELTA GAIN</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                -{undercutGain}s
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                OUTLAP FRESH TIRE ADVANTAGE
              </div>
            </div>

            {/* Pit Lane Penalty */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>PIT LANE LOSS TIME</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                {pitLossSec.toFixed(1)}s
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {safetyCarMode ? 'VSC / SAFETY CAR DISCOUNT' : 'FULL GREEN FLAG PIT LANE'}
              </div>
            </div>

          </div>

          {/* Lap-by-Lap Stint Tire Degradation Curve */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>STINT LAP TIME EVOLUTION & TIRE CLIFF</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {selectedCircuit.laps} TOTAL LAPS
              </span>
            </div>

            {/* Visual Stint Bar Timeline */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 font-bold">
                <span>RACE PROGRESS TIMELINE</span>
                <span>LAP 1 ──────── LAP {selectedCircuit.laps}</span>
              </div>

              <div className="w-full h-8 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex">
                
                {/* Stint 1 bar */}
                <div
                  className={`h-full flex items-center justify-center font-mono text-xs font-extrabold transition-all border-r border-slate-950 ${
                    startCompound === 'Soft'
                      ? 'bg-red-600 text-white'
                      : startCompound === 'Medium'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-200 text-slate-950'
                  }`}
                  style={{ width: `${(pitLap / selectedCircuit.laps) * 100}%` }}
                >
                  STINT 1 ({startCompound.toUpperCase()})
                </div>

                {/* Stint 2 bar */}
                <div
                  className={`h-full flex items-center justify-center font-mono text-xs font-extrabold transition-all ${
                    targetCompound === 'Soft'
                      ? 'bg-red-600 text-white'
                      : targetCompound === 'Medium'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-200 text-slate-950'
                  }`}
                  style={{
                    width: `${
                      (( (useTwoStop ? secondPitLap : selectedCircuit.laps) - pitLap ) / selectedCircuit.laps) * 100
                    }%`,
                  }}
                >
                  STINT 2 ({targetCompound.toUpperCase()})
                </div>

                {/* Stint 3 bar if 2 stop */}
                {useTwoStop && (
                  <div
                    className={`h-full flex items-center justify-center font-mono text-xs font-extrabold transition-all border-l border-slate-950 ${
                      secondCompound === 'Soft'
                        ? 'bg-red-600 text-white'
                        : secondCompound === 'Medium'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-200 text-slate-950'
                    }`}
                    style={{
                      width: `${((selectedCircuit.laps - secondPitLap) / selectedCircuit.laps) * 100}%`,
                    }}
                  >
                    STINT 3
                  </div>
                )}

              </div>
            </div>

            {/* Pit Wall Recommendation Callout Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>RECOMMENDED RACE ENGINEER TACTIC</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Execute the <strong className="text-white">Undercut on Lap {pitLap - 1}</strong> if stuck behind rival within 1.2s. Pitting 1 lap earlier unlocks clean air and grants an immediate <strong className="text-emerald-400">-{undercutGain}s pace delta</strong> on outlap before competitor responds.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
