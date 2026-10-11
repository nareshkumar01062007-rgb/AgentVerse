import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AgentData } from '../../types/agent';
import { GameHeader } from './GameHeader';
import { GameFeedbackModal } from './GameFeedbackModal';

interface UtilityGameProps {
  agent: AgentData;
  onGameComplete: (success: boolean) => void;
  onOpenLab: () => void;
  onExit: () => void;
}

interface MealItem {
  id: string;
  name: string;
  taste: number;
  health: number;
  cost: number;
  icon: string;
  description: string;
}

const MENU_ITEMS: MealItem[] = [
  {
    id: 'salad',
    name: 'Superfood Salad Bowl',
    taste: 6,
    health: 10,
    cost: 7,
    icon: '🥗',
    description: 'Organic kale, quinoa, avocado, and vinaigrette.',
  },
  {
    id: 'burger',
    name: 'Gourmet Truffle Burger',
    taste: 10,
    health: 3,
    cost: 8,
    icon: '🍔',
    description: 'Dry-aged patty, brioche bun, and cheddar.',
  },
  {
    id: 'bento',
    name: 'Balanced Protein Bento',
    taste: 8,
    health: 8,
    cost: 5,
    icon: '🍱',
    description: 'Teriyaki salmon, brown rice, and edamame.',
  },
  {
    id: 'smoothie',
    name: 'Quick Energy Smoothie',
    taste: 7,
    health: 7,
    cost: 4,
    icon: '🥤',
    description: 'Greek yogurt, mixed berries, spinach, and chia.',
  },
  {
    id: 'tacos',
    name: 'Street Taco Platter',
    taste: 9,
    health: 4,
    cost: 6,
    icon: '🌮',
    description: 'Carnitas tacos with salsa verde and cotija cheese.',
  },
];

const PRESET_PERSONAS = [
  {
    name: 'Marathon Runner',
    description: 'Needs high nutrition, moderate taste, cost conscious.',
    weights: { taste: 3, health: 9, cost: 5 },
  },
  {
    name: 'Gourmet Foodie',
    description: 'Cares deeply about taste, zero concern for price.',
    weights: { taste: 10, health: 2, cost: 0 },
  },
  {
    name: 'Budget Student',
    description: 'Price sensitive while searching for nutritional energy.',
    weights: { taste: 5, health: 6, cost: 9 },
  },
];

