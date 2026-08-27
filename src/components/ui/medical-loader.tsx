"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface MedicalLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export function MedicalLoader({ text = "Loading...", fullScreen = true }: MedicalLoaderProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const containerClass = fullScreen 
    ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[300px]";

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center">
        {/* Glowing background circles */}
        <div className="absolute w-20 h-20 bg-primary/20 rounded-full animate-ping" />
        <div className="absolute w-28 h-28 bg-primary/10 rounded-full animate-pulse" />
        
        {/* Main Icon Container */}
        <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 ${pulse ? 'scale-110' : 'scale-95'}`}>
          <Activity size={36} strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <h3 className="text-lg font-medium text-foreground tracking-wide animate-pulse">
          {text}
        </h3>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
