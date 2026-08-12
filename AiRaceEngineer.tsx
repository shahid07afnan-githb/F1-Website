import React, { useState, useRef, useEffect } from 'react';
import { TelemetryState, Circuit } from '../types';
import { CIRCUITS } from '../data/f1Data';
import { Cpu, Send, Radio, Volume2, Sparkles, MessageSquare, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

interface AiRaceEngineerProps {
  telemetry: TelemetryState;
}

interface Message {
  id: string;
  sender: 'user' | 'engineer';
  text: string;
  time: string;
}

export const AiRaceEngineer: React.FC<AiRaceEngineerProps> = ({ telemetry }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'engineer',
      text: "Copy that, driver. Apex-1 pit wall engineer online. Telemetry stream locked. Ask me for strategy calls, weather adjustments, telemetry analysis, or technical regulation breakdowns.",
      time: '14:30:00',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(CIRCUITS[1]);
  const [weatherCondition, setWeatherCondition] = useState<string>('Dry / 38°C Track Temp');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/engineer/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          circuit: selectedCircuit.name,
          driver: 'Driver #1',
          stint: `Lap ${telemetry.lapNumber}/${selectedCircuit.laps}, ${telemetry.tireCompound} Tires (${telemetry.tireWear}% wear)`,
          weather: weatherCondition,
          telemetryContext: {
            speed: `${telemetry.speed} km/h`,
            throttle: `${telemetry.throttle}%`,
            brake: `${telemetry.brake}%`,
            drs: telemetry.drs,
            ers: `${Math.round(telemetry.ersBattery)}%`,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Radio error');
      }

      const engineerMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'engineer',
        text: data.reply || 'Copy, radio static... Repeat query.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setMessages((prev) => [...prev, engineerMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'engineer',
          text: `⚠️ Radio link interruption: ${err.message || 'Unable to connect to Gemini AI Pit Engineer server.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech playback function with synthesized radio voice
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Left Sidebar: Presets & Live Scenario Configuration */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-extrabold text-white text-sm uppercase">PIT WALL COMMAND</h3>
              <p className="text-[11px] text-slate-400 font-mono">GEMINI 3.6 FLASH STRATEGY ENGINE</p>
            </div>
          </div>

          {/* Circuit context for prompt */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              TRACK CONTEXT
            </label>
            <select
              value={selectedCircuit.id}
              onChange={(e) => {
                const c = CIRCUITS.find((item) => item.id === e.target.value);
                if (c) setSelectedCircuit(c);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-500 focus:outline-none"
            >
              {CIRCUITS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Weather condition */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              WEATHER & TRACK TEMP
            </label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-500 focus:outline-none"
            >
              <option value="Dry / 38°C Track Temp">☀️ Dry / 38°C Track Temp</option>
              <option value="Light Rain Predicted in 5 laps">🌧️ Light Rain Predicted in 5 Laps</option>
              <option value="Heavy Downpour / Standing Water">⛈️ Heavy Downpour / Standing Water</option>
              <option value="Greasy Damp Surface (Inter tire window)">🌫️ Greasy Damp Surface (Inters)</option>
            </select>
          </div>

          {/* Preset Prompts Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              RECOMMENDED STRATEGY QUERIES
            </span>

            <button
              onClick={() => handleSend("Rain predicted at Turn 7 in 5 laps, we are in P2 on Mediums - Should we pit for Intermediate tires or wait?")}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 font-medium transition-all group flex items-start space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>Rain strategy call at Turn 7?</span>
            </button>

            <button
              onClick={() => handleSend("Explain active aerodynamics for 2026 regulations vs current ground effect Venturi floor systems.")}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 font-medium transition-all group flex items-start space-x-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>2026 Active Aero vs 2022 Ground Effect?</span>
            </button>

            <button
              onClick={() => handleSend("Break down the Undercut advantage vs Overcut on high degradation tracks like Barcelona/Bahrain.")}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 font-medium transition-all group flex items-start space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>Undercut vs Overcut mechanics?</span>
            </button>

            <button
              onClick={() => handleSend("What telemetry secrets make Max Verstappen and Lewis Hamilton so fast in high-speed entry cornering?")}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 font-medium transition-all group flex items-start space-x-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>Verstappen vs Hamilton telemetry comparison?</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-[650px] justify-between">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="font-extrabold text-white text-base tracking-wide uppercase">
                APEX-1 CHIEF RACE ENGINEER RADIO
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                TELEMETRY ENCRYPTED • {selectedCircuit.name} • LAP {telemetry.lapNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-400 hover:text-white font-mono flex items-center space-x-1 p-1.5 rounded bg-slate-950 border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>CLEAR RADIO</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-2 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                <span className={`text-[10px] font-mono font-bold uppercase ${msg.sender === 'user' ? 'text-red-400' : 'text-cyan-400'}`}>
                  {msg.sender === 'user' ? 'DRIVER (#1)' : 'CHIEF ENGINEER (APEX-1)'}
                </span>
              </div>

              <div
                className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed font-sans shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-red-950/80 border border-red-800/80 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-mono whitespace-pre-wrap'
                }`}
              >
                {msg.text}

                {/* Audio playback button for engineer responses */}
                {msg.sender === 'engineer' && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">APEX-1 VOICE SYNTH</span>
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>PLAY RADIO VOICE</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">APEX-1 COMPUTING TELEMETRY...</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-cyan-400 flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Analyzing tire degradation vectors & delta strategy...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 pt-3 border-t border-slate-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Race Engineer (e.g. 'Should we undercut Hamilton on lap 22?')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center space-x-2 text-xs font-mono"
          >
            <span>TRANSMIT</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
