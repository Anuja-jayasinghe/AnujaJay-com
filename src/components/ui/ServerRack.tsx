"use client";
import React, { useState, useRef } from "react";
import { ExternalLink, Award, Cpu, HardDrive, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import certificatesData from "../../data/certificates.json";

export default function ServerRack() {
  const [activeBladeId, setActiveBladeId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleBlade = (id: string) => {
    setActiveBladeId((prev) => (prev === id ? null : id));
  };

  const handleMouseEnter = (id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveBladeId(id), 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <div className="w-full max-w-[850px] mx-auto mb-20 mt-10 px-4">
      {/* Rack Header */}
      <div className="mb-4 flex items-end justify-between border-b-2 border-gray-900 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-black font-mono tracking-tighter uppercase text-black">
            JaySync_Lab :: CERT_VAULT_v2
          </h3>
        </div>
        <div className="text-[10px] font-mono text-gray-500 flex gap-4 uppercase">
          <span>Fans: Optimal</span>
          <span className="text-green-600 animate-pulse">● System Live</span>
        </div>
      </div>

      {/* The Main Chassis - Natural Height (Scroll Trap Fixed) */}
      <div
        onMouseLeave={() => {
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          setActiveBladeId(null);
        }}
        className="relative bg-gray-100 rounded-lg border-x-[12px] border-gray-200 shadow-2xl flex flex-col overflow-hidden"
      >

        {/* PART 1: TOP PANEL REDESIGN */}
        <div className="relative h-10 w-full bg-gray-200 border-b border-gray-300 flex items-center px-4 overflow-hidden">
          {/* Brushed Metal Texture Layer */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_4px)]" />
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,transparent_50%,rgba(0,0,0,0.1)_100%)]" />

          {/* Unit Markers - Left */}
          <div className="absolute left-[-8px] top-0 bottom-0 w-2 flex flex-col justify-around py-1.5 opacity-40 select-none">
            <span className="text-[6px] font-mono font-bold text-gray-500">1U</span>
            <span className="text-[6px] font-mono font-bold text-gray-500">2U</span>
          </div>

          <div className="flex-1 flex flex-col gap-1 z-10">
            {/* Industrial Vent Grille Pattern */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex gap-[3px] opacity-20 h-1.5">
                {[...Array(15)].map((_, i) => (
                  <div key={`l-${i}`} className="flex-1 max-w-[4px] h-full bg-black rounded-sm shadow-inner" />
                ))}
              </div>

              {/* PRIMARY AIR INTAKE - Central Focus */}
              <div className="flex gap-1.5 px-3 py-1 bg-gray-300 rounded-full border border-gray-400 shadow-inner">
                {[...Array(6)].map((_, i) => (
                  <div key={`intake-${i}`} className="w-1.5 h-1.5 rounded-full bg-black shadow-inner flex items-center justify-center">
                    <div className="w-[1px] h-[1px] bg-blue-500/30 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="flex-1 flex gap-[3px] opacity-20 h-1.5 justify-end">
                {[...Array(15)].map((_, i) => (
                  <div key={`r-${i}`} className="flex-1 max-w-[4px] h-full bg-black rounded-sm shadow-inner" />
                ))}
              </div>
            </div>
            {/* Cable Management Bar Detail */}
            <div className="h-0.5 w-full bg-gray-400 border-y border-gray-500 opacity-30" />
          </div>

          {/* Unit Markers - Right */}
          <div className="absolute right-[-8px] top-0 bottom-0 w-2 flex flex-col justify-around py-1.5 opacity-40 select-none">
            <span className="text-[6px] font-mono font-bold text-gray-500">1U</span>
            <span className="text-[6px] font-mono font-bold text-gray-500">2U</span>
          </div>
        </div>

        {/* Blades Container - Grows to fit all 17, now in 2 columns on desktop */}
        <div className="py-2 px-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-0.5">
            {certificatesData.map((cert, index) => {
              const isActive = activeBladeId === cert.id;

              return (
                <motion.div
                  key={cert.id}
                  layout
                  className={`group relative overflow-hidden rounded-sm transition-all duration-300 border-b border-gray-200 ${isActive ? "z-10 scale-[1.012] md:col-span-2 shadow-xl" : "z-0"
                    }`}
                >
                  {/* Blade UI - Button for a11y & interaction */}
                  <button
                    onClick={() => toggleBlade(cert.id)}
                    onMouseEnter={() => handleMouseEnter(cert.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center h-[42px] px-3 gap-3 text-left transition-colors ${isActive ? "bg-white" : "bg-gray-50 hover:bg-white"
                      }`}
                  >
                    {/* Mounting Screw Detail */}
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 border border-gray-400 shadow-inner shrink-0" />

                    {/* Status LED */}
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 ${isActive ? "animate-pulse" : "opacity-20 blur-[0.5px]"
                        }`}
                      style={{
                        backgroundColor: cert.ledColor,
                        boxShadow: isActive ? `0 0 10px ${cert.ledColor}` : "none",
                      }}
                    />

                    {/* Blade Title Block */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <p className="font-mono text-[10px] font-bold text-gray-700 tracking-tight truncate">
                        <span className="text-gray-400 mr-1.5">
                          SLOT_{String(certificatesData.length - index).padStart(2, "0")}
                        </span>
                        {cert.issuer.toUpperCase()}::{cert.title.replace(/\s+/g, "_").toUpperCase()}
                      </p>
                      <div className="flex gap-2 shrink-0 ml-2">
                        <span className="text-[8px] font-mono text-gray-400 group-hover:text-blue-600 transition-colors uppercase">
                          {isActive ? "Reading..." : "STBY"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content - Pulled out look */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-200 border-t border-blue-500/20"
                      >
                        <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
                          {/* Image Preview with CRT Filter */}
                          <div className="relative w-full md:w-56 aspect-video rounded border border-gray-300 overflow-hidden bg-white shrink-0 shadow-inner">
                            {cert.image && (
                              <Image
                                src={cert.image}
                                alt={cert.title}
                                fill
                                className="object-contain p-1 opacity-70 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]" />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Terminal size={12} className="text-blue-500" />
                              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-tighter">
                                Verified_Credential_Metadata
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 leading-tight uppercase tracking-wide">
                              {cert.title}
                            </h4>

                            <div className="flex items-center gap-5 mt-4">
                              <a
                                href={cert.verifyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black font-mono px-4 py-2 rounded-sm transition-all shadow-lg shadow-blue-900/10"
                              >
                                <ExternalLink size={10} />
                                PUSH_TO_VERIFY
                              </a>
                              <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-gray-500 uppercase">Category</span>
                                <span className="text-[10px] font-mono text-gray-700 font-bold uppercase">
                                  {cert.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PART 2: BOTTOM PANEL REDESIGN */}
        <div className="relative h-7 bg-gray-200 border-t border-gray-300 px-4 flex items-center overflow-hidden">
          {/* Flash Effect on state change */}
          <div key={activeBladeId} className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-status-flash" />

          <div className="flex items-center justify-between w-full h-full font-mono text-[9px] tracking-tight">
            {/* Status Information */}
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              {activeBladeId ? (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="text-blue-400/50">{">"}</span>
                  <div className="flex gap-1 overflow-hidden">
                    <span className="font-bold">READING:</span>
                    {certificatesData.find(c => c.id === activeBladeId) && (
                      <span className="animate-typing-active">
                        {certificatesData.find(c => c.id === activeBladeId)?.issuer.toUpperCase()}::{certificatesData.find(c => c.id === activeBladeId)?.title.replace(/\s+/g, '_').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="w-1.5 h-3 bg-blue-500 animate-terminal-cursor ml-0.5" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="animate-marquee whitespace-nowrap">
                    {">"} CERT_VAULT_v2 — ALL SYSTEMS NOMINAL —— {">"} CERT_VAULT_v2 — ALL SYSTEMS NOMINAL ——
                  </span>
                  <div className="flex gap-0.5 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20 animate-pulse" />
                    <span className="w-3 h-1 bg-blue-500/10 rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-blue-500/30 animate-scan-bar" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic Indicators */}
            <div className="flex items-center gap-3 shrink-0 ml-4 opacity-50 uppercase text-[8px] text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-500/50" />
                LNK::UP
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                CPU::MOD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for the scrollbar and industrial effects */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes status-flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .animate-status-flash {
          animation: status-flash 0.4s ease-out forwards;
        }

        @keyframes terminal-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-terminal-cursor {
          animation: terminal-cursor 0.8s step-end infinite;
        }

        @keyframes scan-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan-bar {
          animation: scan-bar 2s linear infinite;
        }

        @keyframes typing-active {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-typing-active {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing-active 0.3s steps(30, end);
        }
      `}</style>
    </div>
  );
}