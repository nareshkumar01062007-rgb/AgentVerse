import React from 'react';
import { Gamepad2, BookOpen, Bot, Brain, Sparkles, Sliders, CheckSquare, Layers } from 'lucide-react';
import { MascotIllustration } from './MascotIllustration';

interface HeroPanelProps {
  onExploreTypes: () => void;
  onWhatIsAgent: () => void;
}

export const HeroPanel: React.FC<HeroPanelProps> = ({ onExploreTypes, onWhatIsAgent }) => {
  return (
    <div className="relative rounded-2xl border border-[#162238] bg-[#091126]/90 p-5 sm:p-7 shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-600/15 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#14203B]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            AI Agent Arena
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-[#B9C5DF]">
          <a href="#hero" className="text-white hover:text-[#22D3EE] transition-colors">
            Home
          </a>
          <a href="#learn" onClick={(e) => { e.preventDefault(); onWhatIsAgent(); }} className="hover:text-white transition-colors">
            Learn
          </a>
          <a href="#play" onClick={(e) => { e.preventDefault(); onExploreTypes(); }} className="hover:text-white transition-colors">
            Play
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExploreTypes}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 transition-all cursor-pointer"
          >
            <span>Let&apos;s Learn AI!</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E1B38] border border-[#1A2C55] text-slate-300">
            <Gamepad2 className="h-4 w-4 text-violet-400" />
          </div>
        </div>
      </div>

      {/* Main Hero Content: Left Copy + Right Mascot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
        {/* Left Copy */}
        <div className="md:col-span-7 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.12]">
            Welcome to <br />
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#38BDF8] bg-clip-text text-transparent">
              AI Agent Arena
            </span>
          </h1>

          {/* Three-Color Tagline */}
          <div className="text-base sm:text-lg font-bold">
            <span className="text-[#22D3EE]">Play.</span>{' '}
            <span className="text-[#FFB020]">Experiment.</span>{' '}
            <span className="text-[#C084FC]">Learn.</span>
          </div>

          <p className="text-xs sm:text-[13px] text-[#B9C5DF] leading-relaxed max-w-md">
            Explore how different AI agents think and act through fun interactive games. Play, make decisions, and then discover the algorithm behind it with code and step-by-step explanation.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreTypes}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Explore the Types</span>
              <span className="text-xs">→</span>
            </button>

            <button
              onClick={onWhatIsAgent}
              className="inline-flex items-center gap-2 rounded-xl border border-[#233560] bg-[#0E1A36]/80 hover:bg-[#14264E] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>What is an AI Agent?</span>
            </button>
          </div>
        </div>

        {/* Right Mascot & Floating Badges */}
        <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px]">
          {/* Glowing brain and speech bubble */}
          <div className="absolute top-0 right-2 z-20 max-w-[210px] rounded-2xl border border-violet-500/40 bg-[#0B1530]/90 p-2.5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600/30 text-violet-300">
                <Brain className="h-3 w-3" />
              </div>
              <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                Agent Mindset
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              &ldquo;Different agents, Different thinking! Same goal — Smarter Decisions!&rdquo;
            </p>
          </div>

          {/* Floating UI Badges */}
          <div className="absolute left-0 top-6 z-10 hidden sm:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-[#0A1633]/80 px-2 py-1 text-[9px] font-mono text-cyan-300 shadow-lg">
            <Sliders className="h-3 w-3 text-cyan-400" />
            <span>Percept Loop</span>
          </div>

          <div className="absolute left-2 bottom-6 z-10 hidden sm:flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-[#0A1633]/80 px-2 py-1 text-[9px] font-mono text-indigo-300 shadow-lg">
            <CheckSquare className="h-3 w-3 text-indigo-400" />
            <span>5 Architectures</span>
          </div>

          {/* Robot Mascot */}
          <div className="relative z-10 animate-float">
            <MascotIllustration className="w-48 h-48 sm:w-52 sm:h-52" />
          </div>
        </div>
      </div>
    </div>
  );
};
