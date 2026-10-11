import React, { useState, useEffect } from 'react';
import { 
  Fan, 
  Check, 
  AlertCircle, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { AgentData } from '../../types/agent';
import { GameHeader } from './GameHeader';
import { GameFeedbackModal } from './GameFeedbackModal';

interface ReflexGameProps {
  agent: AgentData;
  onGameComplete: (success: boolean) => void;
  onOpenLab: () => void;
  onExit: () => void;
}

export const ReflexGame: React.FC<ReflexGameProps> = ({
  agent,
  onGameComplete,
  onOpenLab,
  onExit,
}) => {
  const roundsData = [
    { targetTemp: 34, expectedAction: 'ON', note: 'Sweltering heatwave! 34°C > 30°C' },
    { targetTemp: 24, expectedAction: 'OFF', note: 'Pleasant evening! 24°C ≤ 30°C' },
    { targetTemp: 38, expectedAction: 'ON', note: 'Blistering afternoon! 38°C > 30°C' },
    { targetTemp: 28, expectedAction: 'OFF', note: 'Mild room climate! 28°C ≤ 30°C' },
    { targetTemp: 31, expectedAction: 'ON', note: 'Just crossed threshold! 31°C > 30°C' },
  ];

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(roundsData[0].targetTemp);
  const [fanState, setFanState] = useState<'ON' | 'OFF'>('OFF');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | 'idle';
    message: string;
  }>({ type: 'idle', message: 'Observe the room temperature. Apply the reflex rule!' });
  const [decisionLog, setDecisionLog] = useState<string[]>([]);
  const [autoReflex, setAutoReflex] = useState(false);
  const [gameOverModal, setGameOverModal] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    reason: string;
  }>({ isOpen: false, isSuccess: false, reason: '' });

  const currentRound = roundsData[currentRoundIdx];

  // Auto-reflex agent execution
  useEffect(() => {
    if (autoReflex && feedback.type === 'idle' && !gameOverModal.isOpen) {
      const timer = setTimeout(() => {
        const reflexDecision = currentTemp > 30 ? 'ON' : 'OFF';
        handleDecision(reflexDecision);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoReflex, currentRoundIdx, feedback.type, gameOverModal.isOpen, currentTemp]);

  const handleDecision = (action: 'ON' | 'OFF') => {
    const isCorrect = action === currentRound.expectedAction;
    setFanState(action);

    const logEntry = `Round ${currentRoundIdx + 1}: ${currentTemp}°C → Fan ${action} (${
      isCorrect ? 'Correct ✓' : 'Incorrect ✗'
    })`;
    setDecisionLog((prev) => [...prev, logEntry]);

    if (isCorrect) {
      const newScore = score + 20;
      setScore(newScore);
      setFeedback({
        type: 'correct',
        message: `Condition Satisfied: ${currentTemp}°C ${
          currentTemp > 30 ? '> 30°C → Turn Fan ON.' : '≤ 30°C → Keep Fan OFF.'
        }`,
      });

      setTimeout(() => {
        if (currentRoundIdx + 1 < roundsData.length) {
          setCurrentRoundIdx((prev) => prev + 1);
          setCurrentTemp(roundsData[currentRoundIdx + 1].targetTemp);
          setFanState('OFF');
          setFeedback({
            type: 'idle',
            message: 'New round started. Check the thermometer percept.',
          });
        } else {
          setGameOverModal({
            isOpen: true,
            isSuccess: true,
            reason: `You executed the Simple Reflex Condition-Action rule across all 5 rounds with a score of ${newScore}/100.`,
          });
          onGameComplete(true);
        }
      }, 1200);
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Rule Violation: At ${currentTemp}°C, rule states: ${
          currentTemp > 30 ? 'IF temp > 30 THEN Fan ON' : 'ELSE Fan OFF'
        }.`,
      });

      setTimeout(() => {
        setGameOverModal({
          isOpen: true,
          isSuccess: false,
          reason: `At ${currentTemp}°C, the correct reflex rule action was "Turn Fan ${currentRound.expectedAction}". Reflex agents have no memory—they map current percept directly to action.`,
        });
      }, 1400);
    }
  };

  const restartGame = () => {
    setCurrentRoundIdx(0);
    setCurrentTemp(roundsData[0].targetTemp);
    setFanState('OFF');
    setScore(0);
    setDecisionLog([]);
    setFeedback({ type: 'idle', message: 'Observe the room temperature. Apply the reflex rule!' });
    setGameOverModal({ isOpen: false, isSuccess: false, reason: '' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <GameHeader
        agent={agent}
        score={score}
        totalRounds={5}
        currentRound={currentRoundIdx + 1}
        onExit={onExit}
        onRestart={restartGame}
        onOpenLab={onOpenLab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Room Environment */}
        <div className="lg:col-span-7 border-2 border-[#111111] bg-white p-8 flex flex-col justify-between min-h-[460px] shadow-[6px_6px_0px_#111111]">
          <div className="flex items-center justify-between border-b border-[#111111]/15 pb-4">
            <div>
              <span className="label">Environmental State</span>
              <div className="font-serif text-2xl font-bold text-[#111111]">
                {currentTemp > 30 ? 'Thermal Excess (Overheating)' : 'Nominal Comfort Range'}
              </div>
            </div>

            <button
              onClick={() => setAutoReflex(!autoReflex)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider cursor-pointer border ${
                autoReflex
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-transparent text-[#111111] border-[#111111]/20 hover:border-[#111111]'
              }`}
            >
              <Zap className="h-3 w-3 text-[#FF4D00]" />
              <span>Auto-Pilot: {autoReflex ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Center Stage: Thermometer & Fan */}
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center">
            {/* Fan */}
            <div className="flex flex-col items-center">
              <div className="relative flex h-40 w-40 items-center justify-center border-2 border-[#111111] bg-[#F8F7F4]">
                <Fan
                  style={{
                    animation: fanState === 'ON' ? 'fanFastSpin 0.35s linear infinite' : 'none',
                    transformOrigin: 'center center',
                  }}
                  className={`h-28 w-28 text-[#111111] transition-all ${
                    fanState === 'ON' ? 'fan-running-spin text-[#FF4D00]' : 'opacity-30'
                  }`}
                />
                <div className="absolute h-8 w-8 bg-[#111111] rounded-full flex items-center justify-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${fanState === 'ON' ? 'bg-[#FF4D00]' : 'bg-[#F8F7F4]'}`} />
                </div>
              </div>
              <div className="mt-3 font-mono text-xs uppercase tracking-wider text-center">
                <span className="text-[#111111]/50 block">Actuator State:</span>
                <span className={`font-bold ${fanState === 'ON' ? 'text-[#FF4D00]' : 'text-[#111111]'}`}>
                  Fan {fanState}
                </span>
              </div>
            </div>

            {/* Thermometer */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 border border-[#111111]/20 bg-[#F8F7F4] p-5">
                <div className="relative h-36 w-6 border-2 border-[#111111] bg-white flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full transition-all duration-300 ${
                      currentTemp > 30 ? 'bg-[#FF4D00]' : 'bg-[#111111]'
                    }`}
                    style={{ height: `${Math.min(100, (currentTemp / 45) * 100)}%` }}
                  />
                  <div className={`absolute -bottom-2 -left-1 h-8 w-8 rounded-full border-2 border-[#111111] ${
                    currentTemp > 30 ? 'bg-[#FF4D00]' : 'bg-[#111111]'
                  }`} />
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#111111]/50 tracking-wider">
                    Sensor Percept
                  </span>
                  <div className="font-serif text-5xl font-bold text-[#111111]">
                    {currentTemp}°C
                  </div>
                  <div className="font-mono text-[11px] text-[#111111]/60">
                    Threshold: <strong className="text-[#FF4D00]">&gt; 30°C</strong>
                  </div>
                </div>
              </div>
              <div className="mt-3 font-mono text-[11px] text-[#111111]/60 text-center">
                {currentRound.note}
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          <div
            className={`p-4 border font-mono text-xs flex items-center gap-2 ${
              feedback.type === 'correct'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                : feedback.type === 'incorrect'
                ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                : 'border-[#111111]/20 bg-[#F8F7F4] text-[#111111]'
            }`}
          >
            {feedback.type === 'correct' && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'incorrect' && <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        </div>

        {/* Right 5 Cols: Rule Deck & Buttons */}
        <div className="lg:col-span-5 space-y-6">
          {/* Condition-Action Rule */}
          <div className="border border-[#111111]/20 bg-white p-6 space-y-3">
            <span className="label">Agent Decision Rule</span>
            <div className="border border-[#111111]/15 bg-[#F8F7F4] p-4 font-mono text-xs space-y-1">
              <div>
                <strong className="text-[#FF4D00]">IF</strong> temperature &gt; 30°C:
              </div>
              <div className="pl-4 font-bold text-[#111111]">
                action = &quot;Turn Fan ON&quot;
              </div>
              <div>
                <strong className="text-[#FF4D00]">ELSE</strong>:
              </div>
              <div className="pl-4 text-[#111111]/70">
                action = &quot;Keep Fan OFF&quot;
              </div>
            </div>
            <p className="text-xs text-[#111111]/70 leading-relaxed">
              No memory state exists in this agent. Decisions are an instantaneous mapping from percept to actuator.
            </p>
          </div>

          {/* Buttons */}
          <div className="border-2 border-[#111111] bg-white p-6 space-y-3">
            <span className="label">Select Actuator Command</span>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleDecision('ON')}
                disabled={feedback.type !== 'idle' || autoReflex}
                className="w-full flex items-center justify-between p-4 bg-[#111111] text-[#F8F7F4] hover:bg-[#FF4D00] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                <span>Turn Fan ON</span>
                <span className="opacity-60 text-[10px]">temp &gt; 30°C</span>
              </button>

              <button
                onClick={() => handleDecision('OFF')}
                disabled={feedback.type !== 'idle' || autoReflex}
                className="w-full flex items-center justify-between p-4 border border-[#111111]/30 bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer disabled:opacity-40"
              >
                <span>Keep Fan OFF</span>
                <span className="opacity-60 text-[10px]">temp ≤ 30°C</span>
              </button>

              <div className="pt-2 border-t border-[#111111]/10 flex items-center gap-2">
                <button
                  onClick={restartGame}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border border-[#111111]/30 bg-[#F8F7F4] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Game</span>
                </button>
                <button
                  onClick={restartGame}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#FF4D00] text-white hover:bg-[#111111] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          </div>

          {/* Log */}
          <div className="border border-[#111111]/20 bg-white p-5 font-mono text-xs space-y-2">
            <span className="label">Percept / Action History</span>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {decisionLog.length === 0 ? (
                <div className="text-[#111111]/40 italic">Awaiting round interaction...</div>
              ) : (
                decisionLog.map((log, idx) => (
                  <div key={idx} className="text-[#111111]/80 border-b border-[#111111]/10 py-1">
                    {log}
                  </div>
                ))
              )}
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
        decisionsSummary={decisionLog}
        onRetry={restartGame}
        onExploreAlgorithm={onOpenLab}
      />
    </div>
  );
};
