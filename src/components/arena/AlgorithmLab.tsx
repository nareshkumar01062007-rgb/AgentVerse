import React, { useState } from 'react';
import { 
  Globe, 
  Lightbulb, 
  Bot, 
  Fan, 
  Copy, 
  Check, 
  Target, 
  CheckCircle2, 
  Code2, 
  BrainCircuit, 
  Sliders, 
  Play, 
  HelpCircle,
  Layers,
  MapPin,
  Scale,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Home,
  Compass,
  Award,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { AgentId } from '../../types/agent';
import { AGENTS_DATA } from '../../data/agents';

interface AlgorithmLabProps {
  activeAgentId: AgentId;
  onSelectAgent: (id: AgentId) => void;
  isGameCompleted?: boolean;
  onNextGame?: (nextAgentId: AgentId) => void;
  onReplayGames?: () => void;
  onReturnHome?: () => void;
}

const NEXT_AGENT_MAP: Record<AgentId, { id: AgentId; name: string } | null> = {
  'simple-reflex': { id: 'model-based', name: 'Model-Based Agent (Game 2)' },
  'model-based': { id: 'goal-based', name: 'Goal-Based Agent (Game 3)' },
  'goal-based': { id: 'utility-based', name: 'Utility-Based Agent (Game 4)' },
  'utility-based': { id: 'learning', name: 'Learning Agent (Game 5)' },
  'learning': null,
};

export const AlgorithmLab: React.FC<AlgorithmLabProps> = ({
  activeAgentId,
  onSelectAgent,
  isGameCompleted = false,
  onNextGame,
  onReplayGames,
  onReturnHome,
}) => {
  const [activeTab, setActiveTab] = useState<
    'how-it-works' | 'worked-example' | 'quiz' | 'code' | 'try-input' | 'overview' | 'game-mapping'
  >('how-it-works');

  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Input states for interactive simulation tab
  const [customTemp, setCustomTemp] = useState(34);
  const [customThreshold, setCustomThreshold] = useState(30);
  const [customWeights, setCustomWeights] = useState({ taste: 7, health: 8, cost: 3 });
  const [customMazeState, setCustomMazeState] = useState({ r: 1, c: 2, memoryVisited: 6, wallAhead: true });
  const [customGoalCoords, setCustomGoalCoords] = useState({ startR: 2, startC: 1, goalR: 0, goalC: 4 });
  const [customLearnParams, setCustomLearnParams] = useState({ reward: 15, alpha: 0.5, gamma: 0.9, prevQ: 20 });

  const agent = AGENTS_DATA.find((a) => a.id === activeAgentId) || AGENTS_DATA[0];
  const nextAgent = NEXT_AGENT_MAP[activeAgentId];

  const handleCopy = () => {
    navigator.clipboard.writeText(agent.pythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  // Workflow items per agent
  const getWorkflowItems = () => {
    switch (activeAgentId) {
      case 'simple-reflex':
        return [
          { icon: Globe, label: 'Environment (Room)', bg: 'bg-cyan-500/20 text-cyan-400' },
          { icon: Lightbulb, label: 'Sensor (Temp = 34°C)', bg: 'bg-amber-500/20 text-amber-400' },
          { icon: Bot, label: 'Rule (34 > 30°C)', bg: 'bg-blue-500/20 text-blue-400' },
          { icon: Fan, label: 'Action (Fan ON)', bg: 'bg-emerald-500/20 text-emerald-400' },
        ];
      case 'model-based':
        return [
          { icon: Globe, label: 'Environment (5×5 Maze)', bg: 'bg-blue-500/20 text-blue-400' },
          { icon: Layers, label: 'Memory (Visited Set)', bg: 'bg-cyan-500/20 text-cyan-400' },
          { icon: Bot, label: 'Decision (Avoid Loops)', bg: 'bg-indigo-500/20 text-indigo-400' },
          { icon: Play, label: 'Action (Step / Backtrack)', bg: 'bg-teal-500/20 text-teal-400' },
        ];
      case 'goal-based':
        return [
          { icon: Globe, label: 'Environment (Grid)', bg: 'bg-amber-500/20 text-amber-400' },
          { icon: MapPin, label: 'Goal Flag at (0,4)', bg: 'bg-rose-500/20 text-rose-400' },
          { icon: Compass, label: 'Search Plan (BFS)', bg: 'bg-amber-500/20 text-amber-400' },
          { icon: Play, label: 'Action (Optimal Steps)', bg: 'bg-emerald-500/20 text-emerald-400' },
        ];
      case 'utility-based':
        return [
          { icon: Globe, label: 'Candidate Meals', bg: 'bg-violet-500/20 text-violet-400' },
          { icon: Sliders, label: 'Weights (Wh, Wt, Wc)', bg: 'bg-purple-500/20 text-purple-400' },
          { icon: Scale, label: 'Utility Formula U(x)', bg: 'bg-violet-500/20 text-violet-400' },
          { icon: Check, label: 'Action (argmax U)', bg: 'bg-teal-500/20 text-teal-400' },
        ];
      case 'learning':
        return [
          { icon: Globe, label: 'Grid (+Coins, -Spikes)', bg: 'bg-pink-500/20 text-pink-400' },
          { icon: BrainCircuit, label: 'Q-Table Matrix Q(s,a)', bg: 'bg-rose-500/20 text-rose-400' },
          { icon: Cpu, label: 'TD Error Update', bg: 'bg-pink-500/20 text-pink-400' },
          { icon: Play, label: 'Action (Optimal Policy)', bg: 'bg-emerald-500/20 text-emerald-400' },
        ];
    }
  };

  const workflowItems = getWorkflowItems();

  // Step-by-step description
  const getStepByStepExplanation = () => {
    switch (activeAgentId) {
      case 'simple-reflex':
        return [
          { step: 1, title: 'Observe Percept', desc: 'Digital thermometer reads the current room temperature from the environment.' },
          { step: 2, title: 'Evaluate Condition', desc: 'Checks if current temperature exceeds the comfort boundary: IF Temp > 30°C.' },
          { step: 3, title: 'Select Action', desc: 'Maps the matched condition to a discrete action without consulting memory.' },
          { step: 4, title: 'Execute on Actuator', desc: 'Fan relay switch is turned ON or kept OFF to normalize the room climate.' },
        ];
      case 'model-based':
        return [
          { step: 1, title: 'Observe Current Cell', desc: 'Robot senses its coordinate position and immediately adjacent walls.' },
          { step: 2, title: 'Update Internal State', desc: 'Records the current coordinate in memory (visited.add(pos)) to remember it has been explored.' },
          { step: 3, title: 'Check Unvisited Neighbors', desc: 'Prioritizes unexplored cells toward the goal, avoiding loops between visited tiles.' },
          { step: 4, title: 'Backtrack If Blocked', desc: 'When hitting a dead-end, consults its model memory to backtrack to the last open junction.' },
        ];
      case 'goal-based':
        return [
          { step: 1, title: 'Formulate Explicit Goal', desc: 'Agent establishes destination target: delivery flag at coordinate (0, 4).' },
          { step: 2, title: 'Search State Space', desc: 'Runs Breadth-First Search (BFS) to explore candidate paths expanding level by level.' },
          { step: 3, title: 'Evaluate Heuristic', desc: 'Calculates Manhattan Distance: h(n) = |r - gr| + |c - gc| to measure steps remaining.' },
          { step: 4, title: 'Execute Optimal Sequence', desc: 'Carries out the shortest obstacle-free action sequence directly to the destination.' },
        ];
      case 'utility-based':
        return [
          { step: 1, title: 'Perceive Multi-Attributes', desc: 'Observes candidates (Salad, Burger, Pizza) with Health, Taste, and Cost scores.' },
          { step: 2, title: 'Apply Preference Weights', desc: 'Multiplies user priorities Wh (Health), Wt (Taste), and subtracts penalty Wc (Cost).' },
          { step: 3, title: 'Calculate Scalar Utility', desc: 'Evaluates U(x) = Wh·Health + Wt·Taste − Wc·Cost for every candidate option.' },
          { step: 4, title: 'Select Maximum Utility', desc: 'Applies principle of Maximum Expected Utility to recommend argmax U(x).' },
        ];
      case 'learning':
        return [
          { step: 1, title: 'Interact with Grid World', desc: 'Agent takes an action in state s using an exploration vs exploitation balance (ε-greedy).' },
          { step: 2, title: 'Receive Environmental Reward', desc: 'Collects feedback: +15 for coin, -20 for spike penalty, +50 for star goal.' },
          { step: 3, title: 'Calculate TD Error', desc: 'TD Target = Reward + γ · max Q(next_s, a\'); Error = TD Target − Q(s, a).' },
          { step: 4, title: 'Update Q-Table', desc: 'Updates estimated value: Q(s, a) ← Q(s, a) + α · TD Error, converging on optimal policy.' },
        ];
    }
  };

  const stepList = getStepByStepExplanation();

  return (
    <div
      id="learning-section"
      className="rounded-2xl border border-[#162747] bg-[#091126] p-5 sm:p-7 shadow-2xl relative space-y-6"
    >
      {/* Stable Anchor for this specific agent */}
      <div id={`learning-section-${activeAgentId}`} className="sr-only">
        Learning Section for {agent.name}
      </div>

      {/* Completion Banner (shown if game completed or student reached here) */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isGameCompleted
          ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 shadow-lg shadow-emerald-500/10'
          : 'border-violet-500/40 bg-[#0B152E]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-md">
            {isGameCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-300" /> : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Game {agent.number} Learning Section
              </span>
              {isGameCompleted && (
                <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-extrabold uppercase">
                  Level Completed ✓
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {agent.name}: {agent.gameName}
            </h2>
            <p className="text-xs text-slate-300">
              {agent.tagline} Discover the core AI algorithm demonstrated in this game.
            </p>
          </div>
        </div>

        {nextAgent && (
          <button
            onClick={() => onNextGame && onNextGame(nextAgent.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all cursor-pointer self-start sm:self-center shrink-0 hover:scale-105 active:scale-95"
          >
            <span>Next Game: {nextAgent.name.split(' ')[0]}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#142342]">
        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'how-it-works'
              ? 'bg-blue-600/30 text-white border border-blue-500/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Concept &amp; Flowchart
        </button>
        <button
          onClick={() => setActiveTab('worked-example')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'worked-example'
              ? 'bg-cyan-600/30 text-white border border-cyan-500/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Worked Game Example
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-emerald-600/30 text-white border border-emerald-500/60 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Knowledge Check (Quiz)
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'code'
              ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Python Code
        </button>
        <button
          onClick={() => setActiveTab('try-input')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'try-input'
              ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Try with Your Own Input
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Theory &amp; Limitations
        </button>
        <button
          onClick={() => setActiveTab('game-mapping')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'game-mapping'
              ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          Game Mapping
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: Concept & Flowchart (What it means, why used, step-by-step, flowchart) */}
      {/* ========================================================================= */}
      {activeTab === 'how-it-works' && (
        <div className="space-y-6">
          {/* Top 2 Cards: Meaning & Why Agent Uses It */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-cyan-500/30 bg-[#0B1428] p-4 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
                1. What the Concept Means
              </span>
              <h3 className="text-sm font-bold text-white">
                {agent.name}: Core Architecture
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {agent.definition}
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-black/40 p-2 rounded border border-cyan-500/20 mt-2">
                <strong>Real-World Example:</strong> {agent.realWorldExample}
              </div>
            </div>

            <div className="rounded-xl border border-violet-500/30 bg-[#0B1428] p-4 space-y-2">
              <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-bold block">
                2. Why the Agent Uses It
              </span>
              <h3 className="text-sm font-bold text-white">
                The Practical Advantage
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {agent.poaiConcept}
              </p>
              <div className="text-[11px] text-slate-300 bg-black/40 p-2 rounded border border-violet-500/20 mt-2">
                <strong className="text-rose-400 block mb-0.5">Known Limitations:</strong>
                <span>{agent.limitations}</span>
              </div>
            </div>
          </div>

          {/* Flowchart / Diagram */}
          <div className="rounded-xl border border-[#162747] bg-[#070E20] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#142342] pb-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                5. Visual Flowchart: How Data Flows Through the {agent.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Continuous Perception-Action Cycle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-center py-2">
              {workflowItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <React.Fragment key={idx}>
                    <div className="p-3 rounded-xl border border-slate-800 bg-[#0A142A] flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} mb-1.5 shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold text-white leading-tight">
                        {item.label}
                      </span>
                    </div>
                    {idx < workflowItems.length - 1 && (
                      <span className="hidden sm:block text-slate-500 font-bold text-base">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Explanation */}
          <div className="rounded-xl border border-[#162747] bg-[#0B1428] p-4 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase block">
              4. Step-by-Step Decision Execution
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stepList.map((st) => (
                <div key={st.step} className="p-3 rounded-lg border border-slate-800 bg-black/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-mono">
                      {st.step}
                    </span>
                    <span>{st.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Worked Game Example (Actual game values, calculation, expected output) */}
      {/* ========================================================================= */}
      {activeTab === 'worked-example' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-cyan-500/30 bg-[#0B1428] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142342] pb-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">
                  7. Small Worked Example
                </span>
                <h3 className="text-base font-bold text-white">
                  Step-by-Step Numerical Walkthrough using Exact Values from the Game
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30 font-bold">
                Game: {agent.gameName}
              </span>
            </div>

            {/* Agent Specific Worked Walkthrough */}
            {activeAgentId === 'simple-reflex' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Sensor Percept:</span>
                    <strong className="text-cyan-300 text-sm">Room Temp = 34°C</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Condition Rule:</span>
                    <strong className="text-amber-300 text-sm">IF Temp &gt; 30°C</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Prescribed Action:</span>
                    <strong className="text-emerald-300 text-sm">Turn Fan ON</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#070D1E] border border-cyan-500/20 text-slate-200 space-y-1.5 font-sans text-xs">
                  <h4 className="font-bold text-white font-mono text-xs">Arithmetic &amp; Logic Breakdown:</h4>
                  <p>1. The digital thermometer samples the current ambient heat: <code>34.0°C</code>.</p>
                  <p>2. The reflex agent tests the boolean condition: <code>34 &gt; 30 → TRUE</code>.</p>
                  <p>3. Because the condition is TRUE, the agent immediately issues the action signal to the smart fan relay switch.</p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-emerald-400 font-bold text-xs">
                    Expected Result: Fan blades spin up actively, providing immediate cooling.
                  </div>
                </div>
              </div>
            )}

            {activeAgentId === 'model-based' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Robot Position:</span>
                    <strong className="text-cyan-300 text-sm">Current Coordinate: (1, 2)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Internal State Memory:</span>
                    <strong className="text-blue-300 text-sm">Visited Set: &#123;(0,0), (0,1), (0,2), (1,2)&#125;</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Surrounding Walls:</span>
                    <strong className="text-rose-300 text-sm">Wall ahead at (1, 3)</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#070D1E] border border-blue-500/20 text-slate-200 space-y-1.5 font-sans text-xs">
                  <h4 className="font-bold text-white font-mono text-xs">Arithmetic &amp; Logic Breakdown:</h4>
                  <p>1. The robot checks candidate moves: Up (0,2), Down (2,2), Left (1,1), Right (1,3).</p>
                  <p>2. (1,3) is blocked by a wall obstacle. (0,2) is already in the memory set <code>visited</code>.</p>
                  <p>3. (2,2) is open and <em>not</em> in <code>visited</code>. The agent selects <code>Move Down to (2,2)</code> and adds it to its internal model: <code>visited.add((2,2))</code>.</p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-emerald-400 font-bold text-xs">
                    Expected Result: Robot avoids infinite looping between (1,2) and (0,2) by consulting memory.
                  </div>
                </div>
              </div>
            )}

            {activeAgentId === 'goal-based' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Start Coordinate:</span>
                    <strong className="text-amber-300 text-sm">Robot at (2, 1)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Target Goal Flag:</span>
                    <strong className="text-rose-300 text-sm">Flag at (0, 4)</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Heuristic h(n):</span>
                    <strong className="text-emerald-300 text-sm">|2-0| + |1-4| = 5 Steps</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#070D1E] border border-amber-500/20 text-slate-200 space-y-1.5 font-sans text-xs">
                  <h4 className="font-bold text-white font-mono text-xs">Arithmetic &amp; Logic Breakdown:</h4>
                  <p>1. The goal test checks if <code>current == (0, 4)</code>.</p>
                  <p>2. Manhattan distance calculation: <code>h = |start_r - goal_r| + |start_c - goal_c| = |2 - 0| + |1 - 4| = 2 + 3 = 5</code>.</p>
                  <p>3. Breadth-First Search (BFS) queue expands open neighbors around obstacles (water lake and mountain) to generate the guaranteed shortest route: <code>[Up, Up, Right, Right, Right]</code>.</p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-emerald-400 font-bold text-xs">
                    Expected Result: Robot delivers package to the flag destination in exactly 5 moves.
                  </div>
                </div>
              </div>
            )}

            {activeAgentId === 'utility-based' && (
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">User Weights:</span>
                    <strong className="text-violet-300 text-sm">Wh=7, Wt=5, Wc=4</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Formula:</span>
                    <strong className="text-cyan-300 text-sm">U = Wh·H + Wt·T − Wc·C</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Optimal argmax:</span>
                    <strong className="text-emerald-300 text-sm">Salad 🥗 (U = 71)</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#070D1E] border border-violet-500/20 text-slate-200 space-y-1.5 font-sans text-xs">
                  <h4 className="font-bold text-white font-mono text-xs">Arithmetic &amp; Logic Breakdown:</h4>
                  <p className="font-mono text-[11px] text-cyan-300">
                    • Salad (H:9, T:4, C:3) → (7 × 9) + (5 × 4) − (4 × 3) = 63 + 20 − 12 = 71
                  </p>
                  <p className="font-mono text-[11px] text-slate-300">
                    • Burger (H:2, T:9, C:6) → (7 × 2) + (5 × 9) − (4 × 6) = 14 + 45 − 24 = 35
                  </p>
                  <p className="font-mono text-[11px] text-slate-300">
                    • Pizza (H:4, T:8, C:5) → (7 × 4) + (5 × 8) − (4 × 5) = 28 + 40 − 20 = 48
                  </p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-emerald-400 font-bold text-xs">
                    Expected Result: Agent recommends Salad because it maximizes scalar satisfaction U(Salad) = 71.
                  </div>
                </div>
              </div>
            )}

            {/* SPECIAL Q-LEARNING DEEP DIVE FOR GAME 5 */}
            {activeAgentId === 'learning' && (
              <div className="space-y-4 text-xs font-mono">
                {/* 5 Core Q-learning concepts required by prompt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-pink-400 font-bold block">1. Q-Learning</span>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      Model-free reinforcement learning that learns action-values Q(s,a) from experience.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold block">2. States &amp; Actions</span>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      State s = grid cell (r, c). Actions a = &#123;Up, Down, Left, Right&#125;.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">3. Rewards</span>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      Coins = +15, Spikes = -20, Star Destination = +50.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-purple-400 font-bold block">4. Q-Table</span>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      A matrix mapping each state-action pair to its expected future reward.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold block">5. Explore vs Exploit</span>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      ε-greedy: Try random moves to discover paths vs greedy moves for max points.
                    </p>
                  </div>
                </div>

                {/* The Bellman Numerical Update Formula & Worked Example */}
                <div className="p-4 rounded-xl bg-[#081024] border border-pink-500/30 space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b border-[#142342] pb-2 font-mono">
                    <span className="text-xs font-bold text-pink-300">
                      The Bellman Optimality Equation (Q-Value Update Formula):
                    </span>
                    <span className="text-[11px] text-cyan-300 font-bold">
                      Q(s, a) ← Q(s, a) + α · [r + γ · max Q(s&apos;, a&apos;) − Q(s, a)]
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <h5 className="font-bold text-white font-mono">Numerical Worked Example from the Game:</h5>
                    <div className="p-3 rounded-lg bg-black/50 font-mono text-[11px] space-y-1 border border-slate-800 text-slate-200">
                      <div>• Current Estimate: <strong>Q(s, a) = 20.0</strong></div>
                      <div>• Learning Rate: <strong>α = 0.5</strong></div>
                      <div>• Discount Factor: <strong>γ = 0.9</strong></div>
                      <div>• Immediate Environmental Reward: <strong>r = +15.0</strong> (collected gold coin)</div>
                      <div>• Best Future Expected Value: <strong>max Q(s&apos;, a&apos;) = 50.0</strong> (star is ahead)</div>
                      <div className="pt-2 text-cyan-300 font-bold">
                        1. Compute TD Target = r + γ · max Q = 15.0 + (0.9 × 50.0) = 15.0 + 45.0 = 60.0
                      </div>
                      <div className="text-amber-300 font-bold">
                        2. Compute TD Error = Target − Q(s, a) = 60.0 − 20.0 = 40.0
                      </div>
                      <div className="text-emerald-300 font-bold text-xs pt-1">
                        3. New Q(s, a) = 20.0 + 0.5 × (40.0) = 20.0 + 20.0 = 40.0!
                      </div>
                    </div>
                    <div className="font-mono text-emerald-400 font-bold text-xs">
                      Expected Result: The agent increases Q((r,c), Move) from 20.0 to 40.0, permanently remembering this move is favorable.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Knowledge Check Quiz (2-3 interactive questions per agent) */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#142342]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block">
                9. Interactive Knowledge Check
              </span>
              <h3 className="text-sm font-bold text-white">
                Test your understanding of the {agent.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click an option to test your answer instantly!
            </span>
          </div>

          <div className="space-y-4">
            {agent.quiz.map((q, qIdx) => {
              const selected = selectedAnswers[q.id];
              const isRevealed = revealedAnswers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-[#162747] bg-[#0B1428] p-4 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#162B54] text-[10px] font-mono font-bold text-cyan-300 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-7">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                            isRevealed && isOptionCorrect
                              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold'
                              : isRevealed && isOptionSelected && !isOptionCorrect
                              ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                              : isOptionSelected
                              ? 'border-cyan-400 bg-cyan-950/40 text-white'
                              : 'border-slate-800 bg-[#070D1E] hover:border-slate-600 text-slate-300 hover:text-white'
                          }`}
                        >
                          <span>{opt}</span>
                          {isRevealed && isOptionCorrect && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold ml-2 shrink-0">
                              ✓ Correct
                            </span>
                          )}
                          {isRevealed && isOptionSelected && !isOptionCorrect && (
                            <span className="text-[10px] font-mono text-rose-400 font-bold ml-2 shrink-0">
                              ✗ Incorrect
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {isRevealed && (
                    <div className={`mt-2 ml-7 p-2.5 rounded-lg text-xs font-sans leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}>
                      <strong className="block font-mono text-[11px] mb-0.5">
                        {isCorrect ? '🎉 Correct!' : '💡 Explanation:'}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Python Code */}
      {/* ========================================================================= */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#142342]">
            <div className="flex items-center gap-2">
              <span className="text-sm">🐍</span>
              <h3 className="text-xs font-bold text-white uppercase font-mono">
                {agent.name} Python Reference Implementation
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-[#102040] hover:bg-[#162B55] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#162747] bg-[#081022] p-5 font-mono text-xs sm:text-sm text-slate-200">
            <pre className="overflow-x-auto leading-relaxed">
              <code>{agent.pythonCode}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#070D1E] p-3.5 font-mono text-xs text-emerald-400">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Execution Terminal Output:</span>
            <pre>{agent.pythonRunResult}</pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Try with Your Own Input (Interactive Simulator) */}
      {/* ========================================================================= */}
      {activeTab === 'try-input' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Input Controls */}
          <div className="rounded-xl border border-[#162747] bg-[#0B1428] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#142342] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Adjust Parameters ({agent.name})
              </h3>
              <button
                onClick={() => {
                  setCustomTemp(34);
                  setCustomThreshold(30);
                  setCustomWeights({ taste: 7, health: 8, cost: 3 });
                  setCustomMazeState({ r: 1, c: 2, memoryVisited: 6, wallAhead: true });
                  setCustomGoalCoords({ startR: 2, startC: 1, goalR: 0, goalC: 4 });
                  setCustomLearnParams({ reward: 15, alpha: 0.5, gamma: 0.9, prevQ: 20 });
                }}
                className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-cyan-400" />
                <span>Reset</span>
              </button>
            </div>

            {/* Agent 1 Input */}
            {activeAgentId === 'simple-reflex' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Input Temperature:</span>
                    <strong className="text-cyan-400">{customTemp}°C</strong>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={customTemp}
                    onChange={(e) => setCustomTemp(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rule Threshold:</span>
                    <strong className="text-amber-400">{customThreshold}°C</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="35"
                    value={customThreshold}
                    onChange={(e) => setCustomThreshold(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Agent 2 Input */}
            {activeAgentId === 'model-based' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Internal Memory Visited Tiles:</span>
                    <strong className="text-blue-400">{customMazeState.memoryVisited} / 25 tiles</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={customMazeState.memoryVisited}
                    onChange={(e) =>
                      setCustomMazeState({ ...customMazeState, memoryVisited: Number(e.target.value) })
                    }
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-slate-800">
                  <span>Wall / Obstacle Directly Ahead:</span>
                  <button
                    onClick={() =>
                      setCustomMazeState({ ...customMazeState, wallAhead: !customMazeState.wallAhead })
                    }
                    className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      customMazeState.wallAhead
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {customMazeState.wallAhead ? 'YES (Blocked)' : 'NO (Clear)'}
                  </button>
                </div>
              </div>
            )}

            {/* Agent 3 Input */}
            {activeAgentId === 'goal-based' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold block">Start Position:</span>
                    <div className="flex gap-2">
                      <span>R:</span>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={customGoalCoords.startR}
                        onChange={(e) =>
                          setCustomGoalCoords({ ...customGoalCoords, startR: Number(e.target.value) })
                        }
                        className="w-10 bg-black border border-slate-700 rounded text-center text-white"
                      />
                      <span>C:</span>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={customGoalCoords.startC}
                        onChange={(e) =>
                          setCustomGoalCoords({ ...customGoalCoords, startC: Number(e.target.value) })
                        }
                        className="w-10 bg-black border border-slate-700 rounded text-center text-white"
                      />
                    </div>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-rose-400 font-bold block">Goal Position:</span>
                    <div className="flex gap-2">
                      <span>R:</span>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={customGoalCoords.goalR}
                        onChange={(e) =>
                          setCustomGoalCoords({ ...customGoalCoords, goalR: Number(e.target.value) })
                        }
                        className="w-10 bg-black border border-slate-700 rounded text-center text-white"
                      />
                      <span>C:</span>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={customGoalCoords.goalC}
                        onChange={(e) =>
                          setCustomGoalCoords({ ...customGoalCoords, goalC: Number(e.target.value) })
                        }
                        className="w-10 bg-black border border-slate-700 rounded text-center text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agent 4 Input */}
            {activeAgentId === 'utility-based' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Health Weight (Wh):</span>
                    <strong className="text-emerald-400">{customWeights.health}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={customWeights.health}
                    onChange={(e) => setCustomWeights({ ...customWeights, health: Number(e.target.value) })}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Taste Weight (Wt):</span>
                    <strong className="text-amber-400">{customWeights.taste}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={customWeights.taste}
                    onChange={(e) => setCustomWeights({ ...customWeights, taste: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Cost Weight (Wc):</span>
                    <strong className="text-rose-400">{customWeights.cost}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={customWeights.cost}
                    onChange={(e) => setCustomWeights({ ...customWeights, cost: Number(e.target.value) })}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Agent 5 Input */}
            {activeAgentId === 'learning' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Reward (r):</span>
                    <strong className="text-pink-400">{customLearnParams.reward}</strong>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={customLearnParams.reward}
                    onChange={(e) =>
                      setCustomLearnParams({ ...customLearnParams, reward: Number(e.target.value) })
                    }
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Learning Rate (α):</span>
                    <strong className="text-cyan-400">{customLearnParams.alpha}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={customLearnParams.alpha}
                    onChange={(e) =>
                      setCustomLearnParams({ ...customLearnParams, alpha: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Discount Factor (γ):</span>
                    <strong className="text-purple-400">{customLearnParams.gamma}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.05"
                    value={customLearnParams.gamma}
                    onChange={(e) =>
                      setCustomLearnParams({ ...customLearnParams, gamma: Number(e.target.value) })
                    }
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Calculated Output */}
          <div className="rounded-xl border border-[#162747] bg-[#070D1E] p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Computed Algorithm Decision:</span>
              <div className="text-base sm:text-lg font-bold text-white mt-1">
                {activeAgentId === 'simple-reflex' && (
                  customTemp > customThreshold
                    ? `Action: "Turn Fan ON" (${customTemp}°C > ${customThreshold}°C)`
                    : `Action: "Keep Fan OFF" (${customTemp}°C ≤ ${customThreshold}°C)`
                )}

                {activeAgentId === 'model-based' && (
                  customMazeState.wallAhead
                    ? 'Action: "Consult Memory Model & Backtrack"'
                    : 'Action: "Advance Forward (Add cell to model)"'
                )}

                {activeAgentId === 'goal-based' && (
                  `Action: "Step toward Goal [${customGoalCoords.goalR}, ${customGoalCoords.goalC}]"`
                )}

                {activeAgentId === 'utility-based' && (() => {
                  const uSalad = customWeights.health * 9 + customWeights.taste * 4 - customWeights.cost * 3;
                  const uBurger = customWeights.health * 2 + customWeights.taste * 9 - customWeights.cost * 6;
                  const uPizza = customWeights.health * 4 + customWeights.taste * 8 - customWeights.cost * 5;
                  const maxU = Math.max(uSalad, uBurger, uPizza);
                  const winner = maxU === uSalad ? 'Salad 🥗' : maxU === uBurger ? 'Burger 🍔' : 'Pizza 🍕';
                  return `argmax U(a): "${winner}" (Utility: ${maxU})`;
                })()}

                {activeAgentId === 'learning' && (() => {
                  const qTarget = customLearnParams.reward + customLearnParams.gamma * 50;
                  const qNew = customLearnParams.prevQ + customLearnParams.alpha * (qTarget - customLearnParams.prevQ);
                  return `Updated Q(s,a) = ${qNew.toFixed(2)} (TD Error: ${(qTarget - customLearnParams.prevQ).toFixed(2)})`;
                })()}
              </div>
            </div>

            <div className="mt-4 p-3 rounded bg-black/60 font-mono text-xs text-cyan-300 overflow-x-auto">
              {activeAgentId === 'simple-reflex' &&
                `>>> simple_reflex_agent(temp=${customTemp}, threshold=${customThreshold})\n'${customTemp > customThreshold ? 'Turn Fan ON' : 'Keep Fan OFF'}'`}

              {activeAgentId === 'model-based' &&
                `>>> model_based_agent(memory_size=${customMazeState.memoryVisited}, obstacle=${customMazeState.wallAhead})\n'${customMazeState.wallAhead ? 'Backtrack using visited buffer' : 'Explore unvisited neighbor'}'`}

              {activeAgentId === 'goal-based' &&
                `>>> goal_based_search(start=[${customGoalCoords.startR}, ${customGoalCoords.startC}], goal=[${customGoalCoords.goalR}, ${customGoalCoords.goalC}])\nManhattan heuristic h(n) = ${Math.abs(customGoalCoords.startR - customGoalCoords.goalR) + Math.abs(customGoalCoords.startC - customGoalCoords.goalC)} steps`}

              {activeAgentId === 'utility-based' && (() => {
                const uSalad = customWeights.health * 9 + customWeights.taste * 4 - customWeights.cost * 3;
                const uBurger = customWeights.health * 2 + customWeights.taste * 9 - customWeights.cost * 6;
                const uPizza = customWeights.health * 4 + customWeights.taste * 8 - customWeights.cost * 5;
                const opt = uSalad >= uBurger && uSalad >= uPizza ? 'Salad' : uBurger >= uPizza ? 'Burger' : 'Pizza';
                return `>>> compute_utilities(Wh=${customWeights.health}, Wt=${customWeights.taste}, Wc=${customWeights.cost})\nU(Salad)=${uSalad} | U(Burger)=${uBurger} | U(Pizza)=${uPizza}\nOptimal Pick: '${opt}' (argmax)`;
              })()}

              {activeAgentId === 'learning' && (() => {
                const qTarget = customLearnParams.reward + customLearnParams.gamma * 50;
                const qNew = customLearnParams.prevQ + customLearnParams.alpha * (qTarget - customLearnParams.prevQ);
                return `>>> q_learning_step(Q=${customLearnParams.prevQ}, R=${customLearnParams.reward}, α=${customLearnParams.alpha}, γ=${customLearnParams.gamma})\nQ_new = ${qNew.toFixed(2)}`;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: Overview (Theory & PEAS) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#162747] bg-[#0B1428] p-4 space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Theoretical PEAS Definition
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {agent.definition}
            </p>
            <div className="p-3 rounded-lg bg-[#070D1E] border border-[#15233E] text-xs text-slate-300">
              <strong className="text-violet-400 block mb-1">Russell &amp; Norvig Concept:</strong>
              {agent.poaiConcept}
            </div>
          </div>

          <div className="rounded-xl border border-[#162747] bg-[#0B1428] p-4 space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Real-World Analogy &amp; Limitations
            </h3>
            <div className="text-xs space-y-2 text-slate-300">
              <div>
                <strong className="text-white block">Real-World Exemplar:</strong>
                <span>{agent.realWorldExample}</span>
              </div>
              <div>
                <strong className="text-rose-400 block">Limitations &amp; Blindspots:</strong>
                <span>{agent.limitations}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: Game Mapping */}
      {/* ========================================================================= */}
      {activeTab === 'game-mapping' && (
        <div className="rounded-xl border border-[#162747] bg-[#0B1428] p-4 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-[#162747] text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Python Source Statement</th>
                <th className="py-2 px-3 font-sans">Decision Logic</th>
                <th className="py-2 px-3 font-sans">Game Manifestation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142342] text-slate-200">
              {agent.mapping.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 text-cyan-300 font-bold whitespace-nowrap">
                    <code>{m.codeSnippet}</code>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-xs">{m.whatItDoes}</td>
                  <td className="py-2.5 px-3 font-sans text-xs text-slate-400">{m.gameEvent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM NAVIGATION STRIP: Next Game or Learning Complete */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-[#142342] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Current Progress:</span>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Agent {agent.number} of 5 ({agent.name})
          </span>
        </div>

        {nextAgent ? (
          <button
            onClick={() => onNextGame && onNextGame(nextAgent.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-violet-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Proceed to Next Game ({nextAgent.name})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2.5">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mr-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Learning Complete! All 5 Agents Mastered</span>
            </div>
            <button
              onClick={onReplayGames}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E1A36] hover:bg-[#16274E] text-slate-200 hover:text-white border border-[#233560] font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Replay Games</span>
            </button>
            <button
              onClick={onReturnHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Home Page</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
