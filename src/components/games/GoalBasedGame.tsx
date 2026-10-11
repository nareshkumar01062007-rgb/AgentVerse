import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Flag, 
  Play, 
  ShieldAlert, 
  Footprints,
  RotateCcw
} from 'lucide-react';
import { AgentData } from '../../types/agent';
import { GameHeader } from './GameHeader';
import { GameFeedbackModal } from './GameFeedbackModal';

interface GoalBasedGameProps {
  agent: AgentData;
  onGameComplete: (success: boolean) => void;
  onOpenLab: () => void;
  onExit: () => void;
}

const GRID_SIZE = 6;

const PRESET_MAPS = {
  warehouse: [
    [1, 2], [2, 2], [3, 2],
    [2, 4], [3, 4], [4, 4],
  ],
  zigzag: [
    [1, 1], [1, 2], [1, 3],
    [3, 2], [3, 3], [3, 4],
  ],
  open: [
    [2, 2], [3, 3],
  ],
};

export const GoalBasedGame: React.FC<GoalBasedGameProps> = ({
  agent,
  onGameComplete,
  onOpenLab,
  onExit,
}) => {
  const [startPos, setStartPos] = useState<[number, number]>([0, 0]);
  const [goalPos, setGoalPos] = useState<[number, number]>([5, 5]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [obstacles, setObstacles] = useState<Set<string>>(
    new Set(PRESET_MAPS.warehouse.map(([r, c]) => `${r},${c}`))
  );
  const [computedPath, setComputedPath] = useState<[number, number][]>([]);
  const [exploredNodes, setExploredNodes] = useState<Set<string>>(new Set());
  const [isExecuting, setIsExecuting] = useState(false);
  const [execStepIdx, setExecStepIdx] = useState(0);
  const [planningLog, setPlanningLog] = useState<string>('Select goal and obstacles, then click "Compute BFS Path".');
  const [clickMode, setClickMode] = useState<'toggle-wall' | 'set-goal'>('toggle-wall');
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    reason: string;
  }>({ isOpen: false, isSuccess: false, reason: '' });

  const computeBFSPath = () => {
    const queue: [number, number][][] = [[[...startPos]]];
    const visited = new Set<string>([`${startPos[0]},${startPos[1]}`]);
    const explored = new Set<string>();

    let foundPath: [number, number][] | null = null;

    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const [r, c] = currentPath[currentPath.length - 1];
      explored.add(`${r},${c}`);

      if (r === goalPos[0] && c === goalPos[1]) {
        foundPath = currentPath;
        break;
      }

      const directions: [number, number][] = [
        [r - 1, c],
        [r + 1, c],
        [r, c + 1],
        [r, c - 1],
      ];

      for (const [nr, nc] of directions) {
        if (
          nr >= 0 &&
          nr < GRID_SIZE &&
          nc >= 0 &&
          nc < GRID_SIZE &&
          !obstacles.has(`${nr},${nc}`) &&
          !visited.has(`${nr},${nc}`)
        ) {
          visited.add(`${nr},${nc}`);
          queue.push([...currentPath, [nr, nc]]);
        }
      }
    }

    setExploredNodes(explored);

    if (foundPath) {
      setComputedPath(foundPath);
      setPlanningLog(
        `Goal Found: Optimal BFS trajectory discovered in ${foundPath.length - 1} steps (Explored ${explored.size} states).`
      );
    } else {
      setComputedPath([]);
      setPlanningLog('Path Blocked: No path satisfies the goal condition. Clear obstacles to open a route.');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExecuting && computedPath.length > 0) {
      if (execStepIdx < computedPath.length) {
        timer = setTimeout(() => {
          setRobotPos(computedPath[execStepIdx]);
          setExecStepIdx((prev) => prev + 1);
        }, 300);
      } else {
        setIsExecuting(false);
        setGameOverModal({
          isOpen: true,
          isSuccess: true,
          reason: `Mission complete! The Goal-Based Agent evaluated candidate actions against its explicit goal and executed the ${computedPath.length - 1}-step path directly to target coordinate (${goalPos[0]},${goalPos[1]}).`,
        });
        onGameComplete(true);
      }
    }
    return () => clearTimeout(timer);
  }, [isExecuting, execStepIdx, computedPath, onGameComplete, goalPos]);

  const handleCellClick = (r: number, c: number) => {
    if (isExecuting) return;
    if (r === startPos[0] && c === startPos[1]) return;

    if (clickMode === 'set-goal') {
      if (!obstacles.has(`${r},${c}`)) {
        setGoalPos([r, c]);
        setComputedPath([]);
        setExploredNodes(new Set());
        setPlanningLog(`Goal updated to coordinate (${r},${c}). Re-run BFS search.`);
      }
    } else {
      if (r === goalPos[0] && c === goalPos[1]) return;
      const key = `${r},${c}`;
      const newObs = new Set(obstacles);
      if (newObs.has(key)) {
        newObs.delete(key);
      } else {
        newObs.add(key);
      }
      setObstacles(newObs);
      setComputedPath([]);
      setExploredNodes(new Set());
    }
  };

  const startExecution = () => {
    if (computedPath.length === 0) {
      computeBFSPath();
    }
    setRobotPos(startPos);
    setExecStepIdx(0);
    setIsExecuting(true);
  };

  const restartGame = () => {
    setRobotPos(startPos);
    setComputedPath([]);
    setExploredNodes(new Set());
    setIsExecuting(false);
    setExecStepIdx(0);
    setPlanningLog('Select goal and obstacles, then click "Compute BFS Path".');
    setGameOverModal({ isOpen: false, isSuccess: false, reason: '' });
  };

  const loadPreset = (presetName: keyof typeof PRESET_MAPS) => {
    setObstacles(new Set(PRESET_MAPS[presetName].map(([r, c]) => `${r},${c}`)));
    restartGame();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <GameHeader
        agent={agent}
        score={computedPath.length > 0 ? (GRID_SIZE * GRID_SIZE - computedPath.length) * 10 : 0}
        onExit={onExit}
        onRestart={restartGame}
        onOpenLab={onOpenLab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Map Canvas */}
        <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#111111]">
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4 mb-4">
            <div>
              <span className="label">Environment</span>
              <div className="font-serif text-xl font-bold text-[#111111]">
                Logistics Warehouse Grid ({GRID_SIZE}×{GRID_SIZE})
              </div>
            </div>
            <div className="font-mono text-xs text-[#111111]">
              Optimal Steps: <span className="font-bold text-[#FF4D00]">{computedPath.length > 0 ? computedPath.length - 1 : '--'}</span>
            </div>
          </div>

          {/* Grid Render */}
          <div className="flex justify-center items-center my-4">
            <div
              className="grid gap-1.5 p-2 border-2 border-[#111111] bg-[#111111]"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: GRID_SIZE }).map((_, r) =>
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const isGoal = goalPos[0] === r && goalPos[1] === c;
                  const isRobot = robotPos[0] === r && robotPos[1] === c;
                  const isObstacle = obstacles.has(`${r},${c}`);
                  const isPathNode = computedPath.some(([pr, pc]) => pr === r && pc === c);
                  const isExplored = exploredNodes.has(`${r},${c}`);

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      disabled={isExecuting}
                      className={`relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center font-mono text-xs cursor-pointer ${
                        isObstacle
                          ? 'bg-[#111111] text-white'
                          : isRobot
                          ? 'bg-white border-2 border-[#FF4D00]'
                          : isGoal
                          ? 'bg-white border-2 border-[#111111]'
                          : isPathNode
                          ? 'bg-[#F8F7F4] border border-[#FF4D00]'
                          : isExplored
                          ? 'bg-[#F8F7F4]'
                          : 'bg-white'
                      }`}
                    >
                      {isObstacle ? (
                        <ShieldAlert className="h-4 w-4 text-[#FF4D00]" />
                      ) : isRobot ? (
                        <Bot className="h-6 w-6 text-[#FF4D00]" />
                      ) : isGoal ? (
                        <Flag className="h-6 w-6 text-[#111111]" />
                      ) : isPathNode ? (
                        <Footprints className="h-4 w-4 text-[#FF4D00]" />
                      ) : null}

                      <span className="absolute bottom-0.5 right-1 text-[7px] font-mono opacity-30 text-[#111111]">
                        {r},{c}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 border border-[#111111]/20 bg-[#F8F7F4] font-mono text-xs text-[#111111]">
            <span className="label inline mr-2">Search Output:</span>
            <span>{planningLog}</span>
          </div>
        </div>

        {/* Right 5 cols: Goal Formulation & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#111111]/20 bg-white p-6 space-y-4">
            <span className="label">Goal Formulation</span>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4]">
                <span className="text-[10px] uppercase text-[#111111]/50 block">Initial State (s0)</span>
                <span className="font-bold text-[#111111]">({startPos[0]}, {startPos[1]})</span>
              </div>
              <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4]">
                <span className="text-[10px] uppercase text-[#FF4D00] block">Goal State (g)</span>
                <span className="font-bold text-[#FF4D00]">({goalPos[0]}, {goalPos[1]})</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-mono text-[10px] uppercase text-[#111111]/50 block mb-1">Click Mode:</span>
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setClickMode('toggle-wall')}
                  className={`flex-1 p-2.5 border uppercase cursor-pointer ${
                    clickMode === 'toggle-wall'
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'border-[#111111]/20 text-[#111111]'
                  }`}
                >
                  Wall Barrier
                </button>
                <button
                  onClick={() => setClickMode('set-goal')}
                  className={`flex-1 p-2.5 border uppercase cursor-pointer ${
                    clickMode === 'set-goal'
                      ? 'bg-[#FF4D00] text-white border-[#FF4D00] font-bold'
                      : 'border-[#111111]/20 text-[#111111]'
                  }`}
                >
                  Set Goal Flag
                </button>
              </div>
            </div>
          </div>

          {/* Planning Actions */}
          <div className="border-2 border-[#111111] bg-white p-6 space-y-4">
            <span className="label">Search Planner</span>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#111111]/50">Presets:</span>
              <button onClick={() => loadPreset('warehouse')} className="underline hover:text-[#FF4D00]">Warehouse</button>
              <span>·</span>
              <button onClick={() => loadPreset('zigzag')} className="underline hover:text-[#FF4D00]">Zigzag</button>
              <span>·</span>
              <button onClick={() => loadPreset('open')} className="underline hover:text-[#FF4D00]">Open</button>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={computeBFSPath}
                disabled={isExecuting}
                className="w-full p-4 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                Compute BFS Path
              </button>

              <button
                onClick={startExecution}
                disabled={isExecuting || computedPath.length === 0}
                className="w-full p-4 bg-[#111111] text-white hover:bg-[#FF4D00] font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                Execute Delivery Trajectory
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]/15">
                <button
                  onClick={restartGame}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 border border-[#111111]/30 bg-[#F8F7F4] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Grid</span>
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
        score={computedPath.length > 0 ? (GRID_SIZE * GRID_SIZE - computedPath.length) * 10 : 0}
        reason={gameOverModal.reason}
        decisionsSummary={computedPath.map((p, i) => `Step ${i}: Transitioned to (${p[0]}, ${p[1]})`)}
        onRetry={restartGame}
        onExploreAlgorithm={onOpenLab}
      />
    </div>
  );
};
