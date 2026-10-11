import React, { useState } from 'react';
import { 
  Bot, 
  Gem, 
  Flame, 
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import { AgentData } from '../../types/agent';
import { GameHeader } from './GameHeader';
import { GameFeedbackModal } from './GameFeedbackModal';

interface LearningGameProps {
  agent: AgentData;
  onGameComplete: (success: boolean) => void;
  onOpenLab: () => void;
  onExit: () => void;
}

const GRID_SIZE = 4;
type Action = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
const ACTIONS: Action[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

const ACTION_DELTAS: Record<Action, [number, number]> = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
};

const createEmptyQTable = () => {
  const table: Record<string, Record<Action, number>> = {};
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      table[`${r},${c}`] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
    }
  }
  return table;
};

export const LearningGame: React.FC<LearningGameProps> = ({
  agent,
  onGameComplete,
  onOpenLab,
  onExit,
}) => {
  const [qTable, setQTable] = useState(createEmptyQTable());
  const [episodesTrained, setEpisodesTrained] = useState(0);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepLog, setSimStepLog] = useState<string>('Untrained agent. Click "+20 Episodes" or "Test Trained Policy".');
  const [selectedCell, setSelectedCell] = useState<string>('0,0');
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    reason: string;
  }>({ isOpen: false, isSuccess: false, reason: '' });

  const goalPos: [number, number] = [3, 3];
  const hazardPositions = new Set(['1,1', '2,2']);

  const ALPHA = 0.25;
  const GAMMA = 0.9;
  const EPSILON = 0.25;

  const stepEnvironment = (pos: [number, number], action: Action): {
    nextPos: [number, number];
    reward: number;
    isTerminal: boolean;
  } => {
    const [dr, dc] = ACTION_DELTAS[action];
    const newR = Math.max(0, Math.min(GRID_SIZE - 1, pos[0] + dr));
    const newC = Math.max(0, Math.min(GRID_SIZE - 1, pos[1] + dc));
    const nextPos: [number, number] = [newR, newC];
    const key = `${newR},${newC}`;

    if (newR === goalPos[0] && newC === goalPos[1]) {
      return { nextPos, reward: 100, isTerminal: true };
    }
    if (hazardPositions.has(key)) {
      return { nextPos, reward: -50, isTerminal: true };
    }
    return { nextPos, reward: -1, isTerminal: false };
  };

  const trainEpisodes = (numEpisodes: number) => {
    const updatedTable = { ...qTable };
    for (const k in updatedTable) {
      updatedTable[k] = { ...updatedTable[k] };
    }

    for (let ep = 0; ep < numEpisodes; ep++) {
      let state: [number, number] = [0, 0];
      let steps = 0;

      while (steps < 25) {
        steps++;
        const stateKey = `${state[0]},${state[1]}`;

        let chosenAction: Action;
        if (Math.random() < EPSILON) {
          chosenAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        } else {
          const actionsForState = updatedTable[stateKey];
          let bestA = ACTIONS[0];
          let bestVal = actionsForState[bestA];
          for (const a of ACTIONS) {
            if (actionsForState[a] > bestVal) {
              bestVal = actionsForState[a];
              bestA = a;
            }
          }
          chosenAction = bestA;
        }

        const { nextPos, reward, isTerminal } = stepEnvironment(state, chosenAction);
        const currentQ = updatedTable[stateKey][chosenAction];
        let target: number;

        if (isTerminal) {
          target = reward;
        } else {
          const nextKey = `${nextPos[0]},${nextPos[1]}`;
          const maxNextQ = Math.max(...Object.values(updatedTable[nextKey]));
          target = reward + GAMMA * maxNextQ;
        }

        updatedTable[stateKey][chosenAction] = currentQ + ALPHA * (target - currentQ);

        if (isTerminal) break;
        state = nextPos;
      }
    }

    setQTable(updatedTable);
    const newTotalEpisodes = episodesTrained + numEpisodes;
    setEpisodesTrained(newTotalEpisodes);
    setSimStepLog(`Completed ${numEpisodes} episodes. Total: ${newTotalEpisodes}. Q-matrix updated.`);
  };

  const runTestSimulation = (isGreedy: boolean) => {
    setIsSimulating(true);
    let state: [number, number] = [0, 0];
    setRobotPos(state);
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const stateKey = `${state[0]},${state[1]}`;
      const actionsForState = qTable[stateKey];

      let chosenAction: Action;
      if (!isGreedy || episodesTrained === 0) {
        chosenAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      } else {
        let bestA = ACTIONS[0];
        let bestVal = actionsForState[bestA];
        for (const a of ACTIONS) {
          if (actionsForState[a] > bestVal) {
            bestVal = actionsForState[a];
            bestA = a;
          }
        }
        chosenAction = bestA;
      }

      const { nextPos, isTerminal } = stepEnvironment(state, chosenAction);
      state = nextPos;
      setRobotPos(state);

      if (isTerminal || stepCount >= 15) {
        clearInterval(interval);
        setIsSimulating(false);

        if (state[0] === goalPos[0] && state[1] === goalPos[1]) {
          setSimStepLog('Goal Crystal Reached (+100 Reward). Learned greedy policy successfully verified.');
          if (episodesTrained >= 10) {
            setGameOverModal({
              isOpen: true,
              isSuccess: true,
              reason: `Congratulations! Your Q-learning agent learned through ${episodesTrained} episodes and navigated directly to the Goal Crystal, dodging lava traps.`,
            });
            onGameComplete(true);
          }
        } else if (hazardPositions.has(`${state[0]},${state[1]}`)) {
          setSimStepLog('Entered Hazard Trap (-50 Penalty). Train more episodes to reinforce avoiding this cell.');
        } else {
          setSimStepLog('Step horizon reached before goal was located.');
        }
      }
    }, 280);
  };

  const restartGame = () => {
    setQTable(createEmptyQTable());
    setEpisodesTrained(0);
    setRobotPos([0, 0]);
    setIsSimulating(false);
    setSimStepLog('Q-table reset to zero. Ready to train from initial state.');
    setGameOverModal({ isOpen: false, isSuccess: false, reason: '' });
  };

  const selectedCellValues = qTable[selectedCell] || { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <GameHeader
        agent={agent}
        score={episodesTrained * 10}
        onExit={onExit}
        onRestart={restartGame}
        onOpenLab={onOpenLab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Q Grid */}
        <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#111111]">
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4 mb-4">
            <div>
              <span className="label">Environment</span>
              <div className="font-serif text-xl font-bold text-[#111111]">
                Tabular Q-Learning Grid ({GRID_SIZE}×{GRID_SIZE})
              </div>
            </div>
            <div className="font-mono text-xs text-[#111111]">
              Episodes: <span className="font-bold text-[#FF4D00]">{episodesTrained}</span>
            </div>
          </div>

          {/* Grid World */}
          <div className="flex justify-center items-center my-4">
            <div className="grid grid-cols-4 gap-2 p-2 border-2 border-[#111111] bg-[#111111]">
              {Array.from({ length: GRID_SIZE }).map((_, r) =>
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const isRobot = robotPos[0] === r && robotPos[1] === c;
                  const isGoal = r === goalPos[0] && c === goalPos[1];
                  const isHazard = hazardPositions.has(`${r},${c}`);
                  const isSelected = selectedCell === `${r},${c}`;
                  const cellQ = qTable[`${r},${c}`];
                  const maxQVal = cellQ ? Math.max(...Object.values(cellQ)) : 0;

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => setSelectedCell(`${r},${c}`)}
                      className={`relative flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center font-mono text-xs cursor-pointer ${
                        isHazard
                          ? 'bg-[#111111] text-[#FF4D00]'
                          : isGoal
                          ? 'bg-white border-2 border-[#111111]'
                          : isRobot
                          ? 'bg-white border-2 border-[#FF4D00]'
                          : isSelected
                          ? 'bg-[#F8F7F4] border-2 border-[#FF4D00]'
                          : 'bg-white'
                      }`}
                    >
                      {isHazard ? (
                        <div className="flex flex-col items-center">
                          <Flame className="h-6 w-6 text-[#FF4D00]" />
                          <span className="text-[8px] font-bold">-50</span>
                        </div>
                      ) : isGoal ? (
                        <div className="flex flex-col items-center">
                          <Gem className="h-6 w-6 text-[#111111]" />
                          <span className="text-[8px] font-bold">+100</span>
                        </div>
                      ) : isRobot ? (
                        <Bot className="h-7 w-7 text-[#FF4D00]" />
                      ) : (
                        <div className="text-[10px] text-[#111111]/70 font-mono">
                          {maxQVal !== 0 ? (
                            <span className={maxQVal > 0 ? 'text-[#FF4D00] font-bold' : 'text-[#111111]/60'}>
                              {maxQVal > 0 ? `+${maxQVal.toFixed(1)}` : maxQVal.toFixed(1)}
                            </span>
                          ) : (
                            <span className="opacity-30">0.0</span>
                          )}
                        </div>
                      )}

                      <span className="absolute bottom-1 right-1 text-[7px] font-mono opacity-30 text-[#111111]">
                        {r},{c}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 border border-[#111111]/20 bg-[#F8F7F4] font-mono text-xs text-[#111111]">
            <span className="label inline mr-2">Episode Feed:</span>
            <span>{simStepLog}</span>
          </div>
        </div>

        {/* Right 5 cols: Q Matrix & Training Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#111111]/20 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2">
              <span className="label flex items-center gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5" />
                Q-Values for ({selectedCell})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 border border-[#111111]/10 bg-[#F8F7F4] flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#111111]/60"><ArrowUp className="h-3 w-3" /> UP</span>
                <span className="font-bold">{selectedCellValues.UP.toFixed(2)}</span>
              </div>
              <div className="p-2.5 border border-[#111111]/10 bg-[#F8F7F4] flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#111111]/60"><ArrowDown className="h-3 w-3" /> DOWN</span>
                <span className="font-bold">{selectedCellValues.DOWN.toFixed(2)}</span>
              </div>
              <div className="p-2.5 border border-[#111111]/10 bg-[#F8F7F4] flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#111111]/60"><ArrowLeft className="h-3 w-3" /> LEFT</span>
                <span className="font-bold">{selectedCellValues.LEFT.toFixed(2)}</span>
              </div>
              <div className="p-2.5 border border-[#111111]/10 bg-[#F8F7F4] flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#111111]/60"><ArrowRight className="h-3 w-3" /> RIGHT</span>
                <span className="font-bold">{selectedCellValues.RIGHT.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#111111]/70 font-mono">
              Q-values update via Bellman error: Q += α[r + γ max Q&apos; - Q]
            </p>
          </div>

          <div className="border-2 border-[#111111] bg-white p-6 space-y-4">
            <span className="label">Reinforcement Actions</span>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => trainEpisodes(1)}
                disabled={isSimulating}
                className="p-3 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white uppercase font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                +1 Episode
              </button>
              <button
                onClick={() => trainEpisodes(20)}
                disabled={isSimulating}
                className="p-3 border border-[#111111] bg-[#111111] text-white hover:bg-[#FF4D00] uppercase font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                +20 Episodes
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#111111]/15">
              <button
                onClick={() => runTestSimulation(false)}
                disabled={isSimulating}
                className="w-full p-3 border border-[#111111]/30 hover:border-[#111111] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40"
              >
                Test Untrained (Random) Policy
              </button>

              <button
                onClick={() => runTestSimulation(true)}
                disabled={isSimulating || episodesTrained === 0}
                className="w-full p-3 bg-[#111111] text-white hover:bg-[#FF4D00] font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                Test Learned Greedy Policy
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]/15">
                <button
                  onClick={restartGame}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 border border-[#111111]/30 bg-[#F8F7F4] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Q-Table</span>
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
      </div>

      <GameFeedbackModal
        isOpen={gameOverModal.isOpen}
        isSuccess={gameOverModal.isSuccess}
        agent={agent}
        score={episodesTrained * 10}
        reason={gameOverModal.reason}
        decisionsSummary={[
          `Trained for ${episodesTrained} episodes with Bellman updates`,
          `Q-table converged to avoid lava traps at (1,1) and (2,2)`,
          `Greedy policy reached Goal Crystal (+100 reward)`,
        ]}
        onRetry={restartGame}
        onExploreAlgorithm={onOpenLab}
      />
    </div>
  );
};
