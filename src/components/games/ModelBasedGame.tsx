import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  DoorOpen, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Layers,
  RotateCcw
} from 'lucide-react';
import { AgentData } from '../../types/agent';
import { GameHeader } from './GameHeader';
import { GameFeedbackModal } from './GameFeedbackModal';

interface ModelBasedGameProps {
  agent: AgentData;
  onGameComplete: (success: boolean) => void;
  onOpenLab: () => void;
  onExit: () => void;
}

// 7x7 Grid with strategic dead ends
const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 1], // (1,1) Start
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1], // Junctions
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 3, 1], // (5,5) Exit!
  [1, 1, 1, 1, 1, 1, 1],
];

export const ModelBasedGame: React.FC<ModelBasedGameProps> = ({
  agent,
  onGameComplete,
  onOpenLab,
  onExit,
}) => {
  const [robotPos, setRobotPos] = useState<[number, number]>([1, 1]);
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set(['1,1']));
  const [backtrackStack, setBacktrackStack] = useState<[number, number][]>([[1, 1]]);
  const [stepsCount, setStepsCount] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);
  const [agentReasoning, setAgentReasoning] = useState<string>(
    'Internal state model initialized at Start coordinate (1,1).'
  );
  const [decisionHistory, setDecisionHistory] = useState<string[]>([]);
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    reason: string;
  }>({ isOpen: false, isSuccess: false, reason: '' });

  const exitPos: [number, number] = [5, 5];

  const isPath = (r: number, c: number) => {
    if (r < 0 || r >= MAZE_LAYOUT.length || c < 0 || c >= MAZE_LAYOUT[0].length) return false;
    return MAZE_LAYOUT[r][c] !== 1;
  };

  const getPercept = (r: number, c: number) => {
    return {
      north: isPath(r - 1, c) ? 'OPEN' : 'WALL',
      south: isPath(r + 1, c) ? 'OPEN' : 'WALL',
      east: isPath(r, c + 1) ? 'OPEN' : 'WALL',
      west: isPath(r, c - 1) ? 'OPEN' : 'WALL',
    };
  };

  const currentPercept = getPercept(robotPos[0], robotPos[1]);

  const stepAgent = useCallback(() => {
    const [r, c] = robotPos;
    if (r === exitPos[0] && c === exitPos[1]) return;

    const neighbors: { dir: string; pos: [number, number] }[] = [
      { dir: 'EAST', pos: [r, c + 1] },
      { dir: 'SOUTH', pos: [r + 1, c] },
      { dir: 'NORTH', pos: [r - 1, c] },
      { dir: 'WEST', pos: [r, c - 1] },
    ];

    const validOpen = neighbors.filter((n) => isPath(n.pos[0], n.pos[1]));
    const unvisitedNeighbor = validOpen.find((n) => !visitedSet.has(`${n.pos[0]},${n.pos[1]}`));

    if (unvisitedNeighbor) {
      const nextPos = unvisitedNeighbor.pos;
      const key = `${nextPos[0]},${nextPos[1]}`;
      const newVisited = new Set(visitedSet);
      newVisited.add(key);

      setVisitedSet(newVisited);
      setBacktrackStack((prev) => [...prev, nextPos]);
      setRobotPos(nextPos);
      setStepsCount((prev) => prev + 1);

      const reason = `Internal model: (${nextPos[0]},${nextPos[1]}) unvisited. Advancing ${unvisitedNeighbor.dir}.`;
      setAgentReasoning(reason);
      setDecisionHistory((prev) => [...prev, reason]);

      if (nextPos[0] === exitPos[0] && nextPos[1] === exitPos[1]) {
        setAutoRunning(false);
        setGameOverModal({
          isOpen: true,
          isSuccess: true,
          reason: `Mission complete! The Model-Based Agent tracked explored terrain, avoided infinite loops using its internal state, and exited the maze in ${stepsCount + 1} steps.`,
        });
        onGameComplete(true);
      }
    } else {
      if (backtrackStack.length > 1) {
        const newStack = [...backtrackStack];
        newStack.pop();
        const previousJunction = newStack[newStack.length - 1];

        setBacktrackStack(newStack);
        setRobotPos(previousJunction);
        setStepsCount((prev) => prev + 1);

        const reason = `Dead end detected! Popping internal memory stack to retreat to junction (${previousJunction[0]},${previousJunction[1]}).`;
        setAgentReasoning(reason);
        setDecisionHistory((prev) => [...prev, reason]);
      } else {
        setAutoRunning(false);
        setAgentReasoning('Internal state indicates no reachable unvisited paths.');
      }
    }
  }, [robotPos, visitedSet, backtrackStack, stepsCount, onGameComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRunning) {
      timer = setTimeout(() => {
        stepAgent();
      }, 400);
    }
    return () => clearTimeout(timer);
  }, [autoRunning, stepAgent]);

  const handleManualMove = (dr: number, dc: number, dirLabel: string) => {
    const nextR = robotPos[0] + dr;
    const nextC = robotPos[1] + dc;

    if (!isPath(nextR, nextC)) {
      setAgentReasoning(`Obstacle encountered: Wall detected at (${nextR},${nextC}).`);
      return;
    }

    const key = `${nextR},${nextC}`;
    const isNew = !visitedSet.has(key);
    const newVisited = new Set(visitedSet);
    newVisited.add(key);
    setVisitedSet(newVisited);

    const newStack = [...backtrackStack, [nextR, nextC] as [number, number]];
    setBacktrackStack(newStack);
    setRobotPos([nextR, nextC]);
    setStepsCount((prev) => prev + 1);

    const log = `Moved ${dirLabel} to (${nextR},${nextC}) — ${isNew ? 'Added to internal memory model' : 'Re-visiting known tile'}.`;
    setAgentReasoning(log);
    setDecisionHistory((prev) => [...prev, log]);

    if (nextR === exitPos[0] && nextC === exitPos[1]) {
      setGameOverModal({
        isOpen: true,
        isSuccess: true,
        reason: `You guided the robot to the exit using its internal state tracking! Visited ${newVisited.size} unique cells without getting lost in dead ends.`,
      });
      onGameComplete(true);
    }
  };

  const restartGame = () => {
    setRobotPos([1, 1]);
    setVisitedSet(new Set(['1,1']));
    setBacktrackStack([[1, 1]]);
    setStepsCount(0);
    setAutoRunning(false);
    setAgentReasoning('Internal state model initialized at Start coordinate (1,1).');
    setDecisionHistory([]);
    setGameOverModal({ isOpen: false, isSuccess: false, reason: '' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <GameHeader
        agent={agent}
        score={visitedSet.size * 10}
        onExit={onExit}
        onRestart={restartGame}
        onOpenLab={onOpenLab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Maze Stage */}
        <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_#111111]">
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4 mb-4">
            <div>
              <span className="label">Environment</span>
              <div className="font-serif text-xl font-bold text-[#111111]">
                Partially Observable 7×7 Grid
              </div>
            </div>
            <div className="font-mono text-xs text-[#111111]">
              Steps: <span className="font-bold text-[#FF4D00]">{stepsCount}</span>
            </div>
          </div>

          {/* Maze Grid */}
          <div className="flex justify-center items-center my-4">
            <div className="grid grid-cols-7 gap-1 p-2 border-2 border-[#111111] bg-[#111111]">
              {MAZE_LAYOUT.map((row, rIdx) =>
                row.map((cellType, cIdx) => {
                  const isRobotHere = robotPos[0] === rIdx && robotPos[1] === cIdx;
                  const isExit = rIdx === exitPos[0] && cIdx === exitPos[1];
                  const isVisited = visitedSet.has(`${rIdx},${cIdx}`);
                  const isWall = cellType === 1;

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center font-mono text-xs ${
                        isWall
                          ? 'bg-[#111111]'
                          : isRobotHere
                          ? 'bg-white border-2 border-[#FF4D00]'
                          : isExit
                          ? 'bg-[#F8F7F4] border-2 border-[#111111]'
                          : isVisited
                          ? 'bg-[#F8F7F4]'
                          : 'bg-white/80'
                      }`}
                    >
                      {isRobotHere ? (
                        <Bot className="h-6 w-6 text-[#FF4D00]" />
                      ) : isExit ? (
                        <DoorOpen className="h-6 w-6 text-[#111111]" />
                      ) : isVisited && !isWall ? (
                        <div className="h-2 w-2 rounded-full bg-[#111111]/30" />
                      ) : null}

                      <span className="absolute bottom-0.5 right-1 text-[7px] font-mono opacity-30 text-[#111111]">
                        {rIdx},{cIdx}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Reasoning Alert */}
          <div className="p-3 border border-[#111111]/20 bg-[#F8F7F4] font-mono text-xs text-[#111111]">
            <span className="label inline mr-2">Agent Trace:</span>
            <span>{agentReasoning}</span>
          </div>
        </div>

        {/* Right 5 cols: Internal State & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#111111]/20 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2">
              <span className="label flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Internal State Model
              </span>
              <span className="font-mono text-xs font-bold text-[#FF4D00]">
                {visitedSet.size} Coordinates Known
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4]">
                <span className="text-[10px] uppercase text-[#111111]/50 block">Current Coordinate</span>
                <span className="font-bold text-[#111111]">({robotPos[0]}, {robotPos[1]})</span>
              </div>
              <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4]">
                <span className="text-[10px] uppercase text-[#111111]/50 block">Backtrack Stack</span>
                <span className="font-bold text-[#FF4D00]">{backtrackStack.length} Nodes</span>
              </div>
            </div>

            <div className="p-3 border border-[#111111]/10 bg-[#F8F7F4] font-mono text-xs space-y-1">
              <span className="text-[10px] uppercase text-[#111111]/50 block mb-1">Local Wall Readings:</span>
              <div className="grid grid-cols-2 gap-2 text-[#111111]">
                <div>N: <strong>{currentPercept.north}</strong></div>
                <div>S: <strong>{currentPercept.south}</strong></div>
                <div>E: <strong>{currentPercept.east}</strong></div>
                <div>W: <strong>{currentPercept.west}</strong></div>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="border-2 border-[#111111] bg-white p-6 space-y-4">
            <span className="label">Execution Engine</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={stepAgent}
                disabled={autoRunning}
                className="py-3 px-2 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                Step Agent
              </button>
              <button
                onClick={() => setAutoRunning(!autoRunning)}
                className="py-3 px-2 bg-[#111111] text-white hover:bg-[#FF4D00] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                {autoRunning ? 'Pause Auto' : 'Auto-Solve'}
              </button>
            </div>

            {/* In-game Reset & Play Again */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]/15">
              <button
                onClick={restartGame}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 border border-[#111111]/30 bg-[#F8F7F4] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Maze</span>
              </button>
              <button
                onClick={restartGame}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#FF4D00] text-white hover:bg-[#111111] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                <span>Play Again</span>
              </button>
            </div>

            {/* D-Pad */}
            <div className="pt-4 border-t border-[#111111]/15 flex flex-col items-center gap-1.5">
              <button
                onClick={() => handleManualMove(-1, 0, 'North')}
                className="p-2 border border-[#111111] bg-[#F8F7F4] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleManualMove(0, -1, 'West')}
                  className="p-2 border border-[#111111] bg-[#F8F7F4] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleManualMove(1, 0, 'South')}
                  className="p-2 border border-[#111111] bg-[#F8F7F4] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleManualMove(0, 1, 'East')}
                  className="p-2 border border-[#111111] bg-[#F8F7F4] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
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
        score={visitedSet.size * 10}
        reason={gameOverModal.reason}
        decisionsSummary={decisionHistory.slice(-5)}
        onRetry={restartGame}
        onExploreAlgorithm={onOpenLab}
      />
    </div>
  );
};
