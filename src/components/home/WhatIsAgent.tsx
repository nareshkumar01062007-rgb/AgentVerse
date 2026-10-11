import React, { useState } from 'react';
import { Eye, Cpu, Zap, Globe, RotateCw } from 'lucide-react';

export const WhatIsAgent: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const loopStages = [
    {
      id: 'env',
      stepNum: '01',
      name: 'Environment',
      icon: Globe,
      summary: 'The operational world in which the agent exists.',
      vacuumExample:
        'Living room floor containing carpet, wood, obstacles, furniture legs, and dust particulates.',
      detail:
        'Can be fully or partially observable, deterministic or stochastic, static or dynamic.',
    },
    {
      id: 'sensors',
      stepNum: '02',
      name: 'Sensors',
      icon: Eye,
      summary: 'Receptive mechanisms acquiring environmental Percepts.',
      vacuumExample:
        'Infrared bumper collision switches, cliff drop detectors, and optical dirt sensors.',
      detail:
        'Converts physical environmental conditions into digital percept tuples.',
    },
    {
      id: 'agent',
      stepNum: '03',
      name: 'Agent (Core)',
      icon: Cpu,
      summary: 'The internal decision function mapping percepts to actions.',
      vacuumExample:
        'Microcontroller processing percepts against rules, spatial maps, or reinforcement values.',
      detail:
        'Executes decision rules (Reflex, Model-Based, Goal-Based, Utility, or Q-Learning).',
    },
    {
      id: 'actuators',
      stepNum: '04',
      name: 'Actuators',
      icon: Zap,
      summary: 'The physical mechanisms executing the selected action.',
      vacuumExample:
        'Electric drive wheels, spinning edge sweeper, and suction impeller motor.',
      detail:
        'Modifies the physical state of the environment, restarting the loop.',
    },
  ];

  return (
    <section id="what-is-agent" className="py-20 sm:py-28 border-b-2 border-[#111111] bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="label">Theoretical Foundations</span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111111]">
            What is an AI Agent?
          </h2>
          <p className="font-serif italic text-2xl text-[#111111]/80 leading-snug">
            &ldquo;An AI agent is anything that can be viewed as perceiving its environment through sensors and acting upon that environment through actuators.&rdquo;
          </p>
          <p className="font-mono text-xs uppercase text-[#111111]/50 tracking-wider pt-1">
            — Russell &amp; Norvig · Principles of Artificial Intelligence
          </p>
        </div>

        {/* 4 Loop Stages in Editorial Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3 mb-8">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#111111]">
              The Perception-Action Cycle
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#FF4D00]">
              <RotateCw className="h-3.5 w-3.5 animate-[spin_10s_linear_infinite]" />
              <span>Continuous Feedback Loop</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loopStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = activeStage === idx;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#111111] bg-white shadow-[6px_6px_0px_#111111]'
                      : 'border-[#111111]/20 bg-white/60 hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#FF4D00]">
                        {stage.stepNum}
                      </span>
                      <Icon className="h-4 w-4 text-[#111111]" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-[#111111] mb-2">
                      {stage.name}
                    </h4>
                    <p className="text-xs text-[#111111]/70 leading-relaxed mb-6">
                      {stage.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#111111]/10 font-mono text-[10px] text-[#111111]/50">
                    <span>Function: </span>
                    <span className="text-[#111111] font-semibold">{stage.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-World Case Study Box: Dark Accent Editorial Box */}
        <div className="border-2 border-[#111111] bg-[#111111] text-[#F8F7F4] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="label text-[#FF4D00]">Everyday PEAS Model</span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F8F7F4]">
                The Autonomous Vacuum.
              </h3>
              <p className="text-sm text-[#F8F7F4]/70 leading-relaxed">
                Notice how the agent does not merely process data—it executes a continuous loop altering its environment in physical space.
              </p>
              <div className="font-mono text-xs text-[#FF4D00] pt-2">
                Active Component: 0{activeStage + 1}. {loopStages[activeStage].name}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#1C1C1C] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-white/50 border-b border-white/10 pb-3">
                <span className="uppercase">System Trace</span>
                <span>Stage 0{activeStage + 1} of 04</span>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-[11px] text-[#FF4D00] uppercase">
                  Hardware Behavior:
                </div>
                <p className="text-base font-serif italic text-white leading-relaxed">
                  &ldquo;{loopStages[activeStage].vacuumExample}&rdquo;
                </p>
              </div>

              {/* Stage selector buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {loopStages.map((stage, idx) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(idx)}
                    className={`py-2 px-1 text-center font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                      activeStage === idx
                        ? 'bg-[#FF4D00] text-white font-bold'
                        : 'bg-black/50 text-white/60 hover:text-white'
                    }`}
                  >
                    {stage.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
