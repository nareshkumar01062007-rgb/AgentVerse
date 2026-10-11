import React from 'react';
import { ArrowRight, RotateCcw, BookOpen, Check } from 'lucide-react';
import { AgentData } from '../../types/agent';

interface GameFeedbackModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  agent: AgentData;
  score: number;
  reason: string;
  decisionsSummary: string[];
  onRetry: () => void;
  onExploreAlgorithm: () => void;
}

export const GameFeedbackModal: React.FC<GameFeedbackModalProps> = ({
  isOpen,
  isSuccess,
  agent,
  score,
  reason,
  decisionsSummary,
  onRetry,
  onExploreAlgorithm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg border-2 border-[#111111] bg-[#F8F7F4] p-8 sm:p-10 shadow-[10px_10px_0px_#111111] text-[#111111]">
        {/* Banner */}
        <div className="space-y-3 mb-6">
          <span className="label">
            {isSuccess ? 'Exercise Successfully Cleared' : 'Trial Analysis'}
          </span>
          <h3 className="font-serif text-4xl sm:text-5xl font-bold text-[#111111] leading-tight">
            {isSuccess ? 'Mission Accomplished.' : 'Trial Concluded.'}
          </h3>
          <p className="text-sm text-[#111111]/70 leading-relaxed font-sans">
            {isSuccess ? (
              <>
                You experienced how the <strong className="text-[#111111]">{agent.name}</strong> makes deterministic decisions. Now let&apos;s discover the authentic Python algorithm behind it.
              </>
            ) : (
              <>
                Every attempt reveals how intelligent agents respond to sensory constraints. Let&apos;s analyze what transpired and study the code.
              </>
            )}
          </p>
        </div>

        {/* Reason card */}
        <div className="space-y-4 mb-8">
          <div className="border border-[#111111]/20 bg-white p-5 space-y-2">
            <div className="flex items-center justify-between font-mono text-xs uppercase text-[#111111]/50 border-b border-[#111111]/10 pb-2">
              <span>Performance Review</span>
              <span className="text-[#FF4D00] font-bold">Score: {score}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
              {reason}
            </p>
          </div>

          {decisionsSummary && decisionsSummary.length > 0 && (
            <div className="border border-[#111111]/15 bg-white/70 p-4 font-mono text-xs space-y-1.5">
              <div className="text-[10px] text-[#111111]/50 uppercase tracking-widest mb-1 font-bold">
                Decision History Log:
              </div>
              <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {decisionsSummary.map((dec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#111111]/80">
                    <Check className="h-3 w-3 text-[#FF4D00] shrink-0 mt-0.5" />
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onExploreAlgorithm}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#111111] text-[#F8F7F4] px-5 py-4 font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF4D00] transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore the Algorithm</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 bg-[#FF4D00] text-white px-5 py-4 font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#111111] transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isSuccess ? 'Play Again' : 'Try Again'}</span>
          </button>

          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-1.5 border border-[#111111]/30 bg-white text-[#111111] px-4 py-4 font-mono text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            title="Reset game to initial parameters"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
