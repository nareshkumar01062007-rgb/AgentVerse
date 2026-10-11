import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { UserProgress, AgentData } from '../types/agent';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  agents: AgentData[];
  onSelectAgent: (agentId: string) => void;
  onResetProgress: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  agents,
  onSelectAgent,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalGames = agents.length;
  const completedCount = progress.completedGames.length;
  const completionPercentage = Math.round((completedCount / totalGames) * 100);
  const allCompleted = completedCount === totalGames;

  const badgeTitles: Record<string, { title: string; desc: string }> = {
    'simple-reflex': { title: 'Thermal Tactician', desc: 'Resolved reflex condition-action rule threshold' },
    'model-based': { title: 'Master Cartographer', desc: 'Maintained internal state to avoid dead ends' },
    'goal-based': { title: 'Optimal Pathfinder', desc: 'Formulated BFS goal planning route' },
    'utility-based': { title: 'Utility Maestro', desc: 'Weighted multi-attribute preference trade-offs' },
    'learning': { title: 'Reinforcement Pioneer', desc: 'Converged Q-table values via trial & error' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl border-2 border-[#111111] bg-[#F8F7F4] p-8 shadow-[12px_12px_0px_#111111] text-[#111111] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-4 mb-6">
          <div>
            <span className="label mb-1">Curriculum Record</span>
            <h3 className="font-serif text-3xl font-bold text-[#111111]">
              Agent Explorer Progress.
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#111111]/20 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Master Badge banner if all complete */}
        {allCompleted && (
          <div className="mb-6 p-6 border-2 border-[#111111] bg-[#111111] text-[#F8F7F4] space-y-2">
            <span className="label text-[#FF4D00]">Master Accreditation</span>
            <h4 className="font-serif text-3xl font-bold text-white">AI Agent Explorer</h4>
            <p className="text-xs text-[#F8F7F4]/80 leading-relaxed font-mono">
              You have completed all five foundational intelligent agent paradigms and verified their Python algorithms.
            </p>
          </div>
        )}

        {/* Overall progress meter */}
        <div className="mb-6 border border-[#111111]/20 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
            <span className="font-bold">Syllabus Completion</span>
            <span className="text-[#FF4D00] font-bold">{completionPercentage}% Completed</span>
          </div>
          <div className="h-3 w-full border border-[#111111] bg-[#F8F7F4] p-0.5">
            <div
              className="h-full bg-[#111111] transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-[#111111]/60 pt-2 border-t border-[#111111]/10">
            <span>{completedCount} of 5 Modules Cleared</span>
            <span>{progress.starsCount} Achievement Stars</span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4 mb-8">
          <span className="label">Accreditation Modules</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const isGameDone = progress.completedGames.includes(agent.id);
              const isQuizDone = progress.quizzesPassed.includes(agent.id);
              const badge = badgeTitles[agent.id];

              return (
                <div
                  key={agent.id}
                  className={`p-5 border transition-all ${
                    isGameDone
                      ? 'border-[#111111] bg-white'
                      : 'border-[#111111]/15 bg-white/50 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-mono text-[10px] text-[#FF4D00] uppercase font-bold">
                        Module 0{agent.number}
                      </div>
                      <h5 className="font-serif text-xl font-bold text-[#111111]">
                        {badge?.title}
                      </h5>
                    </div>
                    {isGameDone ? (
                      <span className="font-mono text-[10px] text-[#FF4D00] font-bold border border-[#FF4D00] px-1.5 py-0.5">
                        Passed
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#111111]/40 border border-[#111111]/20 px-1.5 py-0.5">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#111111]/70 leading-relaxed mb-4">
                    {badge?.desc}
                  </p>
                  <div className="pt-3 border-t border-[#111111]/10 flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-[#111111]/50 uppercase">
                      Quiz: {isQuizDone ? 'Mastered' : 'Unfinished'}
                    </span>
                    <button
                      onClick={() => {
                        onSelectAgent(agent.id);
                        onClose();
                      }}
                      className="text-[#FF4D00] hover:underline font-bold cursor-pointer"
                    >
                      {isGameDone ? 'Open Lab →' : 'Launch Challenge →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-[#111111]">
          <button
            onClick={() => {
              if (window.confirm('Reset all progress records and cached achievements?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 font-mono text-xs text-rose-600 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Local Records</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#FF4D00] transition-colors cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
