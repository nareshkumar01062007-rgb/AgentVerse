import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HowLearningWorksProps {
  onStartExploring: () => void;
}

export const HowLearningWorks: React.FC<HowLearningWorksProps> = ({ onStartExploring }) => {
  const steps = [
    {
      number: '01',
      title: 'EXPLORE',
      subtitle: 'Theoretical Principles',
      desc: 'Study the agent’s perceptual inputs, actuators, environmental constraints, and mathematical bounds.',
    },
    {
      number: '02',
      title: 'PLAY',
      subtitle: 'Interactive Simulation',
      desc: 'Experience the agent’s sensory decisions firsthand. Navigate dead ends, dynamic heat thresholds, or Q-learning penalties.',
    },
    {
      number: '03',
      title: 'DISCOVER',
      subtitle: 'Algorithmic Anatomy',
      desc: 'Reveal the authentic Python code. Walk through each statement line-by-line with live variable snapshots.',
    },
    {
      number: '04',
      title: 'MASTER',
      subtitle: 'Code-to-Game Synthesis',
      desc: 'Manipulate parameters in the live interactive sandbox and earn your accredited POAI curriculum certification.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8F7F4] border-b-2 border-[#111111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="label">Pedagogical Framework</span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111111]">
            How Learning Works in AgentVerse.
          </h2>
          <p className="font-serif italic text-2xl text-[#111111]/80 leading-snug">
            &ldquo;Don&apos;t just learn how AI agents work. Play as an agent, experience its decisions, win or lose, and then discover the actual algorithm behind the game through Python code.&rdquo;
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 border border-[#111111]/20 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-[#111111]/10 pb-3">
                  <span className="font-mono text-2xl font-bold text-[#FF4D00]">
                    {step.number}
                  </span>
                  <span className="font-mono text-[10px] text-[#111111]/50 uppercase tracking-widest">
                    Phase
                  </span>
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-[#FF4D00] font-bold mb-1">
                  {step.title}
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#111111] mb-3">
                  {step.subtitle}
                </h4>
                <p className="text-xs text-[#111111]/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Accent Box */}
        <div className="border-2 border-[#111111] bg-[#111111] text-[#F8F7F4] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          <span className="label text-[#FF4D00]">Laboratory Admission</span>
          <h3 className="font-serif text-4xl sm:text-5xl text-[#F8F7F4]">
            Ready to Think Like an AI?
          </h3>
          <p className="text-base text-[#F8F7F4]/75 max-w-xl mx-auto leading-relaxed">
            Enter the simulation chamber. Select any of the five POAI agents, tackle its interactive challenge, and uncover the source algorithm.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartExploring}
              className="inline-flex items-center gap-3 bg-[#FF4D00] text-white px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-[#111111] transition-colors cursor-pointer"
            >
              <span>Enter the Agent Arena</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
