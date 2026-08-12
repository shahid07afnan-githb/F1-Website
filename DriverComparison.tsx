import React, { useState } from 'react';
import { DRIVERS, CONSTRUCTORS } from '../data/f1Data';
import { Driver } from '../types';
import { Trophy, Award, Flag, Users, ArrowUpRight, BarChart } from 'lucide-react';

export const DriverComparison: React.FC = () => {
  const [driverA, setDriverA] = useState<Driver>(DRIVERS[0]); // Max Verstappen
  const [driverB, setDriverB] = useState<Driver>(DRIVERS[1]); // Lewis Hamilton
  const [activeView, setActiveView] = useState<'compare' | 'drivers' | 'constructors'>('compare');

  return (
    <div className="space-y-6">
      
      {/* Top View Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveView('compare')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeView === 'compare' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>HEAD-TO-HEAD BATTLE</span>
          </button>

          <button
            onClick={() => setActiveView('drivers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeView === 'drivers' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>DRIVER STANDINGS</span>
          </button>

          <button
            onClick={() => setActiveView('constructors')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeView === 'constructors' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CONSTRUCTOR STANDINGS</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:block">
          2025/2026 SEASON TELEMETRY DATA
        </span>
      </div>

      {/* Head-to-Head Driver Comparison View */}
      {activeView === 'compare' && (
        <div className="space-y-6">
          
          {/* Driver Selectors Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Driver A Selection */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                SELECT DRIVER A
              </label>
              <select
                value={driverA.id}
                onChange={(e) => {
                  const found = DRIVERS.find((d) => d.id === e.target.value);
                  if (found) setDriverA(found);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-sm rounded-lg p-2.5 focus:border-red-500 focus:outline-none"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{driverA.flag}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-base">#{driverA.number} {driverA.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{driverA.team}</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-amber-400">{driverA.points}</span>
                  <span className="text-[10px] text-slate-400 block font-bold">PTS</span>
                </div>
              </div>
            </div>

            {/* Driver B Selection */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                SELECT DRIVER B
              </label>
              <select
                value={driverB.id}
                onChange={(e) => {
                  const found = DRIVERS.find((d) => d.id === e.target.value);
                  if (found) setDriverB(found);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-sm rounded-lg p-2.5 focus:border-red-500 focus:outline-none"
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{driverB.flag}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-base">#{driverB.number} {driverB.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{driverB.team}</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-amber-400">{driverB.points}</span>
                  <span className="text-[10px] text-slate-400 block font-bold">PTS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Comparative Metrics & Ratings */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6 shadow-2xl">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider text-center font-mono">
              TELEMETRY SKILL & CAREER STATS COMPARISON
            </h3>

            {/* Stat comparison bars */}
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* Qualifying Pace */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-red-400">{driverA.qualifyingPace} / 100</span>
                  <span className="text-slate-300">QUALIFYING SPEED</span>
                  <span className="text-cyan-400">{driverB.qualifyingPace} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-950 h-3 rounded-l-full overflow-hidden flex justify-end">
                    <div className="bg-red-500 h-full transition-all" style={{ width: `${driverA.qualifyingPace}%` }} />
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-r-full overflow-hidden flex justify-start">
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${driverB.qualifyingPace}%` }} />
                  </div>
                </div>
              </div>

              {/* Racecraft */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-red-400">{driverA.raceCraft} / 100</span>
                  <span className="text-slate-300">RACECRAFT & OVERTAKING</span>
                  <span className="text-cyan-400">{driverB.raceCraft} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-950 h-3 rounded-l-full overflow-hidden flex justify-end">
                    <div className="bg-red-500 h-full transition-all" style={{ width: `${driverA.raceCraft}%` }} />
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-r-full overflow-hidden flex justify-start">
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${driverB.raceCraft}%` }} />
                  </div>
                </div>
              </div>

              {/* Tire Management */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-red-400">{driverA.tireManagement} / 100</span>
                  <span className="text-slate-300">TIRE DEGRADATION MANAGEMENT</span>
                  <span className="text-cyan-400">{driverB.tireManagement} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-950 h-3 rounded-l-full overflow-hidden flex justify-end">
                    <div className="bg-red-500 h-full transition-all" style={{ width: `${driverA.tireManagement}%` }} />
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-r-full overflow-hidden flex justify-start">
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${driverB.tireManagement}%` }} />
                  </div>
                </div>
              </div>

              {/* Wet Weather Skill */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-red-400">{driverA.wetWeatherSkill} / 100</span>
                  <span className="text-slate-300">WET WEATHER MASTERY</span>
                  <span className="text-cyan-400">{driverB.wetWeatherSkill} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-950 h-3 rounded-l-full overflow-hidden flex justify-end">
                    <div className="bg-red-500 h-full transition-all" style={{ width: `${driverA.wetWeatherSkill}%` }} />
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-r-full overflow-hidden flex justify-start">
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${driverB.wetWeatherSkill}%` }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Hard Career Numbers Comparison Table */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center text-xs">
              
              <div className="space-y-2">
                <span className="text-lg font-black text-red-400">{driverA.wins}</span>
                <span className="block text-slate-400 font-bold">RACE WINS</span>
                <span className="text-lg font-black text-cyan-400">{driverB.wins}</span>
              </div>

              <div className="space-y-2 border-x border-slate-800">
                <span className="text-lg font-black text-red-400">{driverA.poles}</span>
                <span className="block text-slate-400 font-bold">POLE POSITIONS</span>
                <span className="text-lg font-black text-cyan-400">{driverB.poles}</span>
              </div>

              <div className="space-y-2">
                <span className="text-lg font-black text-red-400">{driverA.worldTitles}</span>
                <span className="block text-slate-400 font-bold">WORLD TITLES</span>
                <span className="text-lg font-black text-cyan-400">{driverB.worldTitles}</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Driver Standings Table View */}
      {activeView === 'drivers' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">
            2025/2026 FIA FORMULA ONE DRIVER CHAMPIONSHIP
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="p-3">POS</th>
                  <th className="p-3">DRIVER</th>
                  <th className="p-3">TEAM</th>
                  <th className="p-3">WINS</th>
                  <th className="p-3">PODIUMS</th>
                  <th className="p-3">POLES</th>
                  <th className="p-3">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {DRIVERS.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-400">P{index + 1}</td>
                    <td className="p-3 font-extrabold text-white flex items-center space-x-2">
                      <span>{d.flag}</span>
                      <span>#{d.number} {d.name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{d.team}</td>
                    <td className="p-3 text-amber-400 font-bold">{d.wins}</td>
                    <td className="p-3 text-slate-300">{d.podiums}</td>
                    <td className="p-3 text-slate-300">{d.poles}</td>
                    <td className="p-3 font-black text-lg text-emerald-400">{d.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Constructor Standings Table View */}
      {activeView === 'constructors' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">
            2025/2026 CONSTRUCTOR CHAMPIONSHIP STANDINGS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONSTRUCTORS.map((team, idx) => (
              <div
                key={team.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden shadow-lg"
              >
                {/* Team Brand Accent Bar */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-2"
                  style={{ backgroundColor: team.color }}
                />

                <div className="pl-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">P{idx + 1} CONSTRUCTOR</span>
                    <h4 className="font-extrabold text-white text-base">{team.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">PU: {team.powerUnit}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-2xl font-black text-emerald-400">{team.points}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">PTS</span>
                  </div>
                </div>

                <div className="pl-3 flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>PRINCIPAL: {team.teamPrincipal}</span>
                  <span>WINS: {team.wins}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
