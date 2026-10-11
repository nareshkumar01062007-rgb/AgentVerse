import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FooterProps {
  onResetProgress: () => void;
  onNavigateArena: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetProgress, onNavigateArena }) => {
  return (
    <footer id="about" className="bg-[#F8F7F4] text-[#111111] border-t-2 border-[#111111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif italic text-3xl font-semibold text-[#111111]">
              AgentVerse.
            </span>
            <p className="text-sm text-[#111111]/70 leading-relaxed max-w-md">
              An interactive educational laboratory designed for Principles of Artificial Intelligence (POAI).
              Play through the five foundational intelligent agent archetypes, witness real algorithmic decision-making, and bridge gameplay directly to clean Python implementations.
            </p>
            <div className="font-mono text-xs uppercase tracking-wider text-[#111111]/50 space-x-3 pt-2">
              <span>Russell &amp; Norvig</span>
              <span>·</span>
              <span>POAI Curriculum</span>
              <span>·</span>
              <span>Deterministic AI</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
            <h4 className="font-bold text-[#111111] border-b border-[#111111]/15 pb-2">
              The Five Modules
            </h4>
            <ul className="space-y-2 text-[#111111]/70">
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  01. Simple Reflex Agent
                </button>
              </li>
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  02. Model-Based Agent
                </button>
              </li>
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  03. Goal-Based Agent
                </button>
              </li>
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  04. Utility-Based Agent
                </button>
              </li>
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  05. Learning Agent
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-wider">
            <h4 className="font-bold text-[#111111] border-b border-[#111111]/15 pb-2">
              Laboratory Tools
            </h4>
            <ul className="space-y-2 text-[#111111]/70">
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  Interactive Sandboxes
                </button>
              </li>
              <li>
                <button onClick={onNavigateArena} className="hover:text-[#FF4D00] transition-colors text-left cursor-pointer">
                  Python Source Code Walkthroughs
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onResetProgress}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Progress Cache</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Variation 3 Footer Strip */}
      <div className="px-6 sm:px-12 py-4 bg-[#111111] text-[#F8F7F4] font-mono text-[11px] uppercase tracking-widest flex flex-col sm:flex-row items-center justify-between gap-2 border-t-2 border-[#111111]">
        <div>© 2026 AGENTVERSE LABORATORY / POAI SYSTEM</div>
        <div className="opacity-50">RE-CALIBRATING ALGORITHMIC THINKING</div>
      </div>
    </footer>
  );
};
