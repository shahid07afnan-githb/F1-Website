import React, { useState } from 'react';
import { RADIO_QUOTES } from '../data/f1Data';
import { RadioQuote } from '../types';
import { Radio, Play, Pause, Volume2, Sparkles, Filter } from 'lucide-react';

export const RadioSoundboard: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Iconic', 'Radio Meltdown', 'Tactical', 'Funny'];

  const filteredQuotes = selectedCategory === 'All'
    ? RADIO_QUOTES
    : RADIO_QUOTES.filter((q) => q.category === selectedCategory);

  // Play quote using Web Speech API + Web Audio API radio crackle static effect
  const playQuote = (quote: RadioQuote) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingId(quote.id);

      // Create Web Audio API Radio Static Crackle noise effect
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const bufferSize = ctx.sampleRate * 0.3; // 0.3s static burst
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1200; // Radio phone bandpass
          filter.Q.value = 3.0;

          noise.connect(filter);
          filter.connect(ctx.destination);
          noise.start();
        }
      } catch (e) {
        console.log('Audio static effect skipped', e);
      }

      const utterance = new SpeechSynthesisUtterance(quote.audioText);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;

      utterance.onend = () => {
        setPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="font-black text-white text-lg tracking-wide uppercase">HISTORIC F1 PIT RADIO VAULT</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            UNFILTERED DRIVER & TEAM PRINCIPAL COMMS WITH SYNTHESIZED RADIO CRACKLE EFFECT
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 font-mono text-xs overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quote Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((q) => {
          const isPlaying = playingId === q.id;
          return (
            <div
              key={q.id}
              className={`bg-slate-900/90 border rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all ${
                isPlaying ? 'border-red-500 shadow-red-900/40 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    {q.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {q.event} ({q.year})
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-white text-base">{q.driver}</h3>
                  <p className="text-xs text-slate-400 font-mono">{q.team}</p>
                </div>

                {/* Quote Text Bubble */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                  <p className="text-sm font-extrabold font-mono text-white italic leading-relaxed">
                    "{q.audioText}"
                  </p>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  <strong className="text-slate-300 font-mono">CONTEXT:</strong> {q.context}
                </p>
              </div>

              {/* Play Audio Button */}
              <button
                onClick={() => playQuote(q)}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  isPlaying
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'PLAYING RADIO TRANSMISSION...' : 'PLAY PIT RADIO AUDIO'}</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
