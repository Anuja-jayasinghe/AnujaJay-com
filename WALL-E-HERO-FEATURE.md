# 3D Interactive Hero Feature: WALL-E & EVE

## Overview
This document outlines the architecture and implementation plan for the interactive 3D hero section on anujajay.com. The feature uses a "Puppet and Puppeteer" architecture, where a Spline 3D scene handles visual rendering and animations, while the Next.js frontend manages state, timing, and randomized interactions.

**Tech Stack:**
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **3D Runtime:** `@splinetool/react-spline` & `@splinetool/runtime`
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion
* **Icons:** Lucide React

---

## 1. Directory Structure

Ensure your `src/` directory accommodates the following files:

```text
src/
├── app/
│   └── page.tsx                 # Main entry point
├── components/
│   └── hero/
│       ├── HeroSection.tsx      # Main layout, Typography, Buttons (Top Layer)
│       └── Hero3DCanvas.tsx     # Spline integration & JS Controller (Bottom Layer)
├── config/
│   └── interactions.ts          # Data-driven config for skits and exits
└── hooks/
    └── useIdleTimer.ts          # Custom hook for the 10s idle logic
2. Configuration (src/config/interactions.ts)
This file defines the available animations. To add new skits or exits in the future, simply add them to these arrays. Ensure the splineEventName perfectly matches the Event name in your Spline file.

TypeScript
export type AnimationState = {
  id: string;
  splineEventName: string;
  durationMs?: number;
};

export const SKIT_ANIMATIONS: AnimationState[] = [
  { id: 'scan', splineEventName: 'Play_Skit_01' },
  { id: 'plant', splineEventName: 'Play_Skit_02' },
  { id: 'dance', splineEventName: 'Play_Skit_03' },
  { id: 'charge', splineEventName: 'Play_Skit_04' },
  { id: 'rubiks', splineEventName: 'Play_Skit_05' },
  { id: 'poke', splineEventName: 'Play_Skit_06' },
  { id: 'shock', splineEventName: 'Play_Skit_07' },
  { id: 'movie', splineEventName: 'Play_Skit_08' },
];

export const EXIT_ANIMATIONS: AnimationState[] = [
  { id: 'observer', splineEventName: 'Exit_Observer' }, 
  { id: 'protector', splineEventName: 'Exit_Protector' }, 
];

export const getRandomAnimation = (animations: AnimationState[]) => {
  const randomIndex = Math.floor(Math.random() * animations.length);
  return animations[randomIndex];
};
3. Idle Timer Hook (src/hooks/useIdleTimer.ts)
This custom hook manages the user's active/idle state safely within the Next.js client environment.

TypeScript
"use client";
import { useState, useEffect, useRef } from 'react';

export const useIdleTimer = (timeoutMs: number = 10000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      if (isIdle) setIsIdle(false);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isIdle, timeoutMs]);

  return isIdle;
};
4. 3D Canvas Controller (src/components/hero/Hero3DCanvas.tsx)
This component acts as the "Puppeteer," listening for idle state changes and triggering the appropriate Spline events based on our configuration.

TypeScript
"use client";
import { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { SKIT_ANIMATIONS, EXIT_ANIMATIONS, getRandomAnimation } from '@/config/interactions';

export default function Hero3DCanvas() {
  const isIdle = useIdleTimer(10000); 
  const splineApp = useRef<Application | null>(null);
  const previousIdleState = useRef(false);

  const onLoad = (spline: Application) => {
    splineApp.current = spline;
  };

  useEffect(() => {
    if (!splineApp.current) return;

    // Transition: Active -> Idle (Trigger Skit)
    if (isIdle && !previousIdleState.current) {
      const randomSkit = getRandomAnimation(SKIT_ANIMATIONS);
      splineApp.current.emitEvent('start', randomSkit.splineEventName);
    }

    // Transition: Idle -> Active (Trigger Exit)
    if (!isIdle && previousIdleState.current) {
      const randomExit = getRandomAnimation(EXIT_ANIMATIONS);
      splineApp.current.emitEvent('start', randomExit.splineEventName);
    }

    previousIdleState.current = isIdle;
  }, [isIdle]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Spline 
        scene="[https://prod.spline.design/YOUR_SCENE_URL/scene.splinecode](https://prod.spline.design/YOUR_SCENE_URL/scene.splinecode)" 
        onLoad={onLoad} 
      />
    </div>
  );
}
5. Main Hero Layout (src/components/hero/HeroSection.tsx)
The primary layout component. Z-index layering is critical here to ensure EVE can visually hide behind the typography and buttons.

TypeScript
"use client";
import Hero3DCanvas from './Hero3DCanvas';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center bg-white overflow-hidden">
      
      {/* Layer 1: The 3D Canvas (Bottom Layer) */}
      <Hero3DCanvas />

      {/* Layer 2: Typography & UI (Top Layer) */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-900 font-medium mb-4"
          >
            Hello, it's me
          </motion.p>
          
          {/* Note: Solid backgrounds on text elements allow EVE to hide behind them */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-black mb-6 tracking-tight bg-white inline-block pr-4 rounded-r-md"
          >
            Anuja Jayasinghe.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl mb-8 max-w-lg bg-white/90 p-2 rounded-md"
          >
            I build clean, purposeful solutions that solve real-world problems. Continuous learner.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 relative z-20"
          >
            <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors">
              View Work
            </button>
            <button className="border border-black text-black px-8 py-3 font-semibold hover:bg-gray-50 transition-colors bg-white">
              Resume
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
6. Testing & Debugging
Fast Iteration: In Hero3DCanvas.tsx, change useIdleTimer(10000) to useIdleTimer(2000) to test animations quickly.

Verify Spline Events: Ensure the exact strings in interactions.ts are mapped to Custom Events inside the Spline Editor.

Layout Debugging: Add border-2 border-red-500 temporarily to the <h1> and <p> tags to confirm their bounding boxes correctly mask EVE when she enters the "Observer" state.