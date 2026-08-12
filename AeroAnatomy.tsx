import React, { useState } from 'react';
import { AERO_HOTSPOTS } from '../data/f1Data';
import { AeroHotspot } from '../types';
import { Zap, Shield, Cpu, Flame, Layers, Info, CheckCircle2 } from 'lucide-react';

export const AeroAnatomy: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<AeroHotspot>(AERO_HOTSPOTS[0]); // Default Venturi Floor

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="font-black text-white text-lg tracking-wide uppercase">CAR & AERODYNAMIC ANATOMY EXPLORER</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            INTERACTIVE 2D TECHNICAL BREAKDOWN OF GROUND EFFECT CHASSIS & HYBRID POWER UNIT
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 rounded bg-purple-950/80 border border-purple-800 text-purple-300 font-bold">
            2025/2026 TECHNICAL REGS
          </span>
        </div>
      </div>

      {/* Main Interactive Diagram & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Interactive F1 Car Silhouette Diagram */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">
              CLICK HOTSPOTS TO INSPECT AERO & MECHANICAL TELEMETRY
            </h3>
            <span className="text-xs text-slate-400 font-mono">5 ACTIVE HOTSPOTS</span>
          </div>

          {/* F1 Car Silhouette Box with SVG & Hotspot Dots */}
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            
            {/* Engineering grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

            {/* F1 Car 2D Vector Silhouette */}
            <svg className="w-full h-full max-h-72 opacity-90" viewBox="0 0 800 350">
              {/* Car Body outline */}
              <path
                d="M 50 200 L 120 180 Q 200 170 280 180 L 360 140 Q 420 130 480 140 L 560 160 Q 640 170 720 160 L 760 200 L 720 220 L 580 230 Q 400 240 220 230 L 100 220 Z"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Front Wing */}
              <path d="M 40 200 L 120 195 L 120 230 L 40 220 Z" fill="#0284c7" opacity="0.6" />
              {/* Rear Wing */}
              <path d="M 700 120 L 770 120 L 770 170 L 700 170 Z" fill="#0284c7" opacity="0.6" />
              {/* Cockpit Halo */}
              <path d="M 320 150 C 350 120, 410 120, 440 150 Z" fill="none" stroke="#ef4444" strokeWidth="4" />
              {/* Wheels */}
              <circle cx="180" cy="235" r="42" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
              <circle cx="180" cy="235" r="20" fill="#0284c7" />
              <circle cx="620" cy="235" r="42" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
              <circle cx="620" cy="235" r="20" fill="#0284c7" />
            </svg>

            {/* Hotspot Markers mapped via coordinates */}
            {AERO_HOTSPOTS.map((hotspot) => {
              const isSelected = activeHotspot.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => setActiveHotspot(hotspot)}
                  style={{ left: `${hotspot.coordinates.x}%`, top: `${hotspot.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-red-600 text-white scale-125 shadow-lg shadow-red-600/50 z-20'
                      : 'bg-slate-900/90 text-cyan-400 hover:scale-110 border border-cyan-500/50 z-10'
                  }`}
                >
                  <span className="relative flex h-3 w-3">
                    {isSelected && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isSelected ? 'bg-white' : 'bg-cyan-400'}`}></span>
                  </span>
                </button>
              );
            })}

          </div>

          {/* Quick Hotspot Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
            {AERO_HOTSPOTS.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveHotspot(h)}
                className={`p-2.5 rounded-lg border text-left font-bold transition-all ${
                  activeHotspot.id === h.id
                    ? 'bg-red-950 border-red-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {h.title}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Active Hotspot Deep Inspection Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px] font-bold uppercase">
                {activeHotspot.category}
              </span>
              <span className="text-[10px] font-mono text-slate-500">ID: {activeHotspot.id}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg tracking-wide">{activeHotspot.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
                {activeHotspot.shortDesc}
              </p>
            </div>

            {/* Detailed Mechanics Explanation */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-cyan-400">
                <Info className="w-4 h-4" />
                <span>FLUID DYNAMICS & ENGINEERING</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeHotspot.detailedExplanation}
              </p>
            </div>

            {/* Technical Specifications List */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                TELEMETRY BENCHMARK SPECS
              </span>

              <div className="space-y-2">
                {activeHotspot.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
                    <span className="text-slate-400 font-medium">{spec.label}</span>
                    <span className="font-extrabold text-emerald-400">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Compliance Badge */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>FULL FIA TECHNICAL HOMOLOGATION PASSED</span>
          </div>

        </div>

      </div>

    </div>
  );
};
