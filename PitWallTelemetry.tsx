import React, { useState, useEffect } from 'react';
import { CIRCUITS, DRIVERS } from '../data/f1Data';
import { TelemetryState, Circuit, Driver } from '../types';
import { Gauge, Zap, Wind, Thermometer, ShieldAlert, Radio, Flame, ArrowUpRight, Play, Pause, RotateCcw } from 'lucide-react';

interface PitWallTelemetryProps {
  telemetry: TelemetryState;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
}

export const PitWallTelemetry: React.FC<PitWallTelemetryProps> = ({ telemetry, setTelemetry }) => {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(CIRCUITS[1]); // Default Silverstone
  const [selectedDriver, setSelectedDriver] = useState<Driver>(DRIVERS[0]); // Default Max Verstappen
  const [lapProgress, setLapProgress] = useState<number>(35); // 0-100% around track
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [radioLogs, setRadioLogs] = useState<Array<{ id: string; time: string; text: string; type: 'info' | 'radio' | 'purple' }>>([
    { id: '1', time: '14:32:01', text: 'Outlap complete. Tires in thermal window (102°C).', type: 'info' },
    { id: '2', time: '14:32:45', text: 'Sector 1 Purple! -0.185s ahead of delta.', type: 'purple' },
    { id: '3', time: '14:33:10', text: 'Radio (ENG): "Push push, gap to Leclerc is 2.4 seconds."', type: 'radio' },
  ]);

  // Telemetry loop animation when isSimulating is true
  useEffect(() => {
    if (!telemetry.isSimulating) return;

    const interval = setInterval(() => {
      setLapProgress((prev) => {
        const next = (prev + 0.8 * simSpeed) % 100;
        
        // Derive dynamic telemetry variables based on track position (corners vs straights)
        const isStraight = (next > 10 && next < 30) || (next > 50 && next < 70) || (next > 85);
        const isHeavyBraking = (next >= 28 && next <= 34) || (next >= 48 && next <= 53) || (next >= 80 && next <= 84);

        let speed = isStraight ? Math.floor(290 + Math.random() * 45) : Math.floor(110 + Math.random() * 80);
        if (isHeavyBraking) speed = Math.floor(85 + Math.random() * 40);

        let throttle = isStraight ? 100 : Math.floor(30 + Math.random() * 40);
        if (isHeavyBraking) throttle = 0;

        let brake = isHeavyBraking ? Math.floor(85 + Math.random() * 15) : 0;
        let gear = speed > 310 ? 8 : speed > 260 ? 7 : speed > 210 ? 6 : speed > 160 ? 5 : speed > 110 ? 4 : 3;
        let rpm = Math.floor(10000 + (speed / 340) * 4800);

        let drsState: 'DISABLED' | 'AVAILABLE' | 'ACTIVE' = 'DISABLED';
        if (isStraight && selectedCircuit.drsZones > 0) {
          drsState = 'ACTIVE';
        } else if (next > 5 && next < 12) {
          drsState = 'AVAILABLE';
        }

        // Sector calculations
        let sector: 1 | 2 | 3 = next < 33 ? 1 : next < 66 ? 2 : 3;

        // Tire decay
        const tireWearDecay = Math.max(10, telemetry.tireWear - 0.02 * simSpeed);

        setTelemetry((t) => ({
          ...t,
          speed,
          rpm,
          gear,
          throttle,
          brake,
          drs: drsState,
          currentSector: sector,
          tireWear: Math.round(tireWearDecay * 10) / 10,
          ersBattery: Math.min(100, Math.max(15, isHeavyBraking ? t.ersBattery + 2 : t.ersBattery - 0.5)),
          gForceX: isHeavyBraking ? -4.8 : isStraight ? 0.2 : (Math.random() - 0.5) * 4.2,
          gForceY: isStraight ? 1.8 : -1.2,
        }));

        // Trigger log events periodically
        if (Math.random() < 0.05 * simSpeed) {
          const times = new Date().toLocaleTimeString();
          const messages = [
            `DRS ${drsState === 'ACTIVE' ? 'Activated' : 'Closed'} down straight.`,
            `Thermal telemetry: Front Left tire peak 104°C.`,
            `Micro-sector 4 split: +0.042s to P1.`,
            `Radio (DRIVER): "Front wing flex feeling good in high speed corners."`,
            `Radio (ENG): "Box this lap for Soft compound, copy?"`,
          ];
          const randomMsg = messages[Math.floor(Math.random() * messages.length)];
          const msgType = randomMsg.includes('Purple') ? 'purple' : randomMsg.includes('Radio') ? 'radio' : 'info';

          setRadioLogs((logs) => [
            { id: Date.now().toString(), time: times, text: randomMsg, type: msgType },
            ...logs.slice(0, 5),
          ]);
        }

        return next;
      });
    }, 120 / simSpeed);

    return () => clearInterval(interval);
  }, [telemetry.isSimulating, simSpeed, selectedCircuit, setTelemetry]);

  // Shift lights calculation (8 lights)
  const rpmPercent = Math.min(100, Math.max(0, ((telemetry.rpm - 8000) / 7000) * 100));
  const activeLights = Math.floor((rpmPercent / 100) * 10);

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Circuit Selector & Driver Focus */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        {/* Track Selection */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">CIRCUIT:</span>
          <select
            value={selectedCircuit.id}
            onChange={(e) => {
              const found = CIRCUITS.find((c) => c.id === e.target.value);
              if (found) setSelectedCircuit(found);
            }}
            className="bg-slate-950 border border-slate-700 text-white font-semibold text-sm rounded-lg px-3 py-1.5 focus:border-red-500 focus:outline-none"
          >
            {CIRCUITS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>

        {/* Driver Selection */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">DRIVER TELEMETRY:</span>
          <select
            value={selectedDriver.id}
            onChange={(e) => {
              const found = DRIVERS.find((d) => d.id === e.target.value);
              if (found) setSelectedDriver(found);
            }}
            className="bg-slate-950 border border-slate-700 text-white font-semibold text-sm rounded-lg px-3 py-1.5 focus:border-red-500 focus:outline-none"
          >
            {DRIVERS.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.number} {d.name} ({d.shortCode}) - {d.team}
              </option>
            ))}
          </select>
        </div>

        {/* Sim speed & Pause button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTelemetry((t) => ({ ...t, isSimulating: !t.isSimulating }))}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              telemetry.isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {telemetry.isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{telemetry.isSimulating ? 'PAUSE TELEMETRY' : 'START TELEMETRY'}</span>
          </button>

          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs font-mono">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2 py-0.5 rounded ${
                  simSpeed === speed ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Pit Wall Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Track Map & Sector Splits */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{selectedCircuit.flag}</span>
              <div>
                <h2 className="font-extrabold text-white text-base uppercase">{selectedCircuit.name}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedCircuit.lengthKm} KM • {selectedCircuit.laps} LAPS • {selectedCircuit.corners} CORNERS
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-emerald-400 font-bold">
              DRS ZONES: {selectedCircuit.drsZones}
            </span>
          </div>

          {/* Interactive Circuit Canvas Visualizer */}
          <div className="relative w-full h-56 bg-slate-950 rounded-lg border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
            
            {/* Sector background grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Circuit Vector Track */}
            <svg className="w-full h-full max-h-48" viewBox="0 0 500 360">
              <path
                d={selectedCircuit.svgPath}
                fill="none"
                stroke="#1e293b"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={selectedCircuit.svgPath}
                fill="none"
                stroke="#334155"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Highlight active sector path in color */}
              <path
                d={selectedCircuit.svgPath}
                fill="none"
                stroke={telemetry.currentSector === 1 ? '#a855f7' : telemetry.currentSector === 2 ? '#10b981' : '#3b82f6'}
                strokeWidth="4"
                strokeDasharray="100 300"
                strokeDashoffset={-lapProgress * 3}
                strokeLinecap="round"
              />

              {/* Dynamic Telemetry Car Position Dot */}
              <g transform={`translate(${100 + Math.cos((lapProgress / 100) * Math.PI * 2) * 120 + 120}, ${180 + Math.sin((lapProgress / 100) * Math.PI * 2) * 80})`}>
                <circle r="12" fill={selectedDriver.teamColor} opacity="0.3" className="animate-ping" />
                <circle r="7" fill={selectedDriver.teamColor} stroke="#ffffff" strokeWidth="2" />
                <text x="12" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  #{selectedDriver.number}
                </text>
              </g>
            </svg>

            {/* Current Position Tag */}
            <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SECTOR {telemetry.currentSector} ACTIVE</span>
            </div>

            <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-800 rounded px-2 py-1 text-[10px] font-mono text-slate-400">
              LAP RECORD: <span className="text-white font-bold">{selectedCircuit.lapRecord.time}</span> ({selectedCircuit.lapRecord.driver})
            </div>
          </div>

          {/* Sector Splits Summary */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            {selectedCircuit.sectors.map((s, idx) => (
              <div
                key={s.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  telemetry.currentSector === idx + 1
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-md shadow-purple-900/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-400">SECTOR {idx + 1}</div>
                <div className="font-extrabold text-sm text-white mt-0.5">
                  {idx + 1 === 1 ? '26.842s' : idx + 1 === 2 ? '38.105s' : '22.910s'}
                </div>
                <div className="text-[10px] text-purple-400 font-bold mt-0.5">PURPLE</div>
              </div>
            ))}
          </div>

        </div>

        {/* Middle Column: Speedometer, RPM Tachometer & Pedal Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl flex flex-col justify-between">
          
          {/* Shift Light Strip (F1 Steering Wheel LED Row) */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              <span>SHIFT LIGHTS (RPM LIMITER: 15,000)</span>
              <span className="font-bold text-slate-200">{telemetry.rpm.toLocaleString()} RPM</span>
            </div>
            <div className="grid grid-cols-10 gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
              {[...Array(10)].map((_, i) => {
                let colorClass = 'bg-slate-800';
                if (i < activeLights) {
                  if (i < 4) colorClass = 'bg-emerald-500 shadow-sm shadow-emerald-500';
                  else if (i < 7) colorClass = 'bg-red-500 shadow-sm shadow-red-500';
                  else colorClass = 'bg-blue-500 shadow-sm shadow-blue-500 animate-pulse';
                }
                return (
                  <div
                    key={i}
                    className={`h-4 rounded-sm transition-all duration-75 ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Central Digital Speedometer & Gear Indicator */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 items-center">
            
            {/* Speed Gauge */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">GROUND SPEED</span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {telemetry.speed}
              </div>
              <div className="text-xs font-mono text-slate-400 font-semibold">
                KM/H <span className="text-slate-600">|</span> {Math.round(telemetry.speed * 0.621371)} MPH
              </div>
            </div>

            {/* Gear Box Display */}
            <div className="text-center space-y-1 border-l border-slate-800 pl-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">GEAR</span>
              <div className="text-5xl font-black font-mono text-amber-400">
                {telemetry.gear}
              </div>
              <div className="text-xs font-mono text-slate-400 font-semibold">
                8-SPEED SEQUENTIAL
              </div>
            </div>
          </div>

          {/* Throttle & Brake Pedal Telemetry Bars */}
          <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            
            {/* Throttle Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-emerald-400 flex items-center space-x-1">
                  <span>THROTTLE INPUT</span>
                </span>
                <span className="text-emerald-300">{telemetry.throttle}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-100"
                  style={{ width: `${telemetry.throttle}%` }}
                />
              </div>
            </div>

            {/* Brake Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-red-400 flex items-center space-x-1">
                  <span>BRAKE PRESSURE</span>
                </span>
                <span className="text-red-300">{telemetry.brake}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100"
                  style={{ width: `${telemetry.brake}%` }}
                />
              </div>
            </div>

          </div>

          {/* DRS & ERS Hybrid Battery Deployment */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            
            {/* DRS Status */}
            <div className={`p-3 rounded-lg border text-center font-bold flex flex-col justify-center items-center ${
              telemetry.drs === 'ACTIVE'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/30'
                : telemetry.drs === 'AVAILABLE'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}>
              <span className="text-[10px] text-slate-400 uppercase">DRS STATUS</span>
              <span className="text-sm font-extrabold mt-1">{telemetry.drs}</span>
            </div>

            {/* ERS Energy Battery */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                <span>ERS DEPLOYMENT</span>
                <span className="text-cyan-400">{Math.round(telemetry.ersBattery)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-150"
                  style={{ width: `${telemetry.ersBattery}%` }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Tire Thermal Temperatures, Wear & Radio Stream */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl flex flex-col justify-between">
          
          {/* Pirelli Tire Thermal & Degradation Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>PIRELLI TIRE THERMAL MATRIX</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-yellow-950 border border-yellow-700/80 text-yellow-300 font-mono text-[10px] font-bold">
                COMPOUND: C3 MEDIUM 🟡
              </span>
            </div>

            {/* 4 Tires Diagram */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              
              {/* Front Left */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>FRONT LEFT</span>
                  <span className="text-amber-400">104°C</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-white">WEAR: {telemetry.tireWear}%</div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${telemetry.tireWear}%` }} />
                </div>
              </div>

              {/* Front Right */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>FRONT RIGHT</span>
                  <span className="text-amber-400">102°C</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-white">WEAR: {telemetry.tireWear}%</div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${telemetry.tireWear}%` }} />
                </div>
              </div>

              {/* Rear Left */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>REAR LEFT</span>
                  <span className="text-emerald-400">98°C</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-white">WEAR: {telemetry.tireWear + 2}%</div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${telemetry.tireWear + 2}%` }} />
                </div>
              </div>

              {/* Rear Right */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>REAR RIGHT</span>
                  <span className="text-amber-400">101°C</span>
                </div>
                <div className="text-xs font-mono font-extrabold text-white">WEAR: {telemetry.tireWear + 1}%</div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${telemetry.tireWear + 1}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* G-Force Live Gauge & Vector */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">G-FORCE VECTOR</span>
              <div className="text-xs font-mono font-extrabold text-white">
                LATERAL: <span className="text-red-400">{telemetry.gForceX.toFixed(1)} G</span>
              </div>
              <div className="text-xs font-mono font-extrabold text-white">
                LONGITUDINAL: <span className="text-emerald-400">{telemetry.gForceY.toFixed(1)} G</span>
              </div>
            </div>
            
            {/* G-Force visual target box */}
            <div className="relative w-14 h-14 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-slate-800" />
              <div className="absolute h-full w-[1px] bg-slate-800" />
              <div
                className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md shadow-red-500 transition-all duration-100"
                style={{
                  transform: `translate(${telemetry.gForceX * 4}px, ${-telemetry.gForceY * 4}px)`,
                }}
              />
            </div>
          </div>

          {/* Live Pit Wall Radio Stream Ticker */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300 uppercase">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>LIVE PIT WALL COMMS LOG</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 max-h-36 overflow-y-auto font-mono text-xs scrollbar-thin">
              {radioLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded border text-[11px] leading-relaxed ${
                    log.type === 'purple'
                      ? 'bg-purple-950/40 border-purple-800/60 text-purple-300'
                      : log.type === 'radio'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-slate-500 font-bold mr-2">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
