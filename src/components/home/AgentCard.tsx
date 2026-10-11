import React from 'react';
import { ArrowRight, BookOpen, Check } from 'lucide-react';
import { AgentData } from '../../types/agent';

interface AgentCardProps {
  agent: AgentData;
  isCompleted: boolean;
  onPlayGame: (agentId: string) => void;
  onOpenLab: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isCompleted,
  onPlayGame,
  onOpenLab,
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between border bg-white p-6 sm:p-8 transition-all duration-200 ${
        isCompleted
          ? 'border-2 border-[#111111] shadow-[6px_6px_0px_#111111]'
          : 'border-[#111111]/20 hover:border-[#111111] hover:shadow-[6px_6px_0px_#111111]'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="label mb-1">
              Module 0{agent.number} · {agent.category}
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#111111] tracking-tight group-hover:text-[#FF4D00] transition-colors">
              {agent.name}
            </h3>
          </div>

          {isCompleted && (
            <span className="font-mono text-[10px] text-[#FF4D00] border border-[#FF4D00] px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 font-bold">
              <Check className="h-3 w-3" />
              Passed
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="font-serif italic text-lg text-[#FF4D00] mb-4">
          &ldquo;{agent.tagline}&rdquo;
        </p>

        {/* Simple Definition */}
        <p className="text-xs text-[#111111]/70 leading-relaxed mb-6">
          {agent.definition}
        </p>

        {/* Real-World Analogy */}
        <div className="p-4 border border-[#111111]/10 bg-[#F8F7F4] mb-4 space-y-1">
          <div className="font-mono text-[10px] uppercase text-[#111111]/50 tracking-wider">
            Real-World System:
          </div>
          <div className="text-xs text-[#111111] font-medium">
            {agent.realWorldExample}
          </div>
        </div>

        {/* Challenge Mission */}
        <div className="p-4 border border-[#111111]/15 bg-white space-y-1">
          <div className="font-mono text-[10px] uppercase text-[#FF4D00] tracking-wider font-bold">
            Laboratory Exercise: {agent.gameName}
          </div>
          <div className="text-xs text-[#111111]/80">
            {agent.whatPlayerWillDo}
          </div>
        </div>
      </div>

      {/* Action Buttons Zone */}
      <div className="pt-6 border-t border-[#111111]/10 mt-6 flex items-center gap-3">
        <button
          onClick={() => onPlayGame(agent.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#111111] text-[#F8F7F4] py-3.5 px-4 font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#FF4D00] transition-colors cursor-pointer"
        >
          <span>Play Challenge</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onOpenLab(agent.id)}
          className="inline-flex items-center justify-center gap-1.5 border border-[#111111]/20 bg-transparent py-3.5 px-4 font-mono text-xs uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          title="Jump directly to Python algorithm"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Code Lab</span>
        </button>
      </div>
    </div>
  );
};
