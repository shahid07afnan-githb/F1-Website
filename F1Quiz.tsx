import React, { useState } from 'react';
import { DEFAULT_TRIVIA } from '../data/f1Data';
import { TriviaQuestion } from '../types';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Trophy, RefreshCw, ArrowRight } from 'lucide-react';

export const F1Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>(DEFAULT_TRIVIA);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('Historical Classics & Tech');
  const [difficulty, setDifficulty] = useState<string>('Hard Core');

  const currentQuestion = questions[currentIndex];

  // Fetch AI-generated custom trivia round from Express server
  const fetchAiTrivia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trivia/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty }),
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setAnsweredCount(0);
      }
    } catch (e) {
      console.error('Failed to generate trivia round', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent re-selecting

    setSelectedOption(index);
    setAnsweredCount((prev) => prev + 1);

    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & AI Generator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h2 className="font-black text-white text-lg tracking-wide uppercase">DYNAMIC F1 TRIVIA & KNOWLEDGE CHALLENGE</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            GENERATE DYNAMIC GEMINI TRIVIA ROUNDS ACROSS HISTORICAL ERA CLASSICS & REGULATION TECH
          </p>
        </div>

        {/* AI Trivia Generator Button */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-lg p-2 focus:outline-none"
          >
            <option value="Historical Classics & Tech">Historical Classics & Tech</option>
            <option value="Circuit Records & Pit Stops">Circuit Records & Pit Stops</option>
            <option value="Controversial Moments & Radio Comms">Controversial Moments & Radio</option>
            <option value="2026 Engine & Aero Regs">2026 Engine & Aero Regs</option>
          </select>

          <button
            onClick={fetchAiTrivia}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg transition-all shadow flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'GENERATING...' : 'GENERATE AI ROUND'}</span>
          </button>
        </div>
      </div>

      {/* Main Quiz Box */}
      {currentQuestion && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6 max-w-3xl mx-auto">
          
          {/* Question Header & Score */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-mono text-xs">
            <span className="text-slate-400 font-bold">
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span className="text-amber-400 font-bold">
              SCORE: {score} / {answeredCount}
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="font-extrabold text-white text-base leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 font-mono text-xs">
            {currentQuestion.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (selectedOption !== null) {
                if (idx === currentQuestion.correctIndex) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-red-950 border-red-500 text-red-300 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && idx === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {selectedOption !== null && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>EXPLANATION</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQuestion.explanation}
              </p>
              {currentQuestion.funFact && (
                <p className="text-xs text-amber-300 font-mono pt-1">
                  💡 <strong>FUN FACT:</strong> {currentQuestion.funFact}
                </p>
              )}
            </div>
          )}

          {/* Next Question / Finish Button */}
          {selectedOption !== null && (
            <div className="flex justify-end pt-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 text-xs"
                >
                  <span>NEXT QUESTION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono w-full">
                  <span className="text-emerald-400 font-extrabold text-base block">
                    ROUND COMPLETED! SCORE: {score} / {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    RANK TIER: {score === questions.length ? '🏆 CHIEF RACE STRATEGIST!' : '🏎️ PIT WALL ANALYST!'}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
