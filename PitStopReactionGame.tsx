import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Trophy, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PitStopReactionGame: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'lights' | 'pitstop'>('lights');

  // --- LIGHTS OUT REACTION TEST STATES ---
  const [lightCount, setLightCount] = useState<number>(0); // 0 to 5 red lights
  const [gameState, setGameState] = useState<'idle' | 'sequence' | 'waiting' | 'ready' | 'finished' | 'false_start'>('idle');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [bestReactionMs, setBestReactionMs] = useState<number | null>(212); // Default benchmark
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- PIT STOP TIRE CHANGE MINIGAME STATES ---
  const [wheelsDone, setWheelsDone] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);
  const [pitStopState, setPitStopState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [pitStopTimeSec, setPitStopTimeSec] = useState<number | null>(null);
  const pitStartTimeRef = useRef<number | null>(null);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Start 5 Red Lights Sequence
  const startLightsSequence = () => {
    setGameState('sequence');
    setLightCount(0);
    setReactionTimeMs(null);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setLightCount(current);

      if (current === 5) {
        clearInterval(interval);
        setGameState('waiting');

        // Random delay before lights go off (1200ms - 3200ms)
        const randomDelay = 1200 + Math.random() * 2000;
        timeoutRef.current = setTimeout(() => {
          setLightCount(0); // LIGHTS OUT!
          setGameState('ready');
          startTimeRef.current = performance.now();
        }, randomDelay);
      }
    }, 1000);
  };

  // User click or spacebar trigger
  const handleReactionClick = () => {
    if (gameState === 'sequence' || gameState === 'waiting') {
      // FALSE START!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('false_start');
      setLightCount(0);
      return;
    }

    if (gameState === 'ready' && startTimeRef.current) {
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTimeRef.current);
      setReactionTimeMs(elapsed);
      setGameState('finished');

      if (!bestReactionMs || elapsed < bestReactionMs) {
        setBestReactionMs(elapsed);
      }
    }
  };

  // Keyboard Spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && activeMode === 'lights') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'finished' || gameState === 'false_start') {
          startLightsSequence();
        } else {
          handleReactionClick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeMode]);

  // --- PIT STOP TIRE CHANGE LOGIC ---
  const startPitStop = () => {
    setWheelsDone([false, false, false, false]);
    setPitStopState('active');
    setPitStopTimeSec(null);
    pitStartTimeRef.current = performance.now();
  };

  const handleWheelClick = (index: number) => {
    if (pitStopState !== 'active') return;

    setWheelsDone((prev) => {
      const updated: [boolean, boolean, boolean, boolean] = [prev[0], prev[1], prev[2], prev[3]];
      updated[index] = true;

      // Check if all 4 wheels changed
      if (updated.every((w) => w)) {
        const endTime = performance.now();
        const durationSec = Math.round((endTime - (pitStartTimeRef.current || endTime)) / 10) / 100;
        setPitStopTimeSec(durationSec);
        setPitStopState('finished');
      }

      return updated;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-black text-white text-lg tracking-wide uppercase">PIT STOP & LIGHTS OUT CHALLENGE</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            TEST YOUR HUMAN REACTION TIME AGAINST F1 DRIVERS & WHEEL NUT CHANGE SPEED
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveMode('lights')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeMode === 'lights' ? 'bg-red-600 text-white shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            5 RED LIGHTS REACTION
          </button>
          <button
            onClick={() => setActiveMode('pitstop')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeMode === 'pitstop' ? 'bg-red-600 text-white shadow' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            2.0s TIRE CHANGE MINIGAME
          </button>
        </div>
      </div>

      {/* Mode 1: 5 Red Lights Out Reaction Test */}
      {activeMode === 'lights' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-8 text-center max-w-3xl mx-auto">
          
          <div className="space-y-2">
            <h3 className="font-extrabold text-white text-base font-mono uppercase tracking-wider">
              LIGHTS OUT AND AWAY WE GO!
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              PRESS SPACEBAR OR CLICK BUTTON WHEN ALL 5 RED LIGHTS TURN OFF!
            </p>
          </div>

          {/* 5 Red Lights Box */}
          <div
            onClick={handleReactionClick}
            className={`bg-slate-950 border p-8 rounded-2xl cursor-pointer select-none transition-all ${
              gameState === 'ready'
                ? 'border-emerald-500 shadow-2xl shadow-emerald-900/50'
                : gameState === 'false_start'
                ? 'border-red-600 shadow-2xl shadow-red-900/50'
                : 'border-slate-800'
            }`}
          >
            <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
              {[1, 2, 3, 4, 5].map((idx) => {
                const isLit = idx <= lightCount;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-75 ${
                        isLit
                          ? 'bg-red-600 border-red-400 shadow-lg shadow-red-600 animate-pulse'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Live State Prompt text */}
            <div className="mt-6 font-mono text-sm font-bold">
              {gameState === 'idle' && <span className="text-slate-400">CLICK "START LIGHTS" TO BEGIN</span>}
              {gameState === 'sequence' && <span className="text-amber-400 animate-pulse">LIGHTS COUNTING DOWN...</span>}
              {gameState === 'waiting' && <span className="text-red-400 font-black">HOLD ON... WAIT FOR LIGHTS OUT!</span>}
              {gameState === 'ready' && <span className="text-emerald-400 font-black text-lg animate-ping">GO GO GO! CLICK NOW!</span>}
              {gameState === 'finished' && reactionTimeMs && (
                <div className="space-y-2">
                  <span className="text-3xl font-black text-emerald-400 block">{reactionTimeMs} MS</span>
                  <span className="text-xs text-slate-300 font-semibold block">
                    {reactionTimeMs < 200
                      ? '⚡ GODLIKE! Max Verstappen / Lewis Hamilton Level!'
                      : reactionTimeMs < 250
                      ? '🔥 EXCELLENT! Official F1 Driver Grid Standard!'
                      : '👍 GOOD REACTION! Reserve Driver Pace!'}
                  </span>
                </div>
              )}
              {gameState === 'false_start' && (
                <span className="text-red-500 font-extrabold text-base block">
                  🚨 JUMP START PENALTY! CLICKED BEFORE LIGHTS OUT!
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-4">
            {(gameState === 'idle' || gameState === 'finished' || gameState === 'false_start') && (
              <button
                onClick={startLightsSequence}
                className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center space-x-2 text-sm"
              >
                <Play className="w-5 h-5" />
                <span>START LIGHTS SEQUENCE</span>
              </button>
            )}

            {bestReactionMs && (
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
                PERSONAL BEST: <strong className="text-amber-400">{bestReactionMs} MS</strong>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Mode 2: 2.0s Wheel Change Minigame */}
      {activeMode === 'pitstop' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-8 text-center max-w-3xl mx-auto">
          <div className="space-y-2">
            <h3 className="font-extrabold text-white text-base font-mono uppercase tracking-wider">
              2.0s PIT STOP TIRE CHANGE CHALLENGE
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              CLICK ALL 4 WHEEL GUNS AS FAST AS POSSIBLE TO BEAT MCLAREN'S 1.80s WORLD RECORD!
            </p>
          </div>

          {/* 4 Wheels Grid */}
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {['FRONT LEFT', 'FRONT RIGHT', 'REAR LEFT', 'REAR RIGHT'].map((name, idx) => {
              const isDone = wheelsDone[idx];
              return (
                <button
                  key={name}
                  onClick={() => handleWheelClick(idx)}
                  disabled={pitStopState !== 'active' || isDone}
                  className={`p-6 rounded-2xl border font-mono text-xs font-extrabold transition-all duration-100 flex flex-col items-center justify-center space-y-2 shadow-xl ${
                    isDone
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : pitStopState === 'active'
                      ? 'bg-red-950 border-red-500 text-white hover:scale-105 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">{name}</span>
                  <span className="text-base">{isDone ? '✅ NUT SECURED' : '🔧 CLICK WHEEL GUN'}</span>
                </button>
              );
            })}
          </div>

          {/* Control & Result */}
          <div className="space-y-4">
            {pitStopState === 'finished' && pitStopTimeSec && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-3xl font-black text-emerald-400 font-mono">{pitStopTimeSec.toFixed(2)} SECONDS</span>
                <p className="text-xs text-slate-300 font-mono">
                  {pitStopTimeSec < 2.0
                    ? '🏎️ WORLD RECORD SPEED! Red Bull / McLaren Crew Standard!'
                    : '🔧 GOOD PIT STOP! Under 3.0s target!'}
                </p>
              </div>
            )}

            <button
              onClick={startPitStop}
              className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 text-sm"
            >
              {pitStopState === 'active' ? 'CHANGING TIRES...' : 'START PIT STOP TIMER'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
