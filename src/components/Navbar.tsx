import React, { useState } from 'react';
import { UserProgress } from '../types/agent';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  activeView: 'home' | 'arena' | 'game' | 'lab';
  onNavigate: (view: 'home' | 'arena') => void;
  onOpenProgress: () => void;
  onOpenAlgorithmLab?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeView,
  onNavigate,
  onOpenProgress,
  onOpenAlgorithmLab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const completedCount = progress.completedGames.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F7F4] border-b-2 border-[#111111]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand: Cormorant Garamond, Italic, 2.2rem */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group focus:outline-none flex items-baseline gap-2 cursor-pointer"
        >
          <span className="font-serif italic text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] group-hover:text-[#FF4D00] transition-colors">
            AgentVerse.
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#111111]/50 uppercase tracking-widest">
            POAI Lab
          </span>
        </button>

        {/* Meta Nav: Space Mono, uppercase, 0.7rem, letter-spacing */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-[#111111]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer hover:text-[#FF4D00] ${
              activeView === 'home' ? 'font-bold text-[#FF4D00]' : ''
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('arena')}
            className={`transition-colors cursor-pointer hover:text-[#FF4D00] ${
              activeView === 'arena' ? 'font-bold text-[#FF4D00]' : ''
            }`}
          >
            Arena
          </button>
          <button
            onClick={() => {
              if (onOpenAlgorithmLab) {
                onOpenAlgorithmLab();
              } else {
                onNavigate('arena');
              }
            }}
            className={`transition-colors cursor-pointer hover:text-[#FF4D00] ${
              activeView === 'lab' ? 'font-bold text-[#FF4D00]' : ''
            }`}
          >
            Algorithm Lab
          </button>
          <a
            href="#how-it-works"
            onClick={() => onNavigate('home')}
            className="transition-colors cursor-pointer hover:text-[#FF4D00]"
          >
            Curriculum
          </a>

          {/* Progress Indicator */}
          <button
            onClick={onOpenProgress}
            className="flex items-center gap-1.5 font-bold text-[#FF4D00] hover:opacity-80 transition-opacity cursor-pointer border border-[#FF4D00]/30 px-3 py-1 rounded-sm bg-[#FF4D00]/5"
          >
            <span>●</span>
            <span>Progress: {completedCount}/5</span>
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onOpenProgress}
            className="font-mono text-xs text-[#FF4D00] font-bold"
          >
            ● {completedCount}/5
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#111111] hover:text-[#FF4D00] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#111111] bg-[#F8F7F4] px-6 py-6 font-mono text-xs uppercase tracking-wider space-y-4">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 border-b border-[#111111]/10 text-[#111111] hover:text-[#FF4D00]"
          >
            Explore Home
          </button>
          <button
            onClick={() => {
              onNavigate('arena');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 border-b border-[#111111]/10 text-[#111111] hover:text-[#FF4D00]"
          >
            Agent Arena (5 Challenges)
          </button>
          <button
            onClick={() => {
              if (onOpenAlgorithmLab) onOpenAlgorithmLab();
              else onNavigate('arena');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 border-b border-[#111111]/10 text-[#111111] hover:text-[#FF4D00]"
          >
            Algorithm Lab
          </button>
          <button
            onClick={() => {
              onOpenProgress();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full py-2 text-[#FF4D00] font-bold"
          >
            <span>Curriculum Progress</span>
            <span>{completedCount}/5 Cleared</span>
          </button>
        </div>
      )}
    </header>
  );
};
