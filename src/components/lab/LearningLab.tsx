import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Sliders,
  Terminal,
  Layers,
  HelpCircle,
  BookOpen,
  Code2,
  Info,
  RotateCcw
} from 'lucide-react';
import { AgentData, AgentId } from '../../types/agent';
import { AGENTS_DATA } from '../../data/agents';

interface LearningLabProps {
  agent: AgentData;
  onBackToGame: () => void;
  onQuizComplete: (score: number) => void;
  onSelectAgent?: (agentId: AgentId) => void;
}

export const LearningLab: React.FC<LearningLabProps> = ({
  agent,
  onBackToGame,
  onQuizComplete,
  onSelectAgent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'flowchart' | 'code' | 'linebyline' | 'mapping' | 'playground' | 'quiz'
  >('overview');

  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedLineIdx, setSelectedLineIdx] = useState<number>(0);

  // Playground states
  const [playgroundTemp, setPlaygroundTemp] = useState<number>(33);
  const [playgroundPosition, setPlaygroundPosition] = useState<[number, number]>([0, 1]);
  const [playgroundVisited, setPlaygroundVisited] = useState<string[]>(['0,0', '0,1']);
  const [playgroundGoal, setPlaygroundGoal] = useState<[number, number]>([3, 2]);
  const [playgroundWeights, setPlaygroundWeights] = useState({ taste: 6, health: 8, cost: 4 });
  const [playgroundAlpha, setPlaygroundAlpha] = useState(0.2);
  const [playgroundGamma, setPlaygroundGamma] = useState(0.9);
  const [playgroundReward, setPlaygroundReward] = useState(100);
  const [playgroundCurrentQ, setPlaygroundCurrentQ] = useState(12.5);
  const [playgroundMaxNextQ, setPlaygroundMaxNextQ] = useState(45.0);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(agent.pythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const selectedLine = agent.codeLines[selectedLineIdx] || agent.codeLines[0];

  // Playground calculation
  const getPlaygroundResult = () => {
    switch (agent.id) {
      case 'simple-reflex': {
        const action = playgroundTemp > 30 ? 'Turn Fan ON' : 'Keep Fan OFF';
        const condition = playgroundTemp > 30;
        return {
          title: `Result: ${action}`,
          details: `Input Temperature = ${playgroundTemp}°C. Condition (${playgroundTemp} > 30) is ${condition ? 'TRUE' : 'FALSE'}. Therefore, action = "${action}".`,
          output: `>>> simple_reflex_agent(${playgroundTemp})\n'${action}'`,
        };
      }
      case 'model-based': {
        const neighbors: Record<string, [number, number]> = {
          NORTH: [playgroundPosition[0] - 1, playgroundPosition[1]],
          EAST: [playgroundPosition[0], playgroundPosition[1] + 1],
          SOUTH: [playgroundPosition[0] + 1, playgroundPosition[1]],
          WEST: [playgroundPosition[0], playgroundPosition[1] - 1],
        };
        const visitedSet = new Set(playgroundVisited);
        let decision = 'BACKTRACK';
        let directionChosen = '';
        for (const [dir, pos] of Object.entries(neighbors)) {
          if (!visitedSet.has(`${pos[0]},${pos[1]}`)) {
            decision = dir;
            directionChosen = dir;
            break;
          }
        }
        return {
          title: `Decision: ${decision}`,
          details:
            directionChosen !== ''
              ? `Found unvisited neighbor in direction ${directionChosen}. Explores without entering loops.`
              : 'All adjacent tiles exist in internal visited memory! Popping history stack to BACKTRACK.',
          output: `>>> model_based_agent(${JSON.stringify(playgroundPosition)}, visited, neighbors)\n('${decision}', '${directionChosen ? 'EXPLORE' : 'RETREAT'}')`,
        };
      }
      case 'goal-based': {
        const dist = Math.abs(playgroundGoal[0] - 0) + Math.abs(playgroundGoal[1] - 0);
        return {
          title: `BFS Shortest Steps: ${dist}`,
          details: `Breadth-First Search evaluates level-by-level from start (0,0) to target goal (${playgroundGoal[0]},${playgroundGoal[1]}).`,
          output: `>>> find_path_bfs(grid, start=(0,0), goal=(${playgroundGoal[0]},${playgroundGoal[1]}))\nPath length = ${dist} steps found!`,
        };
      }
      case 'utility-based': {
        const saladUtil = playgroundWeights.taste * 6 + playgroundWeights.health * 10 - playgroundWeights.cost * 7;
        const burgerUtil = playgroundWeights.taste * 10 + playgroundWeights.health * 3 - playgroundWeights.cost * 8;
        const bentoUtil = playgroundWeights.taste * 8 + playgroundWeights.health * 8 - playgroundWeights.cost * 5;
        const best = Math.max(saladUtil, burgerUtil, bentoUtil);
        const bestName = best === bentoUtil ? 'Balanced Bento' : best === saladUtil ? 'Superfood Salad' : 'Gourmet Burger';
        return {
          title: `Optimal: ${bestName} (Utility: ${best})`,
          details: `Salad: ${saladUtil} | Burger: ${burgerUtil} | Bento: ${bentoUtil}. arg max U selects highest scalar value.`,
          output: `>>> choose_best_option(menu, weights)\n{'name': '${bestName}', 'utility': ${best}}`,
        };
      }
      case 'learning': {
        const tdTarget = playgroundReward + playgroundGamma * playgroundMaxNextQ;
        const tdError = tdTarget - playgroundCurrentQ;
        const newQ = playgroundCurrentQ + playgroundAlpha * tdError;
        return {
          title: `Updated Q(s, a): ${newQ.toFixed(3)}`,
          details: `TD Target = ${playgroundReward} + (${playgroundGamma} × ${playgroundMaxNextQ}) = ${tdTarget}. New Q = ${playgroundCurrentQ} + (${playgroundAlpha} × ${tdError.toFixed(2)}) = ${newQ.toFixed(3)}.`,
          output: `>>> q_learning_update(Q, s, a, r=${playgroundReward}, s_next)\nUpdated Q-Value: ${newQ.toFixed(3)}`,
        };
      }
    }
  };

  const playgroundResult = getPlaygroundResult();

  const handleQuizSubmit = () => {
    let correctCount = 0;
    agent.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizSubmitted(true);
    onQuizComplete(correctCount);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const tabs = [
    { id: 'overview', label: '01. Overview', icon: Info },
    { id: 'flowchart', label: '02. How It Works', icon: Layers },
    { id: 'code', label: '03. Python Code', icon: Code2 },
    { id: 'linebyline', label: '04. Line-by-Line', icon: Terminal },
    { id: 'mapping', label: '05. Game-to-Code', icon: BookOpen },
    { id: 'playground', label: '06. Try Your Input', icon: Sliders },
    { id: 'quiz', label: '07. Knowledge Check', icon: HelpCircle },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between bg-[#F8F7F4] text-[#111111]">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_1fr] border-b border-[#111111]/15">
        {/* Editorial Sidebar */}
        <aside className="p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#111111]/15 bg-[#FFFFFF] flex flex-col justify-between gap-8">
          <div className="space-y-8">
            {/* Current Module list */}
            <div>
              <span className="label mb-3">Current Module</span>
              <ul className="font-mono text-xs uppercase tracking-wider space-y-0 divide-y divide-[#111111]/10">
                {AGENTS_DATA.map((ag) => {
                  const isActive = ag.id === agent.id;
                  return (
                    <li
                      key={ag.id}
                      onClick={() => onSelectAgent && onSelectAgent(ag.id)}
                      className={`py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isActive
                          ? 'font-bold text-[#FF4D00]'
                          : 'text-[#111111]/60 hover:text-[#111111]'
                      }`}
                    >
                      <span>
                        0{ag.number}. {ag.name.replace(' Agent', '')}
                      </span>
                      {isActive && <span className="text-[#FF4D00]">●</span>}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Laboratory Content Tabs */}
            <div>
              <span className="label mb-3">Laboratory Content</span>
              <div className="space-y-1.5 font-mono text-xs uppercase tracking-wider">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full text-left py-3 px-4 border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#111111] text-[#F8F7F4] border-[#111111] font-bold'
                          : 'bg-transparent text-[#111111] border-[#111111]/15 hover:border-[#111111]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Return to Game State */}
          <div className="pt-4">
            <button
              onClick={onBackToGame}
              className="w-full p-4 border-2 border-[#111111] font-mono font-bold text-xs uppercase tracking-widest text-[#111111] hover:bg-[#111111] hover:text-[#F8F7F4] transition-colors cursor-pointer text-center"
            >
              Return to Game State
            </button>
          </div>
        </aside>

        {/* Main Stage */}
        <section className="p-6 sm:p-12 lg:p-16 overflow-y-auto">
          {/* Breadcrumb Label */}
          <span className="label mb-3">
            Laboratory 0{agent.number} / {agent.gameName}
          </span>

          {/* Large Serif Title */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight mb-8 text-[#111111]">
            {agent.name.replace(' Agent', '')} <br />
            Algorithm.
          </h1>

          {/* Intro Text */}
          <p className="text-lg sm:text-xl text-[#111111]/70 max-w-3xl leading-relaxed mb-12">
            Enjoyed the game? Now let&apos;s discover the algorithm behind it. Inspect how your in-game choices map directly to POAI theoretical agent architecture and executable Python functions.
          </p>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                {/* Left col: Concept Definition & Foundation Quote */}
                <div>
                  <h3 className="section-title">Concept Definition</h3>
                  <p className="text-base text-[#111111] leading-relaxed mb-8">
                    {agent.definition}
                  </p>

                  <div className="p-6 border border-[#111111]/15 bg-white space-y-3">
                    <span className="label">Foundation</span>
                    <p className="text-sm font-serif italic text-[#111111] leading-relaxed">
                      &ldquo;{agent.poaiConcept}&rdquo;
                    </p>
                    <p className="text-xs font-mono text-[#111111]/50 uppercase tracking-wider pt-2">
                      — Russell &amp; Norvig Architecture
                    </p>
                  </div>
                </div>

                {/* Right col: PEAS Breakdown */}
                <div>
                  <h3 className="section-title">System PEAS Breakdown</h3>
                  <ul className="space-y-6">
                    <li className="border-b border-[#111111]/10 pb-4">
                      <h5 className="font-mono text-xs uppercase text-[#111111]/50 tracking-wider mb-1">
                        Environment
                      </h5>
                      <p className="text-base font-semibold text-[#111111]">{agent.environment}</p>
                    </li>
                    <li className="border-b border-[#111111]/10 pb-4">
                      <h5 className="font-mono text-xs uppercase text-[#111111]/50 tracking-wider mb-1">
                        Sensors (Percepts)
                      </h5>
                      <p className="text-base font-semibold text-[#111111]">{agent.sensors.join(', ')}</p>
                    </li>
                    <li className="border-b border-[#111111]/10 pb-4">
                      <h5 className="font-mono text-xs uppercase text-[#111111]/50 tracking-wider mb-1">
                        Actuators (Actions)
                      </h5>
                      <p className="text-base font-semibold text-[#111111]">{agent.actuators.join(', ')}</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Theoretical Limitations Accent Box */}
              <div className="bg-[#111111] text-[#F8F7F4] p-8 sm:p-12 mt-12 border-l-4 border-[#FF4D00]">
                <span className="label mb-2">Critical Note</span>
                <h4 className="font-serif text-3xl sm:text-4xl mb-4 text-[#F8F7F4]">
                  Theoretical Limitations.
                </h4>
                <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#F8F7F4]/80">
                  {agent.limitations}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FLOWCHART (How It Works) */}
          {activeTab === 'flowchart' && (
            <div className="space-y-8">
              <h3 className="section-title">Sequential Decision Propagation Flow</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {agent.flowSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-6 border border-[#111111]/20 bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-[#FF4D00]">
                          Phase 0{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] text-[#111111]/40 uppercase">
                          Step
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl font-bold text-[#111111] mb-1">
                        {step.title}
                      </h4>
                      <div className="font-mono text-xs text-[#FF4D00] uppercase mb-3">
                        {step.subtitle}
                      </div>
                      <p className="text-xs text-[#111111]/75 leading-relaxed mb-6">
                        {step.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#111111]/10 font-mono text-[11px]">
                      <span className="text-[#111111]/50 block mb-0.5 uppercase text-[9px]">
                        Game Correlate:
                      </span>
                      <span className="text-[#111111] font-semibold">{step.gameConnection}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON CODE */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#111111]/20 pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#111111]/60">
                  Executable Algorithm · Python 3.12
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 font-mono text-xs text-[#111111] hover:text-[#FF4D00] transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-[#FF4D00]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? 'COPIED TO CLIPBOARD' : 'COPY PYTHON SOURCE'}</span>
                </button>
              </div>

              {/* Code viewer */}
              <div className="border-2 border-[#111111] bg-[#111111] text-[#F8F7F4] p-6 font-mono text-xs sm:text-sm overflow-x-auto shadow-sm">
                <pre className="leading-relaxed">
                  <code>{agent.pythonCode}</code>
                </pre>
              </div>

              {/* Output Box */}
              <div className="border border-[#111111]/20 bg-white p-6 font-mono text-xs space-y-2">
                <span className="label">Terminal Output Verification</span>
                <pre className="text-[#111111] font-bold whitespace-pre-wrap">{agent.pythonRunResult}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: LINE BY LINE */}
          {activeTab === 'linebyline' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Code listing */}
              <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-6">
                <div className="flex items-center justify-between border-b border-[#111111]/15 pb-3 mb-4">
                  <span className="label">Source Lines (Click to Inspect)</span>
                  <button
                    onClick={() => {
                      const next = (selectedLineIdx + 1) % agent.codeLines.length;
                      setSelectedLineIdx(next);
                    }}
                    className="font-mono text-xs text-[#FF4D00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Line</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  {agent.codeLines.map((line, idx) => (
                    <div
                      key={line.lineNumber}
                      onClick={() => setSelectedLineIdx(idx)}
                      className={`p-2.5 flex items-start gap-4 cursor-pointer transition-colors ${
                        selectedLineIdx === idx
                          ? 'bg-[#111111] text-[#F8F7F4]'
                          : 'text-[#111111]/70 hover:bg-[#111111]/5'
                      }`}
                    >
                      <span className="w-6 text-right opacity-40 select-none">
                        {line.lineNumber}
                      </span>
                      <code className="flex-1 overflow-x-auto">{line.code}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Breakdown */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border border-[#111111]/20 bg-white p-6 space-y-4">
                  <span className="label">Line {selectedLine.lineNumber} Analysis</span>
                  <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4] font-mono text-xs text-[#111111]">
                    <code>{selectedLine.code.trim()}</code>
                  </div>
                  <p className="text-sm text-[#111111] leading-relaxed">
                    {selectedLine.explanation}
                  </p>

                  <div className="pt-4 border-t border-[#111111]/10">
                    <span className="font-mono text-[10px] uppercase text-[#111111]/50 block mb-1">
                      In-Game Event:
                    </span>
                    <p className="text-xs font-semibold text-[#111111]">{selectedLine.gameAction}</p>
                  </div>

                  {selectedLine.variableState && (
                    <div className="pt-4 border-t border-[#111111]/10 font-mono text-xs space-y-1">
                      <span className="font-mono text-[10px] uppercase text-[#111111]/50 block mb-1">
                        Variable State Snapshot:
                      </span>
                      {Object.entries(selectedLine.variableState).map(([k, v]) => (
                        <div key={k} className="text-[#111111]">
                          <span className="text-[#FF4D00] font-bold">{k}</span> = {String(v)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GAME-TO-CODE MAPPING */}
          {activeTab === 'mapping' && (
            <div className="border border-[#111111]/20 bg-white p-6 sm:p-10 space-y-6">
              <h3 className="section-title">Algorithmic Correlation Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b-2 border-[#111111] text-[#111111] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Python Code Statement</th>
                      <th className="py-3 px-4 font-sans uppercase">Algorithmic Function</th>
                      <th className="py-3 px-4 font-sans uppercase">In-Game Manifestation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#111111]/10">
                    {agent.mapping.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#111111]/5 transition-colors">
                        <td className="py-4 px-4 text-[#FF4D00] font-bold whitespace-nowrap">
                          <code>{row.codeSnippet}</code>
                        </td>
                        <td className="py-4 px-4 font-sans text-sm text-[#111111]">
                          {row.whatItDoes}
                        </td>
                        <td className="py-4 px-4 font-sans text-sm text-[#111111]/70">
                          {row.gameEvent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: TRY YOUR OWN INPUT (Playground) */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-6 border border-[#111111]/20 bg-white p-6 sm:p-8 space-y-6">
                <span className="label">Parameter Manipulation</span>

                {agent.id === 'simple-reflex' && (
                  <div>
                    <div className="flex justify-between font-mono text-xs mb-2">
                      <span>Room Temperature Percept:</span>
                      <span className="font-bold text-[#FF4D00]">{playgroundTemp}°C</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="45"
                      value={playgroundTemp}
                      onChange={(e) => setPlaygroundTemp(Number(e.target.value))}
                      className="w-full accent-[#FF4D00] cursor-pointer"
                    />
                  </div>
                )}

                {agent.id === 'model-based' && (
                  <div className="space-y-4 font-mono text-xs">
                    <label className="block text-[#111111]/70">Simulated Visited Set:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPlaygroundVisited(['0,0', '0,1'])}
                        className={`p-3 border font-mono text-xs cursor-pointer ${
                          playgroundVisited.length === 2
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'border-[#111111]/20 text-[#111111]'
                        }`}
                      >
                        Unvisited Corridor Open
                      </button>
                      <button
                        onClick={() => setPlaygroundVisited(['0,0', '0,1', '1,1', '-1,1', '0,2'])}
                        className={`p-3 border font-mono text-xs cursor-pointer ${
                          playgroundVisited.length > 2
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'border-[#111111]/20 text-[#111111]'
                        }`}
                      >
                        Surrounded Dead End
                      </button>
                    </div>
                  </div>
                )}

                {agent.id === 'goal-based' && (
                  <div className="space-y-3 font-mono text-xs">
                    <label className="block text-[#111111]/70">Target Coordinate (gx, gy):</label>
                    <div className="flex gap-2">
                      {[
                        [2, 2],
                        [3, 2],
                        [4, 4],
                      ].map(([r, c]) => (
                        <button
                          key={`${r}-${c}`}
                          onClick={() => setPlaygroundGoal([r, c] as [number, number])}
                          className={`p-3 border text-xs cursor-pointer ${
                            playgroundGoal[0] === r && playgroundGoal[1] === c
                              ? 'bg-[#111111] text-white border-[#111111] font-bold'
                              : 'border-[#111111]/20 text-[#111111]'
                          }`}
                        >
                          Goal: ({r},{c})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {agent.id === 'utility-based' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Taste Priority:</span>
                        <span className="font-bold text-[#FF4D00]">{playgroundWeights.taste}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={playgroundWeights.taste}
                        onChange={(e) => setPlaygroundWeights((p) => ({ ...p, taste: Number(e.target.value) }))}
                        className="w-full accent-[#FF4D00]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Health Priority:</span>
                        <span className="font-bold text-[#FF4D00]">{playgroundWeights.health}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={playgroundWeights.health}
                        onChange={(e) => setPlaygroundWeights((p) => ({ ...p, health: Number(e.target.value) }))}
                        className="w-full accent-[#FF4D00]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Cost Sensitivity:</span>
                        <span className="font-bold text-[#FF4D00]">-{playgroundWeights.cost}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={playgroundWeights.cost}
                        onChange={(e) => setPlaygroundWeights((p) => ({ ...p, cost: Number(e.target.value) }))}
                        className="w-full accent-[#FF4D00]"
                      />
                    </div>
                  </div>
                )}

                {agent.id === 'learning' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Immediate Reward (r):</span>
                        <span className="font-bold text-[#FF4D00]">{playgroundReward}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="100"
                        step="10"
                        value={playgroundReward}
                        onChange={(e) => setPlaygroundReward(Number(e.target.value))}
                        className="w-full accent-[#FF4D00]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Discount Factor (γ):</span>
                        <span className="font-bold text-[#FF4D00]">{playgroundGamma}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.99"
                        step="0.05"
                        value={playgroundGamma}
                        onChange={(e) => setPlaygroundGamma(Number(e.target.value))}
                        className="w-full accent-[#FF4D00]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Execution Console */}
              <div className="lg:col-span-6 border-2 border-[#111111] bg-[#111111] text-[#F8F7F4] p-8 flex flex-col justify-between">
                <div>
                  <span className="label mb-2">Deterministic Evaluation</span>
                  <h4 className="font-serif text-3xl mb-4 text-[#F8F7F4]">
                    {playgroundResult.title}
                  </h4>
                  <p className="text-sm text-[#F8F7F4]/80 leading-relaxed mb-8">
                    {playgroundResult.details}
                  </p>
                </div>

                <div className="p-4 border border-white/20 bg-black/40 font-mono text-xs">
                  <div className="text-[10px] uppercase text-white/50 mb-1">Python Return:</div>
                  <pre className="text-[#FF4D00]">{playgroundResult.output}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: KNOWLEDGE CHECK */}
          {activeTab === 'quiz' && (
            <div className="border border-[#111111]/20 bg-white p-6 sm:p-12 space-y-8">
              <div>
                <span className="label mb-2">Curriculum Evaluation</span>
                <h3 className="font-serif text-4xl font-bold text-[#111111]">
                  Knowledge Check · {agent.name}
                </h3>
              </div>

              <div className="space-y-8">
                {agent.quiz.map((q, qIdx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div key={q.id} className="border-b border-[#111111]/15 pb-8 space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-bold text-[#FF4D00]">
                          0{qIdx + 1}.
                        </span>
                        <p className="text-base font-semibold text-[#111111]">{q.question}</p>
                      </div>

                      <div className="space-y-2 pl-6">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left p-3.5 border font-mono text-xs transition-colors cursor-pointer ${
                              selectedOpt === optIdx
                                ? 'bg-[#111111] text-white border-[#111111] font-bold'
                                : 'border-[#111111]/20 text-[#111111] hover:border-[#111111]'
                            } ${
                              quizSubmitted && optIdx === q.correctIndex
                                ? 'border-[#FF4D00] text-[#FF4D00] font-bold'
                                : ''
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`ml-6 p-4 border text-xs leading-relaxed ${
                            isCorrect
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                              : 'border-rose-600 bg-rose-50 text-rose-900'
                          }`}
                        >
                          <strong className="font-mono block mb-1">
                            {isCorrect ? 'CORRECT ASSESSMENT ✓' : 'INCORRECT ASSESSMENT ✗'}
                          </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <span className="font-mono text-xs text-[#111111]/60">
                  {Object.keys(userAnswers).length} of {agent.quiz.length} Answered
                </span>
                <div className="flex items-center gap-2">
                  {quizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="px-6 py-3 border border-[#111111] bg-white text-[#111111] font-mono text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(userAnswers).length < agent.quiz.length}
                    className="px-8 py-3 bg-[#111111] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#FF4D00] transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {quizSubmitted ? 'Re-Evaluate Quiz' : 'Submit Answers'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Editorial Footer Strip */}
      <footer className="px-6 sm:px-12 py-4 bg-[#111111] text-[#F8F7F4] font-mono text-[11px] uppercase tracking-wider flex flex-col sm:flex-row items-center justify-between gap-2 border-t-2 border-[#111111]">
        <div>© 2026 AGENTVERSE LABORATORY / POAI SYSTEM</div>
        <div className="opacity-50">RE-CALIBRATING ALGORITHMIC THINKING</div>
      </footer>
    </div>
  );
};
