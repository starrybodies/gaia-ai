"use client";

import { useState, useEffect } from "react";

interface IntroWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

const WALKTHROUGH_STEPS = [
  {
    title: "WELCOME_TO_GAIA",
    subtitle: "Environmental Intelligence Platform",
    content: "Real-time environmental data and natural capital analytics for any location on Earth.",
    icon: "globe",
  },
  {
    title: "EXPLORE_THE_MAP",
    subtitle: "Click Anywhere to Query",
    content: "Click any point on the interactive map to instantly retrieve environmental data for that location.",
    icon: "map",
  },
  {
    title: "DATA_MODULES",
    subtitle: "10+ Environmental Datasets",
    content: "Access weather, air quality, climate history, biodiversity, soil, ocean, carbon, and deforestation data.",
    icon: "data",
  },
  {
    title: "NATURAL_CAPITAL",
    subtitle: "Ecosystem Valuation",
    content: "Understand the economic value of ecosystems with our proprietary natural capital analytics.",
    icon: "value",
  },
  {
    title: "ASK_GAIA",
    subtitle: "AI-Powered Insights",
    content: "Use the chat interface to ask questions and get intelligent analysis of environmental data.",
    icon: "chat",
  },
];

export default function IntroWalkthrough({ onComplete, onSkip }: IntroWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showContent, setShowContent] = useState(false);

  const step = WALKTHROUGH_STEPS[currentStep];

  // Typewriter effect for title
  useEffect(() => {
    setTypedText("");
    setShowContent(false);
    setIsAnimating(true);

    let index = 0;
    const title = step.title;
    const interval = setInterval(() => {
      if (index <= title.length) {
        setTypedText(title.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowContent(true);
          setIsAnimating(false);
        }, 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep, step.title]);

  const nextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "globe":
        return (
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-2 border-blue rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border border-white rounded-full" />
            <div className="absolute inset-8 border border-blue-bright rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-blue">
              G
            </div>
          </div>
        );
      case "map":
        return (
          <div className="relative w-32 h-32 border-2 border-white">
            <div className="absolute top-2 left-2 w-3 h-3 bg-blue animate-ping" />
            <div className="absolute top-8 right-4 w-2 h-2 bg-blue-bright animate-pulse" />
            <div className="absolute bottom-4 left-8 w-2 h-2 bg-white animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        );
      case "data":
        return (
          <div className="grid grid-cols-3 gap-1 w-32 h-32">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="border border-white flex items-center justify-center text-[8px] text-blue-bright animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {["WX", "AQ", "CO2", "BIO", "OCN", "SOL", "SAT", "FOR", "CLM"][i]}
              </div>
            ))}
          </div>
        );
      case "value":
        return (
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="text-3xl font-bold text-blue animate-pulse">$</div>
            <div className="absolute inset-0 border-2 border-blue" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-bright" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white" />
          </div>
        );
      case "chat":
        return (
          <div className="w-32 h-32 border-2 border-white p-2 flex flex-col justify-end">
            <div className="bg-code p-1 text-[8px] text-white-dim mb-1 self-start">What is the AQI?</div>
            <div className="bg-blue p-1 text-[8px] text-white self-end animate-pulse">AQI: 42 - Good</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 167, 225, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 167, 225, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "grid-move 20s linear infinite",
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        {/* Terminal window */}
        <div className="terminal-window">
          {/* Window header */}
          <div className="window-header">
            <span className="text-blue">[GAIA_ONBOARDING]</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-white-dim">
                STEP {currentStep + 1}/{WALKTHROUGH_STEPS.length}
              </span>
              <div className="window-controls">
                <div className="window-control" onClick={onSkip} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              {renderIcon(step.icon)}
            </div>

            {/* Title with typewriter effect */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white font-mono tracking-wider mb-2">
                <span className="text-blue">&gt;</span> {typedText}
                <span className={`inline-block w-3 h-6 bg-blue ml-1 ${isAnimating ? "animate-blink" : "opacity-0"}`} />
              </h2>
              <div className={`text-sm text-blue uppercase tracking-widest transition-opacity duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}>
                {step.subtitle}
              </div>
            </div>

            {/* Description */}
            <div className={`text-center text-white-dim font-mono transition-all duration-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <p className="text-sm leading-relaxed">{step.content}</p>
            </div>

            {/* Progress bar */}
            <div className="mt-8 flex justify-center gap-2">
              {WALKTHROUGH_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-8 transition-all duration-300 ${
                    i === currentStep ? "bg-blue" : i < currentStep ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 border border-white font-mono text-xs uppercase tracking-wider transition-all ${
                  currentStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-background"
                }`}
              >
                BACK
              </button>

              <button
                onClick={onSkip}
                className="px-4 py-2 text-white-dim font-mono text-xs uppercase tracking-wider hover:text-blue transition-all"
              >
                SKIP_INTRO
              </button>

              <button
                onClick={nextStep}
                className="px-4 py-2 border-2 border-blue text-blue font-mono text-xs uppercase tracking-wider hover:bg-blue hover:text-white transition-all"
              >
                {currentStep === WALKTHROUGH_STEPS.length - 1 ? "GET_STARTED" : "NEXT"}
              </button>
            </div>
          </div>
        </div>

        {/* System log */}
        <div className="mt-4 font-mono text-[10px] text-white-dim opacity-50">
          <div><span className="text-blue">&gt;&gt;</span> GAIA_AI v2.0 initialized</div>
          <div><span className="text-blue">&gt;&gt;</span> Environmental data systems: ONLINE</div>
          <div><span className="text-blue">&gt;&gt;</span> Natural capital engine: READY</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
