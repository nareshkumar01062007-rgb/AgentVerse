import React, { useState } from 'react';
import {
  Bot,
  Globe,
  Eye,
  Cpu,
  Zap,
  Award,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Fan,
  Layers,
  Compass,
  Scale,
  BrainCircuit,
  Coins,
  ShieldAlert,
  Target
} from 'lucide-react';

interface WhatIsAnAgentSectionProps {
  onStartGames: () => void;
}

export const WhatIsAnAgentSection: React.FC<WhatIsAnAgentSectionProps> = ({ onStartGames }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[#1A2C4E] bg-gradient-to-b from-[#091126] via-[#081024] to-[#060D1E] p-5 sm:p-8 shadow-2xl space-y-10 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#162747]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-[11px] font-mono font-bold text-violet-300">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>Beginner-Friendly AI Foundations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            What is an AI Agent?
          </h2>
          <p className="text-xs sm:text-sm text-[#B9C5DF]">
            A complete step-by-step introduction to autonomous artificial intelligence from scratch.
          </p>
        </div>

        <button
          onClick={onStartGames}
          className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-violet-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Start Learning Through Games</span>
          <span>→</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: What is an AI Agent? (Definition + Real-World Example) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/40">
            A
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            The Definition &amp; Core Concept
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Definition Card */}
          <div className="lg:col-span-7 rounded-xl border border-cyan-500/30 bg-[#0A162D] p-5 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Official Core Definition
              </span>
              <blockquote className="text-base sm:text-lg font-semibold text-white leading-snug border-l-4 border-cyan-400 pl-4 py-1 italic">
                &ldquo;An AI agent is a system that observes its environment, makes decisions, and takes actions to achieve a goal.&rdquo;
              </blockquote>
              <p className="text-xs text-[#B9C5DF] leading-relaxed pt-2">
                Unlike simple computer programs that only follow a rigid set of instructions from top to bottom, an AI agent <strong className="text-cyan-300">interacts continuously with its surroundings</strong>. It senses what is happening, figures out the smartest next move, and executes that move to reach its objective.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#162747] flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Autonomous</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Perception-Driven</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Goal-Oriented</span>
              </span>
            </div>
          </div>

          {/* Real-World Robot Example Visual */}
          <div className="lg:col-span-5 rounded-xl border border-[#1A2C4E] bg-[#070E20] p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Real-World Visual Example
              </span>
              <h4 className="text-sm font-bold text-white">
                Robot Explorer in a Grid World
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Imagine a mobile robot navigating a grid world. Its goal is to <strong className="text-amber-300">collect gold coins</strong> while <strong className="text-rose-400">avoiding dangerous obstacles</strong>.
              </p>
            </div>

            {/* Mini Grid Simulation Illustration */}
            <div className="my-3 p-3 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-around font-mono text-xs">
              <div className="flex flex-col items-center">
                <span className="text-2xl animate-bounce">🤖</span>
                <span className="text-[10px] text-cyan-300 font-bold mt-1">Robot (Agent)</span>
              </div>
              <span className="text-slate-500 font-bold">→</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl">🧱</span>
                <span className="text-[10px] text-rose-400 font-bold mt-1">Avoid Hazard</span>
              </div>
              <span className="text-slate-500 font-bold">→</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl animate-pulse">🪙</span>
                <span className="text-[10px] text-amber-300 font-bold mt-1">Collect Coin</span>
              </div>
              <span className="text-slate-500 font-bold">→</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl">🌟</span>
                <span className="text-[10px] text-emerald-300 font-bold mt-1">Goal Reached</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              The robot senses coordinates, plans an obstacle-free path, drives forward, and checks whether it gained rewards.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION B: Components of an AI Agent (Definitions + Visual Diagram) */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/40">
            B
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              The 6 Core Components of an AI Agent
            </h3>
            <p className="text-xs text-[#B9C5DF]">
              Every intelligent agent in artificial intelligence consists of these six building blocks.
            </p>
          </div>
        </div>

        {/* 6 Component Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Agent */}
          <div
            onMouseEnter={() => setHoveredComponent('agent')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'agent'
                ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">Component 1</span>
                <h4 className="text-sm font-bold text-white">Agent</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              The entity that makes decisions. It contains the brain, memory, and strategy.
            </p>
            <div className="text-[11px] font-mono text-cyan-300 bg-black/40 p-1.5 rounded border border-cyan-500/20">
              <strong>Example:</strong> A self-driving delivery robot or smart thermostat.
            </div>
          </div>

          {/* 2. Environment */}
          <div
            onMouseEnter={() => setHoveredComponent('env')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'env'
                ? 'border-blue-400 bg-blue-950/30 ring-1 ring-blue-400 shadow-lg shadow-blue-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold block">Component 2</span>
                <h4 className="text-sm font-bold text-white">Environment</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              The world or context in which the agent operates, with all objects and rules.
            </p>
            <div className="text-[11px] font-mono text-blue-300 bg-black/40 p-1.5 rounded border border-blue-500/20">
              <strong>Example:</strong> A 5×5 grid with walls, coins, temperature, and a goal.
            </div>
          </div>

          {/* 3. Sensors / Perception */}
          <div
            onMouseEnter={() => setHoveredComponent('sensor')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'sensor'
                ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400 shadow-lg shadow-amber-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold block">Component 3</span>
                <h4 className="text-sm font-bold text-white">Sensors / Perception</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              How the agent receives information or raw observations about the environment.
            </p>
            <div className="text-[11px] font-mono text-amber-300 bg-black/40 p-1.5 rounded border border-amber-500/20">
              <strong>Example:</strong> Digital thermometer (°C) or obstacle distance radar.
            </div>
          </div>

          {/* 4. Agent Program / Decision Making */}
          <div
            onMouseEnter={() => setHoveredComponent('program')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'program'
                ? 'border-violet-400 bg-violet-950/30 ring-1 ring-violet-400 shadow-lg shadow-violet-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-violet-400 font-bold block">Component 4</span>
                <h4 className="text-sm font-bold text-white">Agent Program</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              The internal logic, mathematical formula, or search algorithm used to choose an action.
            </p>
            <div className="text-[11px] font-mono text-violet-300 bg-black/40 p-1.5 rounded border border-violet-500/20">
              <strong>Example:</strong> IF Temp &gt; 30 THEN Fan=ON; or BFS Shortest Path algorithm.
            </div>
          </div>

          {/* 5. Actuators / Actions */}
          <div
            onMouseEnter={() => setHoveredComponent('actuator')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'actuator'
                ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">Component 5</span>
                <h4 className="text-sm font-bold text-white">Actuators / Actions</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              How the agent physically performs changes in the environment.
            </p>
            <div className="text-[11px] font-mono text-emerald-300 bg-black/40 p-1.5 rounded border border-emerald-500/20">
              <strong>Example:</strong> Motor moving robot Up/Down/Left/Right, or fan relay turning ON.
            </div>
          </div>

          {/* 6. Performance Measure / Reward */}
          <div
            onMouseEnter={() => setHoveredComponent('reward')}
            onMouseLeave={() => setHoveredComponent(null)}
            className={`p-4 rounded-xl border transition-all ${
              hoveredComponent === 'reward'
                ? 'border-pink-400 bg-pink-950/30 ring-1 ring-pink-400 shadow-lg shadow-pink-500/20'
                : 'border-[#172746] bg-[#0A142A]'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-pink-400 font-bold block">Component 6</span>
                <h4 className="text-sm font-bold text-white">Performance / Reward</h4>
              </div>
            </div>
            <p className="text-xs text-[#B9C5DF] leading-relaxed mb-2">
              The metric used to score success and evaluate how well the agent achieves its goal.
            </p>
            <div className="text-[11px] font-mono text-pink-300 bg-black/40 p-1.5 rounded border border-pink-500/20">
              <strong>Example:</strong> +15 points for coins, -20 for hitting lava, +50 for reaching star.
            </div>
          </div>
        </div>

        {/* Visual Diagram: Responsive Perception-Action & Feedback Flow */}
        <div className="rounded-xl border border-[#162747] bg-[#070D1E] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#142342] pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Architecture Diagram: Perception-Action Loop with Reward Feedback
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Environment ⇄ Agent Interaction
            </span>
          </div>

          {/* Responsive Diagram Row */}
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center">
              {/* Box 1: Environment */}
              <div className="p-3 rounded-xl border border-blue-500/40 bg-blue-950/30 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1 shadow-sm">
                  <Globe className="h-5 w-5" />
                </div>
                <strong className="text-xs text-white">Environment</strong>
                <span className="text-[10px] text-blue-300 font-mono">World State</span>
              </div>

              {/* Arrow 1 */}
              <div className="flex flex-col items-center justify-center text-cyan-400 py-1">
                <span className="text-[10px] font-mono font-bold">Percepts</span>
                <span className="text-lg">→</span>
              </div>

              {/* Box 2: Sensors */}
              <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/30 flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1 shadow-sm">
                  <Eye className="h-5 w-5" />
                </div>
                <strong className="text-xs text-white">Sensors</strong>
                <span className="text-[10px] text-amber-300 font-mono">Read &amp; Observe</span>
              </div>

              {/* Arrow 2 */}
              <div className="flex flex-col items-center justify-center text-violet-400 py-1">
                <span className="text-[10px] font-mono font-bold">Data</span>
                <span className="text-lg">→</span>
              </div>

              {/* Box 3: Agent & Decision Making */}
              <div className="p-3 rounded-xl border border-violet-500/50 bg-violet-950/40 flex flex-col items-center shadow-md shadow-violet-500/10">
                <div className="h-10 w-10 rounded-full bg-violet-500/30 text-violet-300 flex items-center justify-center mb-1">
                  <Bot className="h-5 w-5" />
                </div>
                <strong className="text-xs text-white">Agent Program</strong>
                <span className="text-[10px] text-violet-300 font-mono">Decision Logic</span>
              </div>
            </div>

            {/* Downward & Return Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center mt-3 pt-3 border-t border-slate-800/80">
              {/* Return to Environment */}
              <div className="p-2.5 rounded-lg border border-pink-500/30 bg-pink-950/20 flex items-center justify-center gap-2 col-span-1 sm:col-span-2">
                <Award className="h-4 w-4 text-pink-400 shrink-0" />
                <div className="text-left">
                  <strong className="text-[11px] text-pink-300 font-mono block">Reward / Feedback Loop:</strong>
                  <span className="text-[10px] text-slate-300 leading-tight">Environment awards +15 points or penalties back to the Agent</span>
                </div>
              </div>

              <div className="flex items-center justify-center text-slate-500 text-sm font-mono">
                <span>⟲ Loops Continually</span>
              </div>

              {/* Actuators & Actions */}
              <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center gap-2 col-span-1 sm:col-span-2">
                <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <strong className="text-[11px] text-emerald-300 font-mono block">Actuators / Actions:</strong>
                  <span className="text-[10px] text-slate-300 leading-tight">Agent executes move (e.g. Move Right), updating Environment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C: How Does an AI Agent Work? (Perception-Action Loop) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40">
            C
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              How Does an AI Agent Work?
            </h3>
            <p className="text-xs text-[#B9C5DF]">
              The simple four-step Perception-Action loop running repeatedly in real-time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 1
                ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400'
                : 'border-[#172746] bg-[#0A142A] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                1
              </span>
              <Eye className="h-4 w-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Observe Environment</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              The agent reads its sensors to see what is happening right now (e.g., Robot senses: <em>Coin at (3,2), Spikes at (2,1)</em>).
            </p>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 2
                ? 'border-blue-400 bg-blue-950/40 ring-1 ring-blue-400'
                : 'border-[#172746] bg-[#0A142A] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                2
              </span>
              <Cpu className="h-4 w-4 text-blue-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Understand the Situation</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              The agent analyzes the observation, checks its memory, and evaluates current distance to its goal.
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 3
                ? 'border-violet-400 bg-violet-950/40 ring-1 ring-violet-400'
                : 'border-[#172746] bg-[#0A142A] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold">
                3
              </span>
              <Target className="h-4 w-4 text-violet-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Choose an Action</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              The agent applies its decision rule, planning algorithm, or utility function to select the best move (e.g., <em>Move Right</em>).
            </p>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => setActiveStep(4)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 4
                ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400'
                : 'border-[#172746] bg-[#0A142A] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                4
              </span>
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Perform Action &amp; Feedback</h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Actuators carry out the action in the environment, and the agent receives reward feedback (e.g., <em>+15 Coins collected!</em>).
            </p>
          </div>
        </div>

        {/* Visual Walkthrough Box */}
        <div className="p-3.5 rounded-xl bg-[#070E22] border border-[#162747] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="text-slate-200">
              Active Step {activeStep}: {activeStep === 1 ? 'Reading coordinate sensors' : activeStep === 2 ? 'Detecting hazard ahead' : activeStep === 3 ? 'Choosing to turn right instead of forward' : 'Safely collected coin without stepping on spike!'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            Perception-Action Loop in Harmony
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: Why Do We Use AI Agents? (Benefits & Practical Value) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
            D
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Why Do We Use AI Agents?
            </h3>
            <p className="text-xs text-[#B9C5DF]">
              The core advantages that make autonomous agents essential in modern computer science.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Benefit 1 */}
          <div className="p-3.5 rounded-xl border border-[#172746] bg-[#0A142A] space-y-1.5">
            <span className="text-base">⚡</span>
            <h4 className="text-xs font-bold text-white">Automating Repetitive Tasks</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Carrying out continuous tasks 24/7 without fatigue, such as monitoring temperature in factories or automated sorting.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="p-3.5 rounded-xl border border-[#172746] bg-[#0A142A] space-y-1.5">
            <span className="text-base">👁️</span>
            <h4 className="text-xs font-bold text-white">Observation-Based Decisions</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Reacting to complex sensor streams in fractions of a second, such as automated braking when pedestrians appear.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="p-3.5 rounded-xl border border-[#172746] bg-[#0A142A] space-y-1.5">
            <span className="text-base">🧭</span>
            <h4 className="text-xs font-bold text-white">Solving Problems &amp; Paths</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Searching millions of possible paths to find the shortest obstacle-free route, like GPS navigation algorithms.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="p-3.5 rounded-xl border border-[#172746] bg-[#0A142A] space-y-1.5">
            <span className="text-base">🧠</span>
            <h4 className="text-xs font-bold text-white">Learning From Experience</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Improving over time through reward signals, without humans having to write manual code for every conceivable situation.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="p-3.5 rounded-xl border border-[#172746] bg-[#0A142A] space-y-1.5">
            <span className="text-base">🔄</span>
            <h4 className="text-xs font-bold text-white">Adapting to Changes</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Modifying actions when the environment changes dynamically, such as rerouting when a new obstacle suddenly blocks the hallway.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E: Types of AI Agents (Comparison Cards + Start Learning CTA) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 font-mono text-xs font-bold border border-violet-500/40">
            E
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              The 5 Types of AI Agents (From Simple to Advanced)
            </h3>
            <p className="text-xs text-[#B9C5DF]">
              Each agent type introduces a new capability. You will play a game for each one!
            </p>
          </div>
        </div>

        {/* 5 Agent Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
          {/* Type 1: Simple Reflex */}
          <div className="p-3.5 rounded-xl border border-[#00E6B8]/40 bg-[#091526] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#00E6B8] mb-1">
                <Fan className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Game 1</span>
              </div>
              <h4 className="text-sm font-bold text-white">Simple Reflex</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Acts solely on the immediate percept using <strong>IF-THEN</strong> condition rules. No memory of the past.
              </p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#00E6B8]/20 text-[10px] font-mono text-teal-300">
              <strong>Example:</strong> Thermostat fan turning ON if Temp &gt; 30°C.
            </div>
          </div>

          {/* Type 2: Model-Based */}
          <div className="p-3.5 rounded-xl border border-[#168BFF]/40 bg-[#091526] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#168BFF] mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Game 2</span>
              </div>
              <h4 className="text-sm font-bold text-white">Model-Based</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Maintains an <strong>internal state (memory)</strong> to remember visited areas and handle partial visibility.
              </p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#168BFF]/20 text-[10px] font-mono text-blue-300">
              <strong>Example:</strong> Robot remembering visited maze tiles to backtrack from dead ends.
            </div>
          </div>

          {/* Type 3: Goal-Based */}
          <div className="p-3.5 rounded-xl border border-[#FFB020]/40 bg-[#091526] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#FFB020] mb-1">
                <Compass className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Game 3</span>
              </div>
              <h4 className="text-sm font-bold text-white">Goal-Based</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Formulates an explicit <strong>destination goal</strong> and searches sequences of future moves (e.g. BFS).
              </p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#FFB020]/20 text-[10px] font-mono text-amber-300">
              <strong>Example:</strong> Pathfinding planner mapping shortest route around obstacles to a flag.
            </div>
          </div>

          {/* Type 4: Utility-Based */}
          <div className="p-3.5 rounded-xl border border-[#8B5CF6]/40 bg-[#091526] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#8B5CF6] mb-1">
                <Scale className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Game 4</span>
              </div>
              <h4 className="text-sm font-bold text-white">Utility-Based</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Uses a <strong>utility function</strong> to measure desirability and make optimal multi-attribute trade-offs.
              </p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#8B5CF6]/20 text-[10px] font-mono text-violet-300">
              <strong>Example:</strong> Choosing best food: U = Wh×Health + Wt×Taste − Wc×Cost.
            </div>
          </div>

          {/* Type 5: Learning Agent */}
          <div className="p-3.5 rounded-xl border border-[#F044A7]/40 bg-[#091526] flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-[#F044A7] mb-1">
                <BrainCircuit className="h-4 w-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Game 5</span>
              </div>
              <h4 className="text-sm font-bold text-white">Learning Agent</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                Learns policies from scratch through <strong>rewards &amp; penalties</strong> using Reinforcement (Q-Learning).
              </p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#F044A7]/20 text-[10px] font-mono text-pink-300">
              <strong>Example:</strong> Q-learning bot discovering coin collection without hardcoded rules.
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-violet-900/50 via-indigo-900/40 to-blue-900/50 border border-violet-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Ready to Experience All 5 Agents First-Hand?</span>
            </h4>
            <p className="text-xs text-slate-300">
              Play Game 1 (Simple Reflex), immediately learn the code behind it, then unlock Game 2!
            </p>
          </div>

          <button
            onClick={onStartGames}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <Gamepad2 className="h-4 w-4" />
            <span>Start Learning Through Games</span>
            <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
};
