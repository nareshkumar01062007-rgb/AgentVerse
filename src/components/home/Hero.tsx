import React from 'react';
import { ArrowRight, Terminal, Cpu, BookOpen } from 'lucide-react';

interface HeroProps {
  onEnterArena: () => void;
  onScrollToConcept: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterArena, onScrollToConcept }) => {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#111111] bg-[#F8F7F4] pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="label mb-4">
                Laboratory 00 · Interactive AI Learning Lab
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tight text-[#111111] mb-6">
                Play with AI. <br />
                <span className="italic font-normal text-[#FF4D00]">
                  Understand the Intelligence.
                </span>
              </h1>
              <p className="font-sans text-lg sm:text-xl text-[#111111]/70 leading-relaxed max-w-2xl">
                Five intelligent agents. Five interactive challenges. One mission: discover the algorithms behind the intelligence through authentic Python source code.
              </p>
            </div>

            {/* Editorial Metadata Strip */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider text-[#111111]/70 border-y border-[#111111]/15 py-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FF4D00]" />
                <span>Russell &amp; Norvig POAI Model</span>
              </div>
              <span className="hidden sm:inline opacity-30">|</span>
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#111111]" />
                <span>Deterministic Python Logic</span>
              </div>
              <span className="hidden sm:inline opacity-30">|</span>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#FF4D00]" />
                <span>Zero AI API Requirement</span>
              </div>
            </div>

            {/* CTAs: Editorial block buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onEnterArena}
                className="inline-flex items-center justify-center gap-3 bg-[#111111] text-[#F8F7F4] px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-[#FF4D00] transition-colors cursor-pointer"
              >
                <span>Enter the Agent Arena</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onScrollToConcept}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#111111] bg-transparent text-[#111111] px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-[#F8F7F4] transition-colors cursor-pointer"
              >
                <span>What is an AI Agent?</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Architectural Blueprint Robot Canvas */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square border-2 border-[#111111] bg-white p-8 flex flex-col justify-between shadow-[8px_8px_0px_#111111]">
              <div className="flex items-center justify-between border-b border-[#111111]/15 pb-3">
                <span className="font-mono text-[10px] text-[#FF4D00] font-bold uppercase tracking-widest">
                  FIG 1.0 · AUTONOMOUS AGENT CORE
                </span>
                <span className="font-mono text-[10px] text-[#111111]/50 uppercase">
                  POAI-ARCH
                </span>
              </div>

              {/* Crisp Architectural SVG Mascot Linework */}
              <div className="my-auto py-6 flex items-center justify-center">
                <svg className="w-56 h-56" viewBox="0 0 200 200">
                  {/* Grid background lines */}
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#111111" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.3" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#111111" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.3" />

                  {/* Antenna */}
                  <line x1="100" y1="40" x2="100" y2="15" stroke="#111111" strokeWidth="2" />
                  <circle cx="100" cy="14" r="5" fill="#FF4D00" stroke="#111111" strokeWidth="2" />

                  {/* Robot Head Frame */}
                  <rect x="45" y="40" width="110" height="85" fill="#F8F7F4" stroke="#111111" strokeWidth="2" />

                  {/* Ear Nodes */}
                  <rect x="33" y="65" width="12" height="30" fill="#111111" />
                  <rect x="155" y="65" width="12" height="30" fill="#111111" />

                  {/* Visor Screen */}
                  <rect x="58" y="52" width="84" height="40" fill="#111111" />

                  {/* Sensors / Eyes */}
                  <circle cx="82" cy="72" r="8" fill="#FF4D00" />
                  <circle cx="118" cy="72" r="8" fill="#F8F7F4" />

                  {/* Mouth Indicator */}
                  <line x1="75" y1="105" x2="125" y2="105" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                  <line x1="85" y1="101" x2="85" y2="109" stroke="#111111" strokeWidth="1.5" />
                  <line x1="100" y1="101" x2="100" y2="109" stroke="#111111" strokeWidth="1.5" />
                  <line x1="115" y1="101" x2="115" y2="109" stroke="#111111" strokeWidth="1.5" />

                  {/* Torso */}
                  <path d="M 65 125 L 135 125 L 125 170 L 75 170 Z" fill="#F8F7F4" stroke="#111111" strokeWidth="2" />
                  <circle cx="100" cy="148" r="8" fill="#FF4D00" stroke="#111111" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="pt-3 border-t border-[#111111]/15 flex items-center justify-between font-mono text-[10px] text-[#111111]/60 uppercase">
                <span>Percept / Action Loop</span>
                <span className="text-[#FF4D00] font-bold">● Active Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