export const UtilityGame: React.FC<UtilityGameProps> = ({
  agent,
  onGameComplete,
  onOpenLab,
  onExit,
}) => {
  const [weights, setWeights] = useState({ taste: 5, health: 7, cost: 4 });
  const [activePersonaIdx, setActivePersonaIdx] = useState<number | null>(0);
  const [score, setScore] = useState(0);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string>(
    'Adjust priority weights or select a user persona to observe utility distribution.'
  );
  const [decisionHistory, setDecisionHistory] = useState<string[]>([]);
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    reason: string;
  }>({ isOpen: false, isSuccess: false, reason: '' });

  const calculateUtility = (item: MealItem) => {
    return weights.taste * item.taste + weights.health * item.health - weights.cost * item.cost;
  };

  const menuWithUtility = MENU_ITEMS.map((item) => ({
    ...item,
    utility: calculateUtility(item),
  }));

  const maxUtilityMeal = [...menuWithUtility].sort((a, b) => b.utility - a.utility)[0];

  const handleApplyPersona = (idx: number) => {
    setActivePersonaIdx(idx);
    setWeights(PRESET_PERSONAS[idx].weights);
    setSelectedMealId(null);
    setEvaluationFeedback(`Loaded persona: "${PRESET_PERSONAS[idx].name}". Analyze which meal maximizes utility.`);
  };

  const handleWeightChange = (key: 'taste' | 'health' | 'cost', val: number) => {
    setActivePersonaIdx(null);
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleConfirmChoice = (meal: MealItem) => {
    setSelectedMealId(meal.id);
    const mealUtility = calculateUtility(meal);
    const isOptimal = meal.id === maxUtilityMeal.id;

    const logEntry = `Evaluated "${meal.name}" (Utility: ${mealUtility}) vs Max "${maxUtilityMeal.name}" (Utility: ${maxUtilityMeal.utility}) — ${
      isOptimal ? 'Optimal Pick ✓' : 'Suboptimal ✗'
    }`;
    setDecisionHistory((prev) => [...prev, logEntry]);

    if (isOptimal) {
      const newScore = score + 35;
      setScore(newScore);
      setEvaluationFeedback(
        `Rational Choice: "${meal.name}" achieves maximum utility (${mealUtility}) given active weights.`
      );

      setTimeout(() => {
        setGameOverModal({
          isOpen: true,
          isSuccess: true,
          reason: `Success! The Utility-Based Agent applied its multi-attribute utility formula U = (Wt*T + Wh*H - Wc*C) and identified the optimal candidate "${meal.name}" with score ${mealUtility}.`,
        });
        onGameComplete(true);
      }, 1000);
    } else {
      setEvaluationFeedback(
        `Suboptimal Choice: "${meal.name}" scored ${mealUtility}, while "${maxUtilityMeal.name}" yielded a superior utility of ${maxUtilityMeal.utility}.`
      );
    }
  };

  const restartGame = () => {
    setWeights(PRESET_PERSONAS[0].weights);
    setActivePersonaIdx(0);
    setScore(0);
    setSelectedMealId(null);
    setDecisionHistory([]);
    setEvaluationFeedback('Adjust priority weights or select a user persona to observe utility distribution.');
    setGameOverModal({ isOpen: false, isSuccess: false, reason: '' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <GameHeader
        agent={agent}
        score={score}
        onExit={onExit}
        onRestart={restartGame}
        onOpenLab={onOpenLab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Menu Candidates */}
        <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#111111]">
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4 mb-4">
            <div>
              <span className="label">Decision Space</span>
              <div className="font-serif text-xl font-bold text-[#111111]">
                Multi-Attribute Meal Candidates
              </div>
            </div>
            <div className="font-mono text-xs text-[#111111]">
              Max Candidate: <span className="font-bold text-[#FF4D00]">{maxUtilityMeal.name}</span>
            </div>
          </div>

          {/* Meal List */}
          <div className="space-y-3 my-2">
            {menuWithUtility.map((item) => {
              const isBest = item.id === maxUtilityMeal.id;
              const isSelected = selectedMealId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 border transition-all ${
                    isBest
                      ? 'border-2 border-[#111111] bg-[#F8F7F4]'
                      : 'border-[#111111]/20 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-xl font-bold text-[#111111]">{item.name}</h4>
                          {isBest && (
                            <span className="font-mono text-[9px] bg-[#111111] text-white px-1.5 py-0.5 uppercase tracking-wider font-bold">
                              ★ Max Utility
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#111111]/70">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-[#111111]/50 uppercase block">Utility</span>
                      <span className={`text-xl font-bold ${isBest ? 'text-[#FF4D00]' : 'text-[#111111]'}`}>
                        {item.utility}
                      </span>
                    </div>
                  </div>

                  {/* Attributes breakdown */}
                  <div className="flex items-center gap-4 font-mono text-xs text-[#111111]/70 mb-3 pt-1 border-t border-[#111111]/10">
                    <span>Taste: {item.taste}/10</span>
                    <span>Health: {item.health}/10</span>
                    <span>Cost: ${item.cost}/10</span>
                  </div>

                  {/* Select button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="font-mono text-[10px] text-[#111111]/50">
                      Formula: ({weights.taste}×{item.taste}) + ({weights.health}×{item.health}) - ({weights.cost}×{item.cost})
                    </div>
                    <button
                      onClick={() => handleConfirmChoice(item)}
                      className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#111111] text-white'
                          : 'border border-[#111111] hover:bg-[#111111] hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Pick Option'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border border-[#111111]/20 bg-[#F8F7F4] font-mono text-xs text-[#111111] mt-4">
            <span className="label inline mr-2">Evaluation:</span>
            <span>{evaluationFeedback}</span>
          </div>
        </div>

        {/* Right 5 cols: Weights & Personas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#111111]/20 bg-white p-6 space-y-3">
            <span className="label">User Personas</span>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {PRESET_PERSONAS.map((persona, idx) => (
                <button
                  key={persona.name}
                  onClick={() => handleApplyPersona(idx)}
                  className={`p-2.5 border text-left cursor-pointer transition-colors ${
                    activePersonaIdx === idx
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'border-[#111111]/20 text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  <div className="truncate">{persona.name}</div>
                  <div className="text-[10px] opacity-60">H:{persona.weights.health} C:{persona.weights.cost}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="border-2 border-[#111111] bg-white p-6 space-y-5">
            <span className="label">Utility Function Weights</span>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>Taste Importance (W_taste):</span>
                <span className="font-bold text-[#FF4D00]">{weights.taste}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={weights.taste}
                onChange={(e) => handleWeightChange('taste', Number(e.target.value))}
                className="w-full accent-[#FF4D00] cursor-pointer"
              />
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>Health Importance (W_health):</span>
                <span className="font-bold text-[#FF4D00]">{weights.health}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={weights.health}
                onChange={(e) => handleWeightChange('health', Number(e.target.value))}
                className="w-full accent-[#FF4D00] cursor-pointer"
              />
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>Cost Penalty (W_cost):</span>
                <span className="font-bold text-[#111111]">-{weights.cost}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={weights.cost}
                onChange={(e) => handleWeightChange('cost', Number(e.target.value))}
                className="w-full accent-[#111111] cursor-pointer"
              />
            </div>

            <div className="p-3 border border-[#111111]/15 bg-[#F8F7F4] font-mono text-xs text-[#111111]">
              <span className="text-[10px] uppercase text-[#111111]/50 block mb-0.5">Active Formulation:</span>
              U = ({weights.taste}×Taste) + ({weights.health}×Health) - ({weights.cost}×Cost)
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]/15">
              <button
                onClick={restartGame}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 border border-[#111111]/30 bg-[#F8F7F4] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Prefs</span>
              </button>
              <button
                onClick={restartGame}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#FF4D00] text-white hover:bg-[#111111] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                <span>Play Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <GameFeedbackModal
        isOpen={gameOverModal.isOpen}
        isSuccess={gameOverModal.isSuccess}
        agent={agent}
        score={score}
        reason={gameOverModal.reason}
        decisionsSummary={decisionHistory}
        onRetry={restartGame}
        onExploreAlgorithm={onOpenLab}
      />
    </div>
  );
};
