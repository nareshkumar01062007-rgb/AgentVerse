import React, { useState, useRef } from 'react';
import { AgentId } from './types/agent';
import { HeroPanel } from './components/arena/HeroPanel';
import { AgentCardsPanel } from './components/arena/AgentCardsPanel';
import { GameRow } from './components/arena/GameRow';
import { AlgorithmLab } from './components/arena/AlgorithmLab';
import { WhatIsAnAgentSection } from './components/home/WhatIsAnAgentSection';

export default function App() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>('simple-reflex');
  const [completedAgents, setCompletedAgents] = useState<Set<AgentId>>(new Set());
  const hasAutoScrolledRef = useRef<Record<string, boolean>>({});

  const handleSelectAgent = (id: AgentId) => {
    setActiveAgentId(id);
    const gameSection = document.getElementById('game-row');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleGameActionComplete = (agentId: AgentId, success: boolean) => {
    if (success) {
      setCompletedAgents((prev) => new Set(prev).add(agentId));
      setActiveAgentId(agentId);

      // Auto-scroll once per agent completion to the learning section directly below that game
      if (!hasAutoScrolledRef.current[agentId]) {
        hasAutoScrolledRef.current[agentId] = true;
        setTimeout(() => {
          const el = document.getElementById('algorithm-lab') || document.getElementById('learning-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  };

  const scrollToGames = () => {
    setActiveAgentId('simple-reflex');
    const el = document.getElementById('game-row');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToWhatIsAgent = () => {
    const el = document.getElementById('what-is-an-agent');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNextGame = (nextAgentId: AgentId) => {
    setActiveAgentId(nextAgentId);
    setTimeout(() => {
      const el = document.getElementById('game-row');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReplayGames = () => {
    setActiveAgentId('simple-reflex');
    setTimeout(() => {
      const el = document.getElementById('game-row');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReturnHome = () => {
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050817] text-[#F4F7FF] relative overflow-x-hidden pb-16 font-sans">
      {/* Background Subtle Gradient Glows */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[400px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="fixed bottom-10 left-1/3 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Main Container matching 1536px desktop layout */}
      <div className="relative z-10 mx-auto max-w-[1560px] px-3 sm:px-5 lg:px-6 py-4 space-y-6">
        {/* ===================================================================== */}
        {/* ROW 1: REGION A (Hero Panel) + REGION B (Five Agent Cards) */}
        {/* ===================================================================== */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left: Hero Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <HeroPanel
              onExploreTypes={scrollToGames}
              onWhatIsAgent={scrollToWhatIsAgent}
            />
          </div>

          {/* Right: Five Agent Cards (5 Cols) */}
          <div className="lg:col-span-5">
            <AgentCardsPanel
              activeAgentId={activeAgentId}
              onSelectAgent={handleSelectAgent}
            />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* WHAT IS AN AI AGENT? (Comprehensive Beginner Learning Section) */}
        {/* ===================================================================== */}
        <section id="what-is-an-agent" className="scroll-mt-4">
          <WhatIsAnAgentSection onStartGames={scrollToGames} />
        </section>

        {/* ===================================================================== */}
        {/* ROW 2: REGION C (Five Interactive Game Panels in ONE Row) */}
        {/* ===================================================================== */}
        <section id="game-row" className="relative scroll-mt-4">
          <GameRow
            activeAgentId={activeAgentId}
            onSelectAgent={setActiveAgentId}
            onGameActionComplete={handleGameActionComplete}
          />
        </section>

        {/* Downward Pointer Arrow connecting Games to Learning Lab */}
        <div className="flex justify-center items-center py-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 bg-[#091326] border border-[#162B54] rounded-full px-4 py-1 shadow-lg shadow-cyan-500/10 animate-bounce">
            <span>↓</span>
            <span>Uncover the Algorithm &amp; Concept Below</span>
            <span>↓</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* ROW 3: REGION D (Game-Specific Learning Section & Algorithm Lab) */}
        {/* ===================================================================== */}
        <section id="algorithm-lab" className="scroll-mt-4">
          <AlgorithmLab
            activeAgentId={activeAgentId}
            onSelectAgent={setActiveAgentId}
            isGameCompleted={completedAgents.has(activeAgentId)}
            onNextGame={handleNextGame}
            onReplayGames={handleReplayGames}
            onReturnHome={handleReturnHome}
          />
        </section>
      </div>
    </div>
  );
}
