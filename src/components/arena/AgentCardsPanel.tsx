import React from 'react';
import { Fan, Bot, Mountain, Scale, BrainCircuit } from 'lucide-react';
import { AgentId } from '../../types/agent';

interface AgentCardsPanelProps {
  activeAgentId: AgentId;
  onSelectAgent: (id: AgentId) => void;
}

export const AGENT_MODE_DATA = [
  {
    id: 'simple-reflex' as AgentId,
    name: 'Simple Reflex Agent',
    description: 'React based on current situation',
    color: '#00E6B8',
    glowClass: 'glow-teal',
    borderColor: 'border-[#00E6B8]',
    textColor: 'text-[#00E6B8]',
    bgIcon: 'bg-[#00E6B8]/15',
    icon: Fan,
  },
  {
    id: 'model-based' as AgentId,
    name: 'Model-Based Agent',
    description: 'Use memory of previous states',
    color: '#168BFF',
    glowClass: 'glow-blue',
    borderColor: 'border-[#168BFF]',
    textColor: 'text-[#168BFF]',
    bgIcon: 'bg-[#168BFF]/15',
    icon: Bot,
  },
  {
    id: 'goal-based' as AgentId,
    name: 'Goal-Based Agent',
    description: 'Plan actions to reach a goal',
    color: '#FFB020',
    glowClass: 'glow-amber',
    borderColor: 'border-[#FFB020]',
    textColor: 'text-[#FFB020]',
    bgIcon: 'bg-[#FFB020]/15',
    icon: Mountain,
  },
  {
    id: 'utility-based' as AgentId,
    name: 'Utility-Based Agent',
    description: 'Choose the best option (maximize utility)',
    color: '#8B5CF6',
    glowClass: 'glow-violet',
    borderColor: 'border-[#8B5CF6]',
    textColor: 'text-[#8B5CF6]',
    bgIcon: 'bg-[#8B5CF6]/15',
    icon: Scale,
  },
  {
    id: 'learning' as AgentId,
    name: 'Learning Agent',
    description: 'Learn from experience',
    color: '#F044A7',
    glowClass: 'glow-magenta',
    borderColor: 'border-[#F044A7]',
    textColor: 'text-[#F044A7]',
    bgIcon: 'bg-[#F044A7]/15',
    icon: BrainCircuit,
  },
];

export const AgentCardsPanel: React.FC<AgentCardsPanelProps> = ({
  activeAgentId,
  onSelectAgent,
}) => {
  return (
    <div className="relative rounded-2xl border border-[#162238] bg-[#091126]/90 p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
      {/* Title & Subtitle */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
          Five Types of Agents
        </h2>
        <p className="text-xs text-[#B9C5DF]">
          Click on any agent to play a game and learn
        </p>
      </div>

      {/* 5 Vertical Cards in a Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 items-stretch flex-1">
        {AGENT_MODE_DATA.map((card) => {
          const Icon = card.icon;
          const isSelected = activeAgentId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectAgent(card.id)}
              className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${card.borderColor} bg-[#0D1836] ${card.glowClass} scale-[1.02]`
                  : `border-[#182747] bg-[#0B1428] hover:border-slate-500 hover:bg-[#0D1836]`
              }`}
              style={{
                boxShadow: isSelected ? `0 0 18px -2px ${card.color}40` : undefined,
              }}
            >
              {/* Top: Glowing Icon */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105 ${card.bgIcon}`}
                  style={{
                    borderColor: `${card.color}60`,
                    boxShadow: `0 0 15px ${card.color}35`,
                  }}
                >
                  <Icon className="h-7 w-7" style={{ color: card.color }} />
                </div>

                {/* Agent Name */}
                <h3 className="text-xs sm:text-[13px] font-bold text-white leading-tight min-h-[32px] flex items-center justify-center">
                  {card.name}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-[#B9C5DF] leading-snug line-clamp-2">
                  {card.description}
                </p>
              </div>

              {/* Bottom Outlined Button */}
              <div className="pt-4 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent(card.id);
                  }}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-[11px] font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? `bg-transparent ${card.textColor}`
                      : `bg-[#0B1428] ${card.textColor} hover:bg-white/5`
                  }`}
                  style={{
                    borderColor: card.color,
                  }}
                >
                  <span>Play Game</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
