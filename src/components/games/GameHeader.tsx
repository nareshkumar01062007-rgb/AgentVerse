import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Info, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AgentData } from '../../types/agent';

interface GameHeaderProps {
  agent: AgentData;
  score: number;
  totalRounds?: number;
  currentRound?: number;
  onExit: () => void;
  onRestart: () => void;
  onOpenLab: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  agent,
  score,
  totalRounds,
  currentRound,
  onExit,
  onRestart,
  onOpenLab,
}) => {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <div className="space-y-4 mb-8">
      {/* Editorial Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#111111] pb-5">
        {/* Left: Back button & Module Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 border border-[#111111]/30 bg-white px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Arena</span>
          </button>

          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#FF4D00] uppercase font-bold">
              <span>Module 0{agent.number}</span>
              <span className="opacity-40">|</span>
              <span className="text-[#111111]/60 font-normal">{agent.category}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
              {agent.gameName}
            </h2>
          </div>
        </div>

        {/* Right: Round, Score & Navigation */}
        <div className="flex items-center gap-3">
          {totalRounds && (
            <div className="border border-[#111111]/20 bg-white px-3.5 py-1.5 font-mono text-xs text-[#111111]">
              Round: <span className="text-[#FF4D00] font-bold">{currentRound || 1}</span> / {totalRounds}
            </div>
          )}

          <div className="border border-[#111111]/20 bg-white px-3.5 py-1.5 font-mono text-xs text-[#111111]">
            Score: <span className="text-[#FF4D00] font-bold">{score}</span>
          </div>

          <button
            onClick={() => setBriefOpen(!briefOpen)}
            className="flex items-center gap-1.5 border border-[#111111]/30 bg-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            <Info className="h-3.5 w-3.5 text-[#FF4D00]" />
            <span className="hidden sm:inline">Rules &amp; Brief</span>
            {briefOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 border border-[#111111]/30 bg-white px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            title="Reset Game to initial state"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#FF4D00]" />
            <span>Reset Game</span>
          </button>

          <button
            onClick={onOpenLab}
            className="flex items-center gap-2 bg-[#111111] text-[#F8F7F4] px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold hover:bg-[#FF4D00] transition-colors cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Algorithm Lab</span>
          </button>
        </div>
      </div>

      {/* Expandable Brief */}
      {briefOpen && (
        <div className="border-2 border-[#111111] bg-white p-6 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="label">Agent Concept</span>
              <p className="text-[#111111] leading-relaxed">{agent.definition}</p>
            </div>
            <div className="space-y-1">
              <span className="label">Win Condition</span>
              <p className="text-[#111111] leading-relaxed">{agent.winCondition}</p>
            </div>
            <div className="space-y-1">
              <span className="label">Operational Instructions</span>
              <ul className="text-[#111111]/80 list-disc list-inside space-y-1">
                {agent.controlsExplanation.slice(0, 3).map((ctrl, i) => (
                  <li key={i}>{ctrl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
