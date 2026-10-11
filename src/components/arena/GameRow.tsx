import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight, 
  Star, 
  Fan, 
  Bot, 
  Flag,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Sparkles,
  Sliders,
  Zap,
  Brain,
  Scale,
  Play,
  Crosshair,
  ShieldAlert
} from 'lucide-react';
import { AgentId } from '../../types/agent';

interface GameRowProps {
  activeAgentId: AgentId;
  onSelectAgent: (id: AgentId) => void;
  onGameActionComplete?: (agentId: AgentId, success: boolean) => void;
}

export const GameRow: React.FC<GameRowProps> = ({
  activeAgentId,
  onSelectAgent,
  onGameActionComplete,
}) => {
  // Global Mode per game: 'manual' vs 'agent'
  const [modeGame1, setModeGame1] = useState<'manual' | 'agent'>('manual');
  const [modeGame2, setModeGame2] = useState<'manual' | 'agent'>('manual');
  const [modeGame3, setModeGame3] = useState<'manual' | 'agent'>('manual');
  const [modeGame4, setModeGame4] = useState<'manual' | 'agent'>('manual');
  const [modeGame5, setModeGame5] = useState<'manual' | 'agent'>('manual');

  // =========================================================================
  // GAME 1: Simple Reflex State & Logic
  // Rule: IF temperature > threshold THEN Fan = ON ELSE Fan = OFF
  // =========================================================================
  const [reflexTemp, setReflexTemp] = useState<number>(32);
  const [reflexThreshold, setReflexThreshold] = useState<number>(30);
  const [reflexFanOn, setReflexFanOn] = useState<boolean>(true); // 32°C > 30°C initial state: fan runs according to logic
  const [reflexScore, setReflexScore] = useState<number>(10);
  const [reflexFeedback, setReflexFeedback] = useState<string | null>(
    'Rule: Temp (32°C) > 30°C → Fan is actively RUNNING to cool room.'
  );
  const [reflexFinished, setReflexFinished] = useState<boolean>(false);

  // Set temperature and automatically execute reflex logic
  const handleSetReflexTemp = (tempVal: number, threshVal = reflexThreshold) => {
    setReflexTemp(tempVal);
    // Simple Reflex Condition-Action Rule:
    // IF Temp > Threshold THEN Fan = ON (RUNNING) ELSE Fan = OFF (STOPPED)
    const shouldBeOn = tempVal > threshVal;
    setReflexFanOn(shouldBeOn);
    if (shouldBeOn) {
      setReflexFeedback(
        `Logic Triggered: Temp (${tempVal}°C) > ${threshVal}°C → Fan is actively RUNNING!`
      );
      setReflexScore((prev) => prev + 10);
      if (onGameActionComplete) onGameActionComplete('simple-reflex', true);
    } else {
      setReflexFeedback(
        `Logic Triggered: Temp (${tempVal}°C) ≤ ${threshVal}°C → Fan automatically STOPPED (Standby).`
      );
    }
  };

  // Set threshold and adjust reflex action
  const handleSetReflexThreshold = (threshVal: number) => {
    setReflexThreshold(threshVal);
    const shouldBeOn = reflexTemp > threshVal;
    setReflexFanOn(shouldBeOn);
    if (shouldBeOn) {
      setReflexFeedback(
        `Threshold (${threshVal}°C) updated: Temp (${reflexTemp}°C) > ${threshVal}°C → Fan is RUNNING!`
      );
    } else {
      setReflexFeedback(
        `Threshold (${threshVal}°C) updated: Temp (${reflexTemp}°C) ≤ ${threshVal}°C → Fan STOPPED.`
      );
    }
  };

  // Manual player override buttons
  const handleManualReflexFan = (turnOn: boolean) => {
    setReflexFanOn(turnOn);
    const compliant = (reflexTemp > reflexThreshold && turnOn) || (reflexTemp <= reflexThreshold && !turnOn);
    if (compliant) {
      setReflexScore((prev) => prev + 10);
      setReflexFeedback(
        `Manual match! Rule satisfied: Temp (${reflexTemp}°C) ${reflexTemp > reflexThreshold ? '>' : '≤'} ${reflexThreshold}°C → Fan ${turnOn ? 'RUNNING' : 'STOPPED'}.`
      );
      if (onGameActionComplete) onGameActionComplete('simple-reflex', true);
    } else {
      setReflexFeedback(
        `Manual override warning: At ${reflexTemp}°C, reflex rule prescribes Fan ${reflexTemp > reflexThreshold ? 'RUNNING' : 'STOPPED'}.`
      );
    }
  };

  const resetReflexGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReflexTemp(32);
    setReflexThreshold(30);
    setReflexFanOn(true); // 32 > 30 -> fan is running
    setReflexScore(10);
    setReflexFeedback('Reset: Temp set to 32°C. Fan is RUNNING according to rule (32°C > 30°C).');
    setReflexFinished(false);
  };

  const playAgainReflex = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newTemps = [22, 26, 29, 34, 38, 41];
    const nextT = newTemps[Math.floor(Math.random() * newTemps.length)];
    handleSetReflexTemp(nextT);
  };

  // =========================================================================
  // GAME 2: Model-Based State & Logic (Internal World Memory)
  // Maintains internal memory of visited states and walls to avoid cycles
  // =========================================================================
  const mazeGrid = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2], // 2 = Star Goal at (4,4)
  ];
  const [mazePos, setMazePos] = useState<[number, number]>([0, 0]);
  const [mazeVisited, setMazeVisited] = useState<Set<string>>(new Set(['0,0']));
  const [mazeLevel, setMazeLevel] = useState<number>(1);
  const [mazeFinished, setMazeFinished] = useState<boolean>(false);
  const [mazeFeedback, setMazeFeedback] = useState<string>('Memory Model active: tracking visited tiles.');

  // Move function (supports manual directional buttons, clicking tiles, or keyboard)
  const moveMazeRobot = useCallback((dr: number, dc: number) => {
    if (mazeFinished) return;
    const nr = mazePos[0] + dr;
    const nc = mazePos[1] + dc;
    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && mazeGrid[nr][nc] !== 1) {
      setMazePos([nr, nc]);
      const key = `${nr},${nc}`;
      const wasVisited = mazeVisited.has(key);
      const newVisited = new Set(mazeVisited);
      newVisited.add(key);
      setMazeVisited(newVisited);

      if (nr === 4 && nc === 4) {
        setMazeFinished(true);
        setMazeFeedback('Goal reached! Model-based agent successfully guided to star.');
        if (onGameActionComplete) onGameActionComplete('model-based', true);
      } else if (wasVisited) {
        setMazeFeedback(`Revisiting (${nr},${nc}). Internal model recognizes previous trail.`);
      } else {
        setMazeFeedback(`Explored new tile (${nr},${nc}). Stored into internal world model.`);
      }
    }
  }, [mazeFinished, mazePos, mazeVisited, onGameActionComplete]);

  // Click on any tile to move if adjacent
  const handleMazeTileClick = (r: number, c: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mazeFinished || mazeGrid[r][c] === 1) return;
    const dr = r - mazePos[0];
    const dc = c - mazePos[1];
    // Must be adjacent (up, down, left, right)
    if (Math.abs(dr) + Math.abs(dc) === 1) {
      moveMazeRobot(dr, dc);
    }
  };

  // AI Agent Step: Uses internal memory to choose unvisited neighbor towards goal
  const stepModelBasedAgent = () => {
    if (mazeFinished) return;
    const [r, c] = mazePos;
    const dirs: [number, number][] = [
      [0, 1],  // Right
      [1, 0],  // Down
      [-1, 0], // Up
      [0, -1], // Left
    ];

    // Find all valid neighbors
    const validMoves = dirs.map(([dr, dc]) => ({
      dr,
      dc,
      nr: r + dr,
      nc: c + dc,
    })).filter(({ nr, nc }) => nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && mazeGrid[nr][nc] !== 1);

    if (validMoves.length === 0) return;

    // Prioritize unvisited neighbors, sorted by distance to goal (4,4)
    const unvisited = validMoves.filter((m) => !mazeVisited.has(`${m.nr},${m.nc}`));
    const distToGoal = (nr: number, nc: number) => Math.abs(4 - nr) + Math.abs(4 - nc);

    if (unvisited.length > 0) {
      unvisited.sort((a, b) => distToGoal(a.nr, a.nc) - distToGoal(b.nr, b.nc));
      moveMazeRobot(unvisited[0].dr, unvisited[0].dc);
    } else {
      // Memory backtrack: pick visited neighbor with closest distance to goal
      validMoves.sort((a, b) => distToGoal(a.nr, a.nc) - distToGoal(b.nr, b.nc));
      moveMazeRobot(validMoves[0].dr, validMoves[0].dc);
    }
  };

  const resetMazeGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMazePos([0, 0]);
    setMazeVisited(new Set(['0,0']));
    setMazeFeedback('Memory reset. Internal model cleared.');
    setMazeFinished(false);
  };

  const playAgainMaze = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMazePos([0, 0]);
    setMazeVisited(new Set(['0,0']));
    setMazeLevel((prev) => prev + 1);
    setMazeFeedback(`Level ${mazeLevel + 1}: Navigate to the destination star!`);
    setMazeFinished(false);
  };

  // =========================================================================
  // GAME 3: Goal-Based State & Logic (Search & Heuristic Planning)
  // Formulates explicit goal state and plans sequence of actions (BFS / A*)
  // =========================================================================
  const [goalRobotPos, setGoalRobotPos] = useState<[number, number]>([2, 1]);
  const [goalTarget, setGoalTarget] = useState<[number, number]>([0, 4]);
  const [goalSettingMode, setGoalSettingMode] = useState<boolean>(false);
  const [goalLevel, setGoalLevel] = useState<number>(1);
  const [goalFinished, setGoalFinished] = useState<boolean>(false);
  const [goalFeedback, setGoalFeedback] = useState<string>('Goal formulated: Destination flag at (0,4).');

  // Obstacles map
  const isGoalObstacle = (r: number, c: number) => {
    // Mountain at (4,2), water at (1,3), (2,3), (3,3)
    return (r === 4 && c === 2) || (c === 3 && r >= 1 && r <= 3);
  };

  // Manhattan distance heuristic: h(n) = |r - gr| + |c - gc|
  const goalHeuristic = Math.abs(goalRobotPos[0] - goalTarget[0]) + Math.abs(goalRobotPos[1] - goalTarget[1]);

  const moveGoalRobot = useCallback((dr: number, dc: number) => {
    if (goalFinished) return;
    const nr = goalRobotPos[0] + dr;
    const nc = goalRobotPos[1] + dc;
    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
      if (isGoalObstacle(nr, nc)) {
        setGoalFeedback(`Terrain obstacle at (${nr},${nc})! Goal planner routes around.`);
        return;
      }
      setGoalRobotPos([nr, nc]);
      if (nr === goalTarget[0] && nc === goalTarget[1]) {
        setGoalFinished(true);
        setGoalFeedback('Goal reached! Planner successfully reached the destination flag.');
        if (onGameActionComplete) onGameActionComplete('goal-based', true);
      } else {
        const newH = Math.abs(nr - goalTarget[0]) + Math.abs(nc - goalTarget[1]);
        setGoalFeedback(`Step taken. Heuristic distance to goal h(n) = ${newH}.`);
      }
    }
  }, [goalFinished, goalRobotPos, goalTarget, onGameActionComplete]);

  // Click on any tile to move if adjacent, or set goal if goalSettingMode
  const handleGoalTileClick = (r: number, c: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (goalSettingMode) {
      if (!isGoalObstacle(r, c) && !(r === goalRobotPos[0] && c === goalRobotPos[1])) {
        setGoalTarget([r, c]);
        setGoalSettingMode(false);
        setGoalFinished(false);
        setGoalFeedback(`New Goal set at (${r},${c})! Heuristic h(n) updated.`);
      }
      return;
    }

    if (goalFinished || isGoalObstacle(r, c)) return;
    const dr = r - goalRobotPos[0];
    const dc = c - goalRobotPos[1];
    if (Math.abs(dr) + Math.abs(dc) === 1) {
      moveGoalRobot(dr, dc);
    }
  };

  // AI Agent Plan & Step using BFS shortest path towards goalTarget
  const stepGoalAgent = () => {
    if (goalFinished) return;
    const [startR, startC] = goalRobotPos;
    const [targetR, targetC] = goalTarget;

    // BFS Queue
    const queue: { r: number; c: number; path: [number, number][] }[] = [
      { r: startR, c: startC, path: [] },
    ];
    const visited = new Set<string>([`${startR},${startC}`]);

    let bestFirstStep: [number, number] | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.r === targetR && current.c === targetC) {
        if (current.path.length > 0) {
          bestFirstStep = current.path[0];
        }
        break;
      }

      const dirs: [number, number][] = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      for (const [dr, dc] of dirs) {
        const nr = current.r + dr;
        const nc = current.c + dc;
        const key = `${nr},${nc}`;
        if (
          nr >= 0 && nr < 5 && nc >= 0 && nc < 5 &&
          !isGoalObstacle(nr, nc) &&
          !visited.has(key)
        ) {
          visited.add(key);
          const nextStep: [number, number] = [dr, dc];
          queue.push({
            r: nr,
            c: nc,
            path: current.path.length === 0 ? [nextStep] : current.path,
          });
        }
      }
    }

    if (bestFirstStep) {
      moveGoalRobot(bestFirstStep[0], bestFirstStep[1]);
    } else {
      setGoalFeedback('No path found to goal! Obstacles blocking target.');
    }
  };

  const resetGoalGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGoalRobotPos([2, 1]);
    setGoalTarget([0, 4]);
    setGoalSettingMode(false);
    setGoalFeedback('Grid reset to initial start and goal coordinates.');
    setGoalFinished(false);
  };

  const playAgainGoal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGoalRobotPos([4, 0]);
    setGoalTarget([0, 4]);
    setGoalLevel((prev) => prev + 1);
    setGoalFeedback(`Level ${goalLevel + 1}: Deliver package to flag destination.`);
    setGoalFinished(false);
  };

  // =========================================================================
  // GAME 4: Utility-Based State & Logic (Maximum Expected Utility)
  // Evaluates options with weighted trade-offs: U(x) = Wh*Health + Wt*Taste - Wc*Cost
  // =========================================================================
  const [selectedFood, setSelectedFood] = useState<'salad' | 'burger' | 'pizza'>('salad');
  const [utilityWeights, setUtilityWeights] = useState({
    health: 7,
    taste: 5,
    cost: 4,
  });
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);
  const [utilityScore, setUtilityScore] = useState<number>(0);
  const [utilityFeedback, setUtilityFeedback] = useState<string | null>(null);
  const [utilityFinished, setUtilityFinished] = useState<boolean>(false);

  // Food item attributes - actual data values: Health (H), Taste (T), Cost (C)
  const foodItems = {
    salad: { name: 'Salad', icon: '🥗', health: 9, taste: 4, cost: 3 },
    burger: { name: 'Burger', icon: '🍔', health: 2, taste: 9, cost: 6 },
    pizza: { name: 'Pizza', icon: '🍕', health: 4, taste: 8, cost: 5 },
  };

  // Calculate utility for any candidate: U(x) = W_health × Health + W_taste × Taste − W_cost × Cost
  const computeUtility = (
    itemKey: 'salad' | 'burger' | 'pizza',
    weights = utilityWeights
  ) => {
    const item = foodItems[itemKey];
    return (
      weights.health * item.health +
      weights.taste * item.taste -
      weights.cost * item.cost
    );
  };

  // Find the item that maximizes utility: argmax_x U(x)
  const getOptimalUtilityFood = (weights = utilityWeights): 'salad' | 'burger' | 'pizza' => {
    const keys: ('salad' | 'burger' | 'pizza')[] = ['salad', 'burger', 'pizza'];
    let bestKey = keys[0];
    let bestVal = computeUtility(keys[0], weights);
    for (const k of keys) {
      const val = computeUtility(k, weights);
      if (val > bestVal) {
        bestVal = val;
        bestKey = k;
      }
    }
    return bestKey;
  };

  // Update preference weight slider and immediately recalculate all utility scores
  const handleWeightChange = (key: 'health' | 'taste' | 'cost', value: number) => {
    const newWeights = { ...utilityWeights, [key]: value };
    setUtilityWeights(newWeights);

    const optimal = getOptimalUtilityFood(newWeights);
    const optimalVal = computeUtility(optimal, newWeights);

    if (modeGame4 === 'agent') {
      // In AI Agent mode, automatically choose option with highest utility score
      setSelectedFood(optimal);
      setUtilityFeedback(
        `AI Agent: Preference sliders updated. Automatically chose ${foodItems[optimal].name} with highest utility score U = ${optimalVal} (argmax U(x))!`
      );
    } else {
      // In Manual Input mode, update evaluation against highest utility option
      const pickedVal = computeUtility(selectedFood, newWeights);
      if (selectedFood === optimal) {
        setUtilityFeedback(
          `Weights updated. Selected ${foodItems[selectedFood].name} is optimal with maximum utility U = ${pickedVal}.`
        );
      } else {
        const diff = optimalVal - pickedVal;
        setUtilityFeedback(
          `Weights updated. Selected ${foodItems[selectedFood].name} gives U = ${pickedVal}, while ${foodItems[optimal].name} achieves highest utility U = ${optimalVal} (Difference: -${diff}).`
        );
      }
    }
  };

  // Evaluate manual player selection against the highest-utility option
  const handleSelectUtilityFood = (choice?: 'salad' | 'burger' | 'pizza') => {
    const picked = choice || selectedFood;
    setSelectedFood(picked);
    const optimal = getOptimalUtilityFood();
    const pickedUtility = computeUtility(picked);
    const optimalUtility = computeUtility(optimal);

    if (picked === optimal) {
      setUtilityScore((prev) => prev + 15);
      setUtilityFeedback(
        `Optimal Pick! ${foodItems[picked].name} yields maximum utility U = ${pickedUtility} under your current weights. Matches AI Agent rational choice!`
      );
      setUtilityFinished(true);
      if (onGameActionComplete) onGameActionComplete('utility-based', true);
    } else {
      const diff = optimalUtility - pickedUtility;
      setUtilityFeedback(
        `Suboptimal Choice: ${foodItems[picked].name} gives U = ${pickedUtility}, whereas ${foodItems[optimal].name} maximizes utility at U = ${optimalUtility} (Opportunity cost: -${diff}).`
      );
    }
  };

  // When switching to or activating AI Agent, automatically choose the option with highest utility score
  const executeUtilityAgent = (weights = utilityWeights) => {
    setModeGame4('agent');
    const optimal = getOptimalUtilityFood(weights);
    setSelectedFood(optimal);
    const val = computeUtility(optimal, weights);
    setUtilityScore((prev) => prev + 15);
    setUtilityFeedback(
      `AI Agent Decision: Automatically chose ${foodItems[optimal].name} with maximum utility U = ${val} (argmax U(x))!`
    );
    setUtilityFinished(true);
    if (onGameActionComplete) onGameActionComplete('utility-based', true);
  };

  const resetUtilityGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const defaultWeights = { health: 7, taste: 5, cost: 4 };
    setUtilityWeights(defaultWeights);
    const optimal = getOptimalUtilityFood(defaultWeights);
    setSelectedFood(optimal);
    setUtilityScore(0);
    setUtilityFeedback(null);
    setUtilityFinished(false);
  };

  const playAgainUtility = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Randomize preference weights for a fresh decision scenario
    const newH = Math.floor(Math.random() * 8) + 2;
    const newT = Math.floor(Math.random() * 8) + 2;
    const newC = Math.floor(Math.random() * 6) + 2;
    const newWeights = { health: newH, taste: newT, cost: newC };
    setUtilityWeights(newWeights);
    const optimal = getOptimalUtilityFood(newWeights);
    const optimalVal = computeUtility(optimal, newWeights);

    if (modeGame4 === 'agent') {
      setSelectedFood(optimal);
      setUtilityFeedback(
        `New Scenario (Wh:${newH}, Wt:${newT}, Wc:${newC}): AI Agent chose ${foodItems[optimal].name} (U = ${optimalVal})!`
      );
    } else {
      setUtilityFeedback(
        `New Scenario: Preferences set to Health ${newH}, Taste ${newT}, Cost ${newC}. Select an option to evaluate!`
      );
    }
    setUtilityFinished(false);
  };

  // =========================================================================
  // GAME 5: Learning Agent State & Logic (Reinforcement / Q-Learning)
  // Learns optimal behavior through reward feedback: Coins (+15), Spikes (-20), Star (+50)
  // =========================================================================
  const [learnRobotPos, setLearnRobotPos] = useState<[number, number]>([3, 0]);
  const [learnEpisode, setLearnEpisode] = useState<number>(1);
  const [learnCoins, setLearnCoins] = useState<Set<string>>(new Set(['1,1', '2,2', '1,4', '0,3']));
  const [learnScore, setLearnScore] = useState<number>(0);
  const [learnFinished, setLearnFinished] = useState<boolean>(false);
  const [learnFeedback, setLearnFeedback] = useState<string>('Q-Learning active: reward coins (+15), avoid spikes (-20).');
  const [learningRate, setLearningRate] = useState<number>(0.5);
  const [explorationEps, setExplorationEps] = useState<number>(0.2);

  const isLearnSpike = (r: number, c: number) => r === 3 && (c === 2 || c === 3 || c === 4);
  const isLearnStar = (r: number, c: number) => r === 0 && c === 4;

  const moveLearnRobot = useCallback((dr: number, dc: number) => {
    if (learnFinished) return;
    const nr = Math.max(0, Math.min(3, learnRobotPos[0] + dr));
    const nc = Math.max(0, Math.min(4, learnRobotPos[1] + dc));
    setLearnRobotPos([nr, nc]);

    const key = `${nr},${nc}`;
    let reward = -1; // step penalty

    if (learnCoins.has(key)) {
      reward += 15;
      const updated = new Set(learnCoins);
      updated.delete(key);
      setLearnCoins(updated);
      setLearnScore((prev) => prev + 15);
      setLearnFeedback(`Reward collected: Coin (+15)! Policy value updated.`);
    } else if (isLearnSpike(nr, nc)) {
      reward -= 20;
      setLearnScore((prev) => Math.max(0, prev - 20));
      setLearnFeedback(`Negative reward: Stepped on Spikes (-20)! Agent learns penalty.`);
    } else {
      setLearnFeedback(`Moved to (${nr},${nc}). Step penalty (-1).`);
    }

    if (isLearnStar(nr, nc)) {
      setLearnScore((prev) => prev + 50);
      setLearnFinished(true);
      setLearnFeedback(`Goal Star reached (+50)! Episode ${learnEpisode} complete with high reward.`);
      if (onGameActionComplete) onGameActionComplete('learning', true);
    }
  }, [learnCoins, learnEpisode, learnFinished, learnRobotPos, onGameActionComplete]);

  // Click on any tile to move if adjacent
  const handleLearnTileClick = (r: number, c: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (learnFinished) return;
    const dr = r - learnRobotPos[0];
    const dc = c - learnRobotPos[1];
    if (Math.abs(dr) + Math.abs(dc) === 1) {
      moveLearnRobot(dr, dc);
    }
  };

  // AI Learn Step using epsilon-greedy policy toward highest reward
  const stepLearningAgent = () => {
    if (learnFinished) return;
    const [r, c] = learnRobotPos;

    // Candidate directions
    const dirs: [number, number][] = [
      [-1, 0], // Up
      [0, 1],  // Right
      [1, 0],  // Down
      [0, -1], // Left
    ];

    // Epsilon exploration
    if (Math.random() < explorationEps) {
      const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
      moveLearnRobot(randomDir[0], randomDir[1]);
      return;
    }

    // Greedy evaluation: choose action maximizing estimated reward
    let bestDir = dirs[0];
    let bestValue = -999;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr <= 3 && nc >= 0 && nc <= 4) {
        let val = 0;
        if (isLearnStar(nr, nc)) val += 50;
        if (learnCoins.has(`${nr},${nc}`)) val += 20;
        if (isLearnSpike(nr, nc)) val -= 40;
        // distance heuristic towards star
        val -= (Math.abs(0 - nr) + Math.abs(4 - nc)) * 2;

        if (val > bestValue) {
          bestValue = val;
          bestDir = [dr, dc];
        }
      }
    }

    moveLearnRobot(bestDir[0], bestDir[1]);
  };

  // Auto-train episode
  const autoTrainEpisode = () => {
    setLearnEpisode((prev) => prev + 1);
    setLearnRobotPos([3, 0]);
    setLearnCoins(new Set(['1,1', '2,2', '1,4', '0,3']));
    setLearnFinished(false);

    // Fast simulated sequence
    let currentScore = learnScore;
    setTimeout(() => {
      setLearnRobotPos([2, 0]);
      setTimeout(() => {
        setLearnRobotPos([1, 1]);
        setLearnCoins(new Set(['2,2', '1,4', '0,3']));
        currentScore += 15;
        setLearnScore(currentScore);
        setTimeout(() => {
          setLearnRobotPos([1, 2]);
          setTimeout(() => {
            setLearnRobotPos([1, 4]);
            setLearnCoins(new Set(['2,2', '0,3']));
            currentScore += 15;
            setLearnScore(currentScore);
            setTimeout(() => {
              setLearnRobotPos([0, 4]);
              currentScore += 50;
              setLearnScore(currentScore);
              setLearnFinished(true);
              setLearnFeedback(`Trained Episode ${learnEpisode + 1}: Optimal safe path learned! Avoided all spikes.`);
              if (onGameActionComplete) onGameActionComplete('learning', true);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  };

  const resetLearningGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLearnRobotPos([3, 0]);
    setLearnEpisode(1);
    setLearnCoins(new Set(['1,1', '2,2', '1,4', '0,3']));
    setLearnScore(0);
    setLearnFeedback('Q-Table and episodes reset to baseline.');
    setLearnFinished(false);
  };

  const playAgainLearning = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLearnRobotPos([3, 0]);
    setLearnCoins(new Set(['1,1', '2,2', '1,4', '0,3']));
    setLearnEpisode((prev) => prev + 1);
    setLearnFeedback(`Episode ${learnEpisode + 1} started. Ready to collect rewards!`);
    setLearnFinished(false);
  };

  // =========================================================================
  // GLOBAL RESET & REPLAY
  // =========================================================================
  const resetAllGames = () => {
    resetReflexGame();
    resetMazeGame();
    resetGoalGame();
    resetUtilityGame();
    resetLearningGame();
  };

  const playAgainAllGames = () => {
    playAgainReflex();
    playAgainMaze();
    playAgainGoal();
    playAgainUtility();
    playAgainLearning();
  };

  // =========================================================================
  // KEYBOARD ARROW CONTROLS (Manual input for active movement game)
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      let dr = 0;
      let dc = 0;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dr = -1;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dr = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dc = -1;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dc = 1;
      else return;

      if (activeAgentId === 'model-based') {
        e.preventDefault();
        moveMazeRobot(dr, dc);
      } else if (activeAgentId === 'goal-based') {
        e.preventDefault();
        moveGoalRobot(dr, dc);
      } else if (activeAgentId === 'learning') {
        e.preventDefault();
        moveLearnRobot(dr, dc);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAgentId, moveMazeRobot, moveGoalRobot, moveLearnRobot]);

  return (
    <div className="w-full space-y-2">
      {/* Top Bar with Reset All Games & Connecting Arrows */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="hidden lg:grid grid-cols-5 gap-3.5 flex-1 text-center">
          <div className="flex justify-center">
            <span className="text-xs font-bold text-[#00E6B8] animate-bounce">↓</span>
          </div>
          <div className="flex justify-center">
            <span className="text-xs font-bold text-[#168BFF] animate-bounce">↓</span>
          </div>
          <div className="flex justify-center">
            <span className="text-xs font-bold text-[#FFB020] animate-bounce">↓</span>
          </div>
          <div className="flex justify-center">
            <span className="text-xs font-bold text-[#8B5CF6] animate-bounce">↓</span>
          </div>
          <div className="flex justify-center">
            <span className="text-xs font-bold text-[#F044A7] animate-bounce">↓</span>
          </div>
        </div>

        {/* Global Reset All & Play All Again Options */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={playAgainAllGames}
            title="Play again across all 5 games"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A2C55] bg-[#0A142A]/90 hover:bg-[#122244] px-3 py-1 text-[11px] font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Play All Again</span>
          </button>
          <button
            onClick={resetAllGames}
            title="Reset all 5 games to initial state"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A2C55] bg-[#0A142A]/90 hover:bg-[#122244] px-3 py-1 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-3 w-3 text-slate-400" />
            <span>Reset All Games</span>
          </button>
        </div>
      </div>

      {/* Five Interactive Game Panels in ONE Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5 items-stretch">
        {/* ========================================================= */}
        {/* GAME 1: Simple Reflex Agent (Teal) */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectAgent('simple-reflex')}
          className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer relative ${
            activeAgentId === 'simple-reflex'
              ? 'border-[#00E6B8] bg-[#091326] shadow-[0_0_20px_rgba(0,230,184,0.25)] ring-1 ring-[#00E6B8]'
              : 'border-[#15233E] bg-[#0B1428] hover:border-[#00E6B8]/60'
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#162747]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent('simple-reflex');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={resetReflexGame}
                  title="Reset Game"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0A162D] hover:bg-[#132446] border border-[#1A2D52] text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-cyan-400" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#00E6B8]">Simple Reflex</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A1D36] text-[#22D3EE] border border-[#16365C]">
                Score: {reflexScore}
              </span>
            </div>

            {/* Mode Toggle: Manual Input vs AI Agent */}
            <div className="flex items-center justify-between bg-[#070D1E] p-1 rounded-lg border border-[#142646] mb-2.5">
              <span className="text-[10px] font-mono text-slate-400 pl-1">Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame1('manual');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame1 === 'manual'
                      ? 'bg-[#00E6B8] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame1('agent');
                    handleSetReflexTemp(reflexTemp, reflexThreshold);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame1 === 'agent'
                      ? 'bg-[#00E6B8] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Agent
                </button>
              </div>
            </div>

            {/* Cozy Room Stage */}
            <div className="relative rounded-xl border border-[#1A2C4E] bg-gradient-to-b from-[#2B1B25] to-[#140F22] p-2.5 overflow-hidden min-h-[165px] flex flex-col justify-between">
              {/* Wallpaper & Window Illustration */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-2 left-3 w-12 h-12 rounded border border-blue-300/40 bg-blue-900/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 blur-xs" />
                </div>
                <div className="absolute top-3 right-4 w-7 h-9 border border-amber-300/30" />
                <div className="absolute bottom-2 left-6 w-5 h-7 bg-amber-800/40 rounded-t" />
              </div>

              {/* Temperature Badge & Live Actuator State */}
              <div className="relative z-10 flex justify-between items-center">
                <div className="rounded-full bg-black/80 border border-amber-500/50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-amber-300 shadow-md">
                  {reflexTemp}°C
                </div>
                <div className="flex items-center gap-1">
                  {reflexFanOn ? (
                    <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-500/60 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                      FAN RUNNING
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400 bg-black/70 border border-slate-700 px-2 py-0.5 rounded-full">
                      FAN STOPPED
                    </span>
                  )}
                </div>
              </div>

              {/* Fan in room with visible rotation & wind breeze */}
              <div className="relative z-10 flex items-end justify-end pr-2 pt-2">
                <div className="relative flex flex-col items-center">
                  {/* Animated wind breeze lines blowing across room when fan is running */}
                  {reflexFanOn && (
                    <div className="absolute -left-16 top-2 flex flex-col gap-1.5 pointer-events-none z-10">
                      <div className="h-0.5 w-14 bg-gradient-to-l from-cyan-400 to-transparent rounded-full wind-stream" />
                      <div className="h-0.5 w-20 bg-gradient-to-l from-cyan-300 to-transparent rounded-full wind-stream" />
                      <div className="h-0.5 w-12 bg-gradient-to-l from-cyan-400 to-transparent rounded-full wind-stream" />
                    </div>
                  )}

                  {/* Fan cage */}
                  <div
                    className={`flex h-15 w-15 items-center justify-center rounded-full border transition-all ${
                      reflexFanOn
                        ? 'border-cyan-400 bg-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.5)] ring-2 ring-cyan-400/50'
                        : 'border-slate-600 bg-slate-900/90 shadow-md'
                    }`}
                  >
                    <Fan
                      style={{
                        animation: reflexFanOn ? 'fanFastSpin 0.35s linear infinite' : 'none',
                        transformOrigin: 'center center',
                      }}
                      className={`h-10 w-10 transition-colors ${
                        reflexFanOn
                          ? 'text-cyan-300 fan-running-spin drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="w-1.5 h-4 bg-slate-700" />
                  <div className="w-8 h-1.5 bg-slate-800 rounded-full" />

                  {/* Stand status label */}
                  <div className="mt-1">
                    <span className="text-[8px] font-mono text-slate-400">
                      Rule: &gt; {reflexThreshold}°C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MANUAL INPUT OPTION: Temperature Slider, Stepper & Presets */}
            <div className="mt-2.5 bg-[#071024] p-2 rounded-lg border border-[#142646] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span>Set Room Temp:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetReflexTemp(Math.max(15, reflexTemp - 1));
                    }}
                    title="Lower temperature by 1°C"
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="15"
                    max="45"
                    value={reflexTemp}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleSetReflexTemp(val);
                    }}
                    className="w-12 bg-black border border-slate-700 rounded px-1 py-0.5 text-center text-cyan-300 font-bold text-[10px]"
                  />
                  <span>°C</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetReflexTemp(Math.min(45, reflexTemp + 1));
                    }}
                    title="Raise temperature by 1°C"
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Range slider - automatically runs/stops fan according to logic */}
              <input
                type="range"
                min="15"
                max="45"
                value={reflexTemp}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleSetReflexTemp(val);
                }}
                className="w-full accent-[#00E6B8] cursor-pointer h-1.5 bg-slate-800 rounded"
              />

              {/* Quick Temperature Presets */}
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[
                  { label: '22°C (Cool)', val: 22 },
                  { label: '28°C (Mild)', val: 28 },
                  { label: '34°C (Warm)', val: 34 },
                  { label: '40°C (Hot)', val: 40 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetReflexTemp(preset.val);
                    }}
                    className={`py-0.5 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                      reflexTemp === preset.val
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION CONTROLS */}
            {modeGame1 === 'manual' ? (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualReflexFan(true);
                  }}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    reflexFanOn
                      ? 'bg-[#00E6B8] text-slate-950 shadow-md shadow-[#00E6B8]/30'
                      : 'bg-[#059669] hover:bg-[#10B981] text-white'
                  }`}
                >
                  Turn Fan ON (Run)
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualReflexFan(false);
                  }}
                  className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                    !reflexFanOn
                      ? 'border-slate-500 bg-slate-800 text-white'
                      : 'border-slate-700 bg-[#0E172E] text-slate-400 hover:text-white'
                  }`}
                >
                  Keep OFF (Stop)
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetReflexTemp(reflexTemp);
                  }}
                  className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-[#00E6B8] hover:bg-teal-400 text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-[#00E6B8]/20"
                >
                  <Zap className="h-3 w-3" />
                  <span>Agent Evaluate Rule</span>
                </button>
              </div>
            )}

            {/* Live Feedback */}
            {reflexFeedback && (
              <div className="mt-2 p-1.5 rounded bg-black/60 border border-teal-500/30 text-[10px] text-teal-300 font-mono leading-tight">
                {reflexFeedback}
              </div>
            )}

            {/* Quick in-game action bar */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <button
                onClick={resetReflexGame}
                title="Reset this game"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-cyan-400" />
                <span>Reset</span>
              </button>
              <button
                onClick={playAgainReflex}
                title="Generate new temperature percept"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Footer Rule Explanation */}
          <div className="mt-2.5 p-1.5 rounded-lg bg-[#071024] border border-[#142646] text-[10px] text-[#B9C5DF] text-center leading-tight">
            Condition-Action Rule: Temp &gt; {reflexThreshold}°C → Fan ON, else OFF.
          </div>
        </div>

        {/* ========================================================= */}
        {/* GAME 2: Model-Based Agent (Electric Blue) */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectAgent('model-based')}
          className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer relative ${
            activeAgentId === 'model-based'
              ? 'border-[#168BFF] bg-[#091326] shadow-[0_0_20px_rgba(22,139,255,0.25)] ring-1 ring-[#168BFF]'
              : 'border-[#15233E] bg-[#0B1428] hover:border-[#168BFF]/60'
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#162747]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent('model-based');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={resetMazeGame}
                  title="Reset Game"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0A162D] hover:bg-[#132446] border border-[#1A2D52] text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-blue-400" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#168BFF]">Model-Based</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A1D36] text-[#38BDF8] border border-[#16365C]">
                Lvl: {mazeLevel}
              </span>
            </div>

            {/* Mode Toggle: Manual Input vs AI Agent */}
            <div className="flex items-center justify-between bg-[#070D1E] p-1 rounded-lg border border-[#142646] mb-2.5">
              <span className="text-[10px] font-mono text-slate-400 pl-1">Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame2('manual');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame2 === 'manual'
                      ? 'bg-[#168BFF] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame2('agent');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame2 === 'agent'
                      ? 'bg-[#168BFF] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Agent
                </button>
              </div>
            </div>

            {/* Maze Grid Stage with Clickable Tiles */}
            <div className="relative rounded-xl border border-[#1A2C4E] bg-[#070D1E] p-2 flex flex-col justify-center items-center min-h-[165px] overflow-hidden">
              <div className="text-[9px] font-mono text-slate-400 mb-1 flex justify-between w-full px-1">
                <span>Pos: ({mazePos[0]},{mazePos[1]})</span>
                <span className="text-blue-400 font-bold">Memory: {mazeVisited.size} tiles mapped</span>
              </div>

              <div className="grid grid-cols-5 gap-1 w-full max-w-[150px] aspect-square">
                {mazeGrid.map((row, r) =>
                  row.map((cell, c) => {
                    const isRobot = mazePos[0] === r && mazePos[1] === c;
                    const isVisited = mazeVisited.has(`${r},${c}`);
                    const isStar = r === 4 && c === 4;
                    const isWall = cell === 1;
                    const isAdjacent = Math.abs(r - mazePos[0]) + Math.abs(c - mazePos[1]) === 1;

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={(e) => handleMazeTileClick(r, c, e)}
                        title={isWall ? 'Wall obstacle' : `Tile (${r},${c})${isAdjacent ? ' - Click to Move' : ''}`}
                        className={`flex items-center justify-center rounded-sm transition-all text-xs ${
                          isWall
                            ? 'bg-[#192A4D] cursor-not-allowed'
                            : isRobot
                            ? 'bg-blue-600/50 border border-blue-400 shadow-sm shadow-blue-500/50'
                            : isStar
                            ? 'bg-amber-500/20 border border-amber-500/40 cursor-pointer'
                            : isVisited
                            ? 'bg-[#0E1E3C] border border-blue-900/50 cursor-pointer hover:border-blue-400'
                            : isAdjacent
                            ? 'bg-[#0C1A36] border border-cyan-500/40 cursor-pointer hover:border-cyan-300'
                            : 'bg-[#0A142A] border border-transparent'
                        }`}
                      >
                        {isRobot ? (
                          <Bot className="h-4 w-4 text-cyan-300 animate-pulse" />
                        ) : isStar ? (
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-bounce" />
                        ) : isVisited && !isWall ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400/60 shadow-xs shadow-blue-400" />
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Play Again Overlay */}
              {mazeFinished && (
                <div className="absolute inset-0 bg-[#070D1E]/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-2.5 text-center space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Trophy className="h-4 w-4" />
                    <span>Maze Solved!</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Internal memory model mapped {mazeVisited.size} cells avoiding loops.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={playAgainMaze}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#168BFF] hover:bg-blue-400 text-white font-bold text-[11px] shadow-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Play Again</span>
                    </button>
                    <button
                      onClick={resetMazeGame}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition-all cursor-pointer"
                    >
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Directional / Agent Controls */}
            {modeGame2 === 'manual' ? (
              <div>
                <div className="flex justify-center items-center gap-1.5 mt-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMazeRobot(0, -1);
                    }}
                    disabled={mazeFinished}
                    title="Move Left (or press ← / A)"
                    className="p-1.5 rounded-lg bg-[#168BFF] hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMazeRobot(1, 0);
                    }}
                    disabled={mazeFinished}
                    title="Move Down (or press ↓ / S)"
                    className="p-1.5 rounded-lg bg-[#168BFF] hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMazeRobot(-1, 0);
                    }}
                    disabled={mazeFinished}
                    title="Move Up (or press ↑ / W)"
                    className="p-1.5 rounded-lg bg-[#168BFF] hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMazeRobot(0, 1);
                    }}
                    disabled={mazeFinished}
                    title="Move Right (or press → / D)"
                    className="p-1.5 rounded-lg bg-[#168BFF] hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[9px] text-center text-slate-400 mt-1 font-mono">
                  Tip: Click adjacent cells or use Arrow keys!
                </div>
              </div>
            ) : (
              <div className="mt-2.5 space-y-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepModelBasedAgent();
                  }}
                  disabled={mazeFinished}
                  className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-[#168BFF] hover:bg-blue-500 text-white transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  <Brain className="h-3 w-3" />
                  <span>AI Model Step (Use Memory)</span>
                </button>
              </div>
            )}

            {/* Live Feedback */}
            {mazeFeedback && (
              <div className="mt-1.5 p-1.5 rounded bg-black/60 border border-blue-500/30 text-[10px] text-blue-300 font-mono leading-tight">
                {mazeFeedback}
              </div>
            )}

            {/* Quick in-game action bar */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <button
                onClick={resetMazeGame}
                title="Reset maze to starting point"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-blue-400" />
                <span>Reset Maze</span>
              </button>
              <button
                onClick={playAgainMaze}
                title="Play next maze level"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Footer Rule Explanation */}
          <div className="mt-2.5 p-1.5 rounded-lg bg-[#071024] border border-[#142646] text-[10px] text-[#B9C5DF] text-center leading-tight">
            Maintains internal memory of visited cells to navigate around obstacles.
          </div>
        </div>

        {/* ========================================================= */}
        {/* GAME 3: Goal-Based Agent (Amber) */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectAgent('goal-based')}
          className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer relative ${
            activeAgentId === 'goal-based'
              ? 'border-[#FFB020] bg-[#091326] shadow-[0_0_20px_rgba(255,176,32,0.25)] ring-1 ring-[#FFB020]'
              : 'border-[#15233E] bg-[#0B1428] hover:border-[#FFB020]/60'
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#162747]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent('goal-based');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={resetGoalGame}
                  title="Reset Game"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0A162D] hover:bg-[#132446] border border-[#1A2D52] text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-amber-400" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#FFB020]">Goal-Based</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A1D36] text-[#FFB020] border border-[#16365C]">
                h(n): {goalHeuristic}
              </span>
            </div>

            {/* Mode Toggle: Manual Input vs AI Agent */}
            <div className="flex items-center justify-between bg-[#070D1E] p-1 rounded-lg border border-[#142646] mb-2.5">
              <span className="text-[10px] font-mono text-slate-400 pl-1">Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame3('manual');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame3 === 'manual'
                      ? 'bg-[#FFB020] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame3('agent');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame3 === 'agent'
                      ? 'bg-[#FFB020] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Agent
                </button>
              </div>
            </div>

            {/* Tile-Based Terrain Grid with Clickable Cells */}
            <div className="relative rounded-xl border border-[#1A2C4E] bg-[#437C42] p-1.5 flex flex-col justify-center items-center min-h-[165px] overflow-hidden">
              <div className="text-[9px] font-mono text-slate-900 bg-[#A6D380] px-1.5 py-0.5 rounded-sm mb-1 flex justify-between w-full">
                <span>Goal: ({goalTarget[0]},{goalTarget[1]})</span>
                <span className="font-bold">Manhattan: {goalHeuristic}</span>
              </div>

              <div className="grid grid-cols-5 gap-0.5 w-full max-w-[150px] aspect-square bg-[#70A55D] rounded-lg p-1">
                {Array.from({ length: 5 }).map((_, r) =>
                  Array.from({ length: 5 }).map((_, c) => {
                    const isRobot = goalRobotPos[0] === r && goalRobotPos[1] === c;
                    const isTarget = goalTarget[0] === r && goalTarget[1] === c;
                    const isWater = c === 3 && r >= 1 && r <= 3;
                    const isTree = (r === 1 && c === 1) || (r === 0 && c === 2) || (r === 3 && c === 2);
                    const isMountain = r === 4 && c === 2;
                    const isObstacle = isWater || isMountain;

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={(e) => handleGoalTileClick(r, c, e)}
                        title={
                          goalSettingMode
                            ? `Click to place destination flag at (${r},${c})`
                            : isObstacle
                            ? 'Obstacle'
                            : `Tile (${r},${c}) - Click to Move`
                        }
                        className={`flex items-center justify-center rounded-xs text-[10px] transition-colors cursor-pointer ${
                          isWater
                            ? 'bg-[#38BDF8]'
                            : isMountain
                            ? 'bg-[#94A3B8]'
                            : goalSettingMode
                            ? 'bg-[#B4E185] hover:ring-1 hover:ring-amber-500'
                            : 'bg-[#99C76E] hover:bg-[#AEE27B]'
                        }`}
                      >
                        {isRobot ? (
                          <Bot className="h-4 w-4 text-slate-900" />
                        ) : isTarget ? (
                          <Flag className="h-3.5 w-3.5 text-rose-600 fill-rose-600 animate-bounce" />
                        ) : isTree ? (
                          <span className="text-[9px]">🌲</span>
                        ) : isWater ? (
                          <span className="text-[8px] opacity-40">~</span>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Play Again Overlay */}
              {goalFinished && (
                <div className="absolute inset-0 bg-[#091326]/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-2.5 text-center space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Flag className="h-4 w-4" />
                    <span>Destination Reached!</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Goal-based planner successfully executed search sequence!
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={playAgainGoal}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Play Again</span>
                    </button>
                    <button
                      onClick={resetGoalGame}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition-all cursor-pointer"
                    >
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MANUAL GOAL SETTING TOGGLE */}
            <div className="flex items-center justify-between mt-2 px-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGoalSettingMode((prev) => !prev);
                }}
                className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  goalSettingMode
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Crosshair className="h-2.5 w-2.5" />
                <span>{goalSettingMode ? 'Click tile to place Flag' : 'Set Custom Goal'}</span>
              </button>
              <span className="text-[9px] font-mono text-slate-400">
                h(n) = |Δr| + |Δc|
              </span>
            </div>

            {/* Directional Controls or Agent AI Plan */}
            {modeGame3 === 'manual' ? (
              <div>
                <div className="flex justify-center items-center gap-1.5 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveGoalRobot(0, -1);
                    }}
                    disabled={goalFinished}
                    title="Move Left (or press ← / A)"
                    className="p-1.5 rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveGoalRobot(-1, 0);
                    }}
                    disabled={goalFinished}
                    title="Move Up (or press ↑ / W)"
                    className="p-1.5 rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveGoalRobot(1, 0);
                    }}
                    disabled={goalFinished}
                    title="Move Down (or press ↓ / S)"
                    className="p-1.5 rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveGoalRobot(0, 1);
                    }}
                    disabled={goalFinished}
                    title="Move Right (or press → / D)"
                    className="p-1.5 rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[9px] text-center text-slate-400 mt-1 font-mono">
                  Tip: Click adjacent cells or use Arrow keys!
                </div>
              </div>
            ) : (
              <div className="mt-2 space-y-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepGoalAgent();
                  }}
                  disabled={goalFinished}
                  className="w-full py-1.5 text-[11px] font-bold rounded-lg bg-[#FFB020] hover:bg-amber-400 text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>AI Plan &amp; Step (BFS/A*)</span>
                </button>
              </div>
            )}

            {/* Live Feedback */}
            {goalFeedback && (
              <div className="mt-1.5 p-1.5 rounded bg-black/60 border border-amber-500/30 text-[10px] text-amber-300 font-mono leading-tight">
                {goalFeedback}
              </div>
            )}

            {/* Quick in-game action bar */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <button
                onClick={resetGoalGame}
                title="Reset robot to start position"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-amber-400" />
                <span>Reset Grid</span>
              </button>
              <button
                onClick={playAgainGoal}
                title="Play next delivery mission"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Footer Rule Explanation */}
          <div className="mt-2.5 p-1.5 rounded-lg bg-[#071024] border border-[#142646] text-[10px] text-[#B9C5DF] text-center leading-tight">
            Formulates goals and executes search heuristics to find optimal routes.
          </div>
        </div>

        {/* ========================================================= */}
        {/* GAME 4: Utility-Based Agent (Violet) */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectAgent('utility-based')}
          className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer relative ${
            activeAgentId === 'utility-based'
              ? 'border-[#8B5CF6] bg-[#091326] shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-[#8B5CF6]'
              : 'border-[#15233E] bg-[#0B1428] hover:border-[#8B5CF6]/60'
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#162747]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent('utility-based');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={resetUtilityGame}
                  title="Reset Game"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0A162D] hover:bg-[#132446] border border-[#1A2D52] text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-violet-400" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#8B5CF6]">Utility-Based</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A1D36] text-[#A78BFA] border border-[#16365C]">
                Score: {utilityScore}
              </span>
            </div>

            {/* Mode Toggle: Manual Input vs AI Agent */}
            <div className="flex items-center justify-between bg-[#070D1E] p-1 rounded-lg border border-[#142646] mb-2">
              <span className="text-[10px] font-mono text-slate-400 pl-1">Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame4('manual');
                    setUtilityFeedback(
                      `Manual Input mode: Select any food card (Salad, Burger, or Pizza) to evaluate it against the highest-utility option.`
                    );
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame4 === 'manual'
                      ? 'bg-[#8B5CF6] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    executeUtilityAgent();
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame4 === 'agent'
                      ? 'bg-[#8B5CF6] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Agent
                </button>
              </div>
            </div>

            {/* Preference Weights Sliders (Wh, Wt, Wc) */}
            <div className="mb-2 bg-[#071024] p-1.5 rounded-lg border border-[#142646] space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#142646] pb-1">
                <span className="text-[10px] font-mono text-violet-300 font-bold flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-violet-400" />
                  <span>Preference Weights (W):</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  Max: <strong className="text-white underline">{foodItems[getOptimalUtilityFood()].name}</strong>{' '}
                  <span className="text-slate-400">(U={computeUtility(getOptimalUtilityFood())})</span>
                </span>
              </div>

              <div className="space-y-1 pt-0.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Health Weight (W_health): <strong className="text-emerald-400">{utilityWeights.health}</strong></span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={utilityWeights.health}
                    onChange={(e) => handleWeightChange('health', Number(e.target.value))}
                    className="w-20 accent-emerald-400 cursor-pointer h-1"
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>Taste Weight (W_taste): <strong className="text-amber-400">{utilityWeights.taste}</strong></span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={utilityWeights.taste}
                    onChange={(e) => handleWeightChange('taste', Number(e.target.value))}
                    className="w-20 accent-amber-400 cursor-pointer h-1"
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Cost Weight (W_cost): <strong className="text-rose-400">{utilityWeights.cost}</strong></span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={utilityWeights.cost}
                    onChange={(e) => handleWeightChange('cost', Number(e.target.value))}
                    className="w-20 accent-rose-400 cursor-pointer h-1"
                  />
                </div>
              </div>
            </div>

            {/* Food Cards Stage with Explicit Health, Taste, Cost, and Utility Scores */}
            <div className="relative rounded-xl border border-[#1A2C4E] bg-gradient-to-b from-[#2B173E] to-[#120B20] p-2 flex flex-col justify-center min-h-[160px] space-y-1.5 overflow-hidden">
              <div className="grid grid-cols-3 gap-1">
                {(['salad', 'burger', 'pizza'] as const).map((key) => {
                  const item = foodItems[key];
                  const uVal = computeUtility(key);
                  const isSelected = selectedFood === key;
                  const isOptimal = getOptimalUtilityFood() === key;

                  return (
                    <div
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (modeGame4 === 'agent') {
                          setSelectedFood(key);
                          const opt = getOptimalUtilityFood();
                          if (key === opt) {
                            setUtilityFeedback(`AI Agent: ${item.name} is the highest-utility option with U = ${uVal} (argmax U(x))!`);
                          } else {
                            setUtilityFeedback(`AI Agent prefers ${foodItems[opt].name} (U = ${computeUtility(opt)}), while ${item.name} has U = ${uVal}.`);
                          }
                        } else {
                          handleSelectUtilityFood(key);
                        }
                      }}
                      className={`flex flex-col items-center p-1 rounded-lg border text-center transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-violet-400 bg-violet-600/30 ring-1 ring-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                          : isOptimal
                          ? 'border-emerald-500/50 bg-slate-900/60 hover:border-emerald-400'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      {/* Optimal indicator badge */}
                      {isOptimal && (
                        <span className="absolute -top-1.5 -right-1 text-[7px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 rounded shadow-xs">
                          ★ MAX
                        </span>
                      )}

                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[10px] font-bold text-white">{item.name}</span>

                      {/* Explicit Scores: Health (H), Taste (T), Cost (C) */}
                      <div className="flex items-center justify-center gap-0.5 w-full font-mono text-[8px] font-bold mt-1">
                        <span
                          className="flex-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center"
                          title={`Health (H) Score = ${item.health}`}
                        >
                          H:{item.health}
                        </span>
                        <span
                          className="flex-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-center"
                          title={`Taste (T) Score = ${item.taste}`}
                        >
                          T:{item.taste}
                        </span>
                        <span
                          className="flex-1 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-center"
                          title={`Cost (C) Penalty Score = ${item.cost}`}
                        >
                          C:{item.cost}
                        </span>
                      </div>

                      {/* Live Calculated Utility */}
                      <div className="mt-1 w-full">
                        <span className={`block text-[10px] font-mono font-bold px-1 py-0.2 rounded text-center ${
                          isOptimal ? 'text-emerald-300 bg-emerald-950/90 border border-emerald-500/50' : 'text-cyan-300 bg-black/60 border border-slate-800'
                        }`}>
                          U = {uVal}
                        </span>
                      </div>

                      {/* Arithmetic substitution on card */}
                      <span className="text-[6.5px] font-mono text-slate-400 mt-0.5 leading-none">
                        {utilityWeights.health}×{item.health}+{utilityWeights.taste}×{item.taste}−{utilityWeights.cost}×{item.cost}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Arithmetic Calculation Breakdown Verification Box */}
              <div className="bg-[#070D1E] p-1.5 rounded-lg border border-[#162747] font-mono text-[8.5px] space-y-0.5">
                <div className="flex items-center justify-between text-violet-300 font-bold border-b border-[#142646] pb-0.5 text-[8px]">
                  <span>Arithmetic Breakdown: U(x) = W_health×H + W_taste×T − W_cost×C</span>
                  <span className="text-slate-400">Wh:{utilityWeights.health} Wt:{utilityWeights.taste} Wc:{utilityWeights.cost}</span>
                </div>
                {(['salad', 'burger', 'pizza'] as const).map((key) => {
                  const it = foodItems[key];
                  const hPart = utilityWeights.health * it.health;
                  const tPart = utilityWeights.taste * it.taste;
                  const cPart = utilityWeights.cost * it.cost;
                  const totalU = hPart + tPart - cPart;
                  const isOpt = key === getOptimalUtilityFood();
                  const isSel = key === selectedFood;
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-1 py-0.5 rounded transition-colors ${
                        isSel ? 'bg-violet-950/80 border border-violet-500/50 text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span className="font-sans flex items-center gap-0.5">
                        <span>{it.icon}</span>
                        <span>{it.name}:</span>
                        {isSel && <span className="text-[7px] bg-violet-600/70 text-violet-100 px-0.5 rounded font-mono">Selected</span>}
                      </span>
                      <span className="text-slate-400 text-[7.5px]">
                        ({utilityWeights.health}×{it.health}) + ({utilityWeights.taste}×{it.taste}) − ({utilityWeights.cost}×{it.cost}) = {hPart}+{tPart}−{cPart}
                      </span>
                      <span className={`font-bold ml-1 ${isOpt ? 'text-emerald-400' : 'text-cyan-300'}`}>
                        = {totalU} {isOpt && <span className="text-[7px] bg-emerald-500/20 text-emerald-300 px-0.5 rounded border border-emerald-500/40">MAX ★</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Controls */}
              {modeGame4 === 'manual' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectUtilityFood();
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer"
                >
                  Evaluate Selected ({foodItems[selectedFood].name}) vs Highest Utility
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    executeUtilityAgent();
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Scale className="h-3 w-3" />
                  <span>AI Agent: Auto-Selected {foodItems[getOptimalUtilityFood()].name} (argmax U)</span>
                </button>
              )}

              {/* Evaluated / Play Again Inline Banner (Non-blocking: food cards and breakdown stay fully visible) */}
              {utilityFinished && (
                <div className="p-1 rounded-lg bg-violet-950/80 border border-violet-500/40 flex items-center justify-between gap-1 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1 text-[9.5px] text-violet-200">
                    <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                    <span>
                      {selectedFood === getOptimalUtilityFood()
                        ? `Optimal! ${foodItems[selectedFood].name} achieved max U = ${computeUtility(selectedFood)}.`
                        : `Evaluated ${foodItems[selectedFood].name} (U = ${computeUtility(selectedFood)}).`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={playAgainUtility}
                      className="px-2 py-0.5 rounded bg-[#8B5CF6] hover:bg-violet-400 text-white font-bold text-[9px] cursor-pointer"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={resetUtilityGame}
                      className="px-1.5 py-0.5 rounded border border-slate-600 hover:bg-slate-800 text-slate-300 text-[9px] cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Feedback */}
            {utilityFeedback && (
              <div className="mt-1.5 p-1.5 rounded bg-black/60 border border-violet-500/30 text-[10px] text-violet-300 font-mono leading-tight">
                {utilityFeedback}
              </div>
            )}

            {/* Quick in-game action bar */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <button
                onClick={resetUtilityGame}
                title="Reset food selection"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-violet-400" />
                <span>Reset Choice</span>
              </button>
              <button
                onClick={playAgainUtility}
                title="Evaluate next preference trade-off"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Footer Rule Explanation */}
          <div className="mt-2.5 p-1.5 rounded-lg bg-[#071024] border border-[#142646] text-[10px] text-[#B9C5DF] text-center leading-tight">
            U(x) = W_health·Health + W_taste·Taste - W_cost·Cost (argmax utility).
          </div>
        </div>

        {/* ========================================================= */}
        {/* GAME 5: Learning Agent (Magenta) */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectAgent('learning')}
          className={`flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer relative ${
            activeAgentId === 'learning'
              ? 'border-[#F044A7] bg-[#091326] shadow-[0_0_20px_rgba(240,68,167,0.25)] ring-1 ring-[#F044A7]'
              : 'border-[#15233E] bg-[#0B1428] hover:border-[#F044A7]/60'
          }`}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#162747]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent('learning');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
                <button
                  onClick={resetLearningGame}
                  title="Reset Game"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0A162D] hover:bg-[#132446] border border-[#1A2D52] text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-pink-400" />
                  <span>Reset</span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#F044A7]">Learning Agent</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A1D36] text-[#F472B6] border border-[#16365C]">
                Ep: {learnEpisode} | R: {learnScore}
              </span>
            </div>

            {/* Mode Toggle: Manual Input vs AI Agent */}
            <div className="flex items-center justify-between bg-[#070D1E] p-1 rounded-lg border border-[#142646] mb-2.5">
              <span className="text-[10px] font-mono text-slate-400 pl-1">Mode:</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame5('manual');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame5 === 'manual'
                      ? 'bg-[#F044A7] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModeGame5('agent');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    modeGame5 === 'agent'
                      ? 'bg-[#F044A7] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Agent
                </button>
              </div>
            </div>

            {/* Grid Stage: Robot, Coins, Hazard Spikes, Star */}
            <div className="relative rounded-xl border border-[#1A2C4E] bg-[#070D1E] p-2 flex flex-col justify-center items-center min-h-[165px] overflow-hidden">
              <div className="text-[9px] font-mono text-slate-400 mb-1 flex justify-between w-full px-1">
                <span>Coins left: {learnCoins.size}</span>
                <span className="text-pink-400 font-bold">Reward: +{learnScore}</span>
              </div>

              <div className="grid grid-cols-5 gap-1 w-full max-w-[150px] aspect-[5/4]">
                {Array.from({ length: 4 }).map((_, r) =>
                  Array.from({ length: 5 }).map((_, c) => {
                    const isRobot = learnRobotPos[0] === r && learnRobotPos[1] === c;
                    const isStar = r === 0 && c === 4;
                    const isCoin = learnCoins.has(`${r},${c}`);
                    const isSpike = isLearnSpike(r, c);
                    const isAdjacent = Math.abs(r - learnRobotPos[0]) + Math.abs(c - learnRobotPos[1]) === 1;

                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={(e) => handleLearnTileClick(r, c, e)}
                        title={
                          isSpike
                            ? 'Hazard Spikes (-20 Penalty)'
                            : isCoin
                            ? 'Reward Coin (+15)'
                            : isStar
                            ? 'Goal Star (+50)'
                            : `Tile (${r},${c})${isAdjacent ? ' - Click to Move' : ''}`
                        }
                        className={`flex items-center justify-center rounded-sm text-[10px] border border-[#111F3D] cursor-pointer transition-colors ${
                          isSpike
                            ? 'bg-rose-950/40 hover:border-rose-500'
                            : isRobot
                            ? 'bg-pink-600/40 border-pink-400'
                            : isAdjacent
                            ? 'bg-[#0E1E3C] hover:border-pink-400'
                            : 'bg-[#0A142A]'
                        }`}
                      >
                        {isRobot ? (
                          <Bot className="h-4 w-4 text-cyan-300" />
                        ) : isStar ? (
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                        ) : isCoin ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 border border-amber-300 shadow-sm" />
                        ) : isSpike ? (
                          <span className="text-[8px] text-rose-500 font-bold">▲▲▲</span>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Play Again Overlay */}
              {learnFinished && (
                <div className="absolute inset-0 bg-[#070D1E]/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-2.5 text-center space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1 text-xs font-bold text-pink-400">
                    <Trophy className="h-4 w-4" />
                    <span>Rewards Gathered!</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Agent learned policy trail avoiding hazard spikes!
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={playAgainLearning}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F044A7] hover:bg-pink-400 text-white font-bold text-[11px] shadow-md transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Play Again</span>
                    </button>
                    <button
                      onClick={resetLearningGame}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[11px] transition-all cursor-pointer"
                    >
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Controls */}
            {modeGame5 === 'manual' ? (
              <div>
                <div className="flex justify-center items-center gap-1.5 mt-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLearnRobot(0, -1);
                    }}
                    disabled={learnFinished}
                    title="Move Left (or press ← / A)"
                    className="p-1.5 rounded-lg bg-[#F044A7] hover:bg-pink-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLearnRobot(-1, 0);
                    }}
                    disabled={learnFinished}
                    title="Move Up (or press ↑ / W)"
                    className="p-1.5 rounded-lg bg-[#F044A7] hover:bg-pink-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLearnRobot(1, 0);
                    }}
                    disabled={learnFinished}
                    title="Move Down (or press ↓ / S)"
                    className="p-1.5 rounded-lg bg-[#F044A7] hover:bg-pink-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLearnRobot(0, 1);
                    }}
                    disabled={learnFinished}
                    title="Move Right (or press → / D)"
                    className="p-1.5 rounded-lg bg-[#F044A7] hover:bg-pink-500 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-[9px] text-center text-slate-400 mt-1 font-mono">
                  Tip: Click adjacent cells or use Arrow keys!
                </div>
              </div>
            ) : (
              <div className="mt-2.5 space-y-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLearningAgent();
                  }}
                  disabled={learnFinished}
                  className="w-full py-1.5 px-1 text-[11px] font-bold rounded-lg bg-[#F044A7] hover:bg-pink-500 text-white shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  <span>AI Q-Learn Step (Policy)</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    autoTrainEpisode();
                  }}
                  className="w-full py-1 px-1 text-[10px] font-mono rounded-lg bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-pink-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles className="h-2.5 w-2.5 text-pink-400" />
                  <span>Auto-Train Episode</span>
                </button>
              </div>
            )}

            {/* Live Feedback */}
            {learnFeedback && (
              <div className="mt-1.5 p-1.5 rounded bg-black/60 border border-pink-500/30 text-[10px] text-pink-300 font-mono leading-tight">
                {learnFeedback}
              </div>
            )}

            {/* Quick in-game action bar */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              <button
                onClick={resetLearningGame}
                title="Reset reinforcement learning episodes and coins"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-2.5 w-2.5 text-pink-400" />
                <span>Reset Q-Table</span>
              </button>
              <button
                onClick={playAgainLearning}
                title="Respawn reward coins and start fresh episode"
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[#0A142A] hover:bg-[#122244] border border-[#162747] text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Footer Rule Explanation */}
          <div className="mt-2.5 p-1.5 rounded-lg bg-[#071024] border border-[#142646] text-[10px] text-[#B9C5DF] text-center leading-tight">
            Updates Q(s,a) using reward feedback (+15 coins, -20 spikes).
          </div>
        </div>
      </div>
    </div>
  );
};
