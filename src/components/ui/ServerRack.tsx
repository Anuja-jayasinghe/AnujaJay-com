"use client";
import React, { useState, useRef } from "react";
import { ExternalLink, Cpu, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import certificatesData from "../../data/certificates.json";

function FanSVG({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-fan-spin" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <circle cx="12" cy="12" r="2.5" fill="#6b7280" />
        <path d="M12 12 C12 6 17 4 17 8 C17 10 14 11 12 12Z" fill="#9ca3af" />
        <path d="M12 12 C18 12 20 17 16 17 C14 17 13 14 12 12Z" fill="#9ca3af" />
        <path d="M12 12 C12 18 7 20 7 16 C7 14 10 13 12 12Z" fill="#9ca3af" />
        <path d="M12 12 C6 12 4 7 8 7 C10 7 11 10 12 12Z" fill="#9ca3af" />
        <circle cx="12" cy="12" r="1.5" fill="#4b5563" />
      </svg>
    </div>
  );
}

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
        <div className="text-[10px] font-mono text-gray-500 flex gap-4 uppercase items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block shadow-[0_0_4px_#22c55e]" />
            Fans: Optimal
          </span>
          <span className="text-green-600 animate-pulse">● System Live</span>
        </div>
      </div>

      {/* Main Chassis */}
      <div
        onMouseLeave={() => {
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          setActiveBladeId(null);
        }}
        className="relative bg-gray-100 rounded-lg border-x-[12px] border-gray-200 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Rack scan line — sweeps top to bottom continuously */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="animate-rack-scan absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent" />
        </div>

        {/* TOP PANEL */}
        <div className="relative h-12 w-full bg-gray-200 border-b border-gray-300 flex items-center px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_4px)]" />

          {/* Unit Markers - Left */}
          <div className="absolute left-[-8px] top-0 bottom-0 w-2 flex flex-col justify-around py-1.5 opacity-40 select-none">
            <span className="text-[6px] font-mono font-bold text-gray-500">1U</span>
            <span className="text-[6px] font-mono font-bold text-gray-500">2U</span>
          </div>

          <div className="flex-1 flex items-center justify-between gap-3 z-10">
            {/* PSU + Power LEDs */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-psu-blink shadow-[0_0_4px_#fbbf24]" />
              </div>
              <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest">PSU</span>
            </div>

            {/* Left Vent Grilles */}
            <div className="flex-1 flex gap-[3px] opacity-20 h-1.5">
              {[...Array(20)].map((_, i) => (
                <div key={`l-${i}`} className="flex-1 max-w-[4px] h-full bg-black rounded-sm" />
              ))}
            </div>

            {/* Spinning Fans */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-300/80 rounded border border-gray-400/60 shadow-inner shrink-0">
              <FanSVG size={20} />
              <FanSVG size={20} />
              <FanSVG size={20} />
            </div>

            {/* Right Vent Grilles */}
            <div className="flex-1 flex gap-[3px] opacity-20 h-1.5 justify-end">
              {[...Array(20)].map((_, i) => (
                <div key={`r-${i}`} className="flex-1 max-w-[4px] h-full bg-black rounded-sm" />
              ))}
            </div>

            {/* Temp Gauge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest">TEMP</span>
              <div className="w-10 h-1.5 bg-gray-400/30 rounded-full overflow-hidden border border-gray-400/20">
                <div className="h-full bg-gradient-to-r from-green-500 to-amber-400 animate-temp-bar rounded-full" />
              </div>
            </div>
          </div>

          {/* Unit Markers - Right */}
          <div className="absolute right-[-8px] top-0 bottom-0 w-2 flex flex-col justify-around py-1.5 opacity-40 select-none">
            <span className="text-[6px] font-mono font-bold text-gray-500">1U</span>
            <span className="text-[6px] font-mono font-bold text-gray-500">2U</span>
          </div>
        </div>

        {/* Blades Container */}
        <div className="py-2 px-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-0.5">
            {certificatesData.map((cert, index) => {
              const isActive = activeBladeId === cert.id;
              // Prime-based offsets so each blade blinks at a different phase
              const hddDelay = `${(index * 137) % 1000}ms`;
              const nicDelay = `${(index * 73) % 800}ms`;

              return (
                <motion.div
                  key={cert.id}
                  layout
                  className={`group relative overflow-hidden rounded-sm transition-all duration-300 border-b border-gray-200 ${
                    isActive ? "z-10 scale-[1.012] md:col-span-2 shadow-xl" : "z-0"
                  }`}
                >
                  {/* Left accent strip — colored glow on active */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? cert.ledColor : "transparent",
                      boxShadow: isActive ? `0 0 8px ${cert.ledColor}, 0 0 2px ${cert.ledColor}` : "none",
                      opacity: isActive ? 1 : 0,
                    }}
                  />

                  {/* Blade Button */}
                  <button
                    onClick={() => toggleBlade(cert.id)}
                    onMouseEnter={() => handleMouseEnter(cert.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center h-[42px] pl-4 pr-3 gap-2.5 text-left transition-colors ${
                      isActive ? "bg-white" : "bg-gray-50 hover:bg-white"
                    }`}
                  >
                    {/* Mounting Screw */}
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 border border-gray-400 shadow-inner shrink-0" />

                    {/* Status LED */}
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${
                        isActive ? "animate-pulse" : "opacity-25"
                      }`}
                      style={{
                        backgroundColor: cert.ledColor,
                        boxShadow: isActive ? `0 0 10px ${cert.ledColor}, 0 0 4px ${cert.ledColor}` : "none",
                      }}
                    />

                    {/* HDD Activity LED (amber, rectangular) */}
                    <div
                      className="w-[3px] h-3.5 rounded-[1px] shrink-0 animate-hdd-blink"
                      style={{
                        backgroundColor: isActive ? "#f59e0b" : "#d1d5db",
                        animationDelay: hddDelay,
                        animationDuration: isActive ? "0.18s" : "2.4s",
                        boxShadow: isActive ? "0 0 5px #f59e0b" : "none",
                      }}
                    />

                    {/* NIC Link LED (green, round) */}
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0 animate-nic-blink"
                      style={{
                        backgroundColor: isActive ? "#22c55e" : "#d1d5db",
                        animationDelay: nicDelay,
                        animationDuration: isActive ? "0.5s" : "3.2s",
                        boxShadow: isActive ? "0 0 5px #22c55e" : "none",
                      }}
                    />

                    {/* Blade Title */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <p className="font-mono text-[10px] font-bold text-gray-700 tracking-tight truncate">
                        <span className="text-gray-400 mr-1.5">
                          SLOT_{String(certificatesData.length - index).padStart(2, "0")}
                        </span>
                        {cert.issuer.toUpperCase()}::{cert.title.replace(/\s+/g, "_").toUpperCase()}
                      </p>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {/* Port indicators */}
                        <div className="hidden sm:flex gap-[2px] items-center">
                          {[0, 1, 2].map((p) => (
                            <div
                              key={p}
                              className="w-[3px] h-[6px] rounded-[1px] transition-all duration-300"
                              style={{
                                backgroundColor:
                                  isActive && p === index % 3 ? "#3b82f6" : "#d1d5db",
                                boxShadow:
                                  isActive && p === index % 3 ? "0 0 4px #3b82f6" : "none",
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-gray-400 group-hover:text-blue-600 transition-colors uppercase">
                          {isActive ? "READ…" : "STBY"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="bg-gray-200 border-t border-blue-500/20 overflow-hidden"
                      >
                        {/* Eject rail scan */}
                        <div className="h-[2px] overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-scan-bar" />
                        </div>

                        <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
                          {/* Certificate Image with CRT overlay */}
                          <div className="relative w-full md:w-56 aspect-video rounded border border-gray-300 overflow-hidden bg-white shrink-0 shadow-inner">
                            {cert.image ? (
                              <Image
                                src={cert.image}
                                alt={cert.title}
                                fill
                                className="object-contain p-1 opacity-70 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                                  NO_IMG_LOADED
                                </span>
                              </div>
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

                            {/* Animated stat bars */}
                            <div className="flex gap-4 pt-1">
                              {(["AUTH", "SIG", "PKI"] as const).map((label, i) => (
                                <div key={label} className="flex flex-col gap-1">
                                  <span className="text-[7px] font-mono text-gray-400 uppercase">{label}</span>
                                  <div className="w-12 h-1 bg-gray-300 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full animate-stat-fill"
                                      style={{
                                        animationDelay: `${i * 80}ms`,
                                        width: `${[100, 85, 92][i]}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-5 mt-2">
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

        {/* BOTTOM PANEL */}
        <div className="relative h-8 bg-gray-200 border-t border-gray-300 px-4 flex items-center overflow-hidden">
          <div key={activeBladeId} className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-status-flash" />

          <div className="flex items-center justify-between w-full h-full font-mono text-[9px] tracking-tight">
            {/* Status ticker */}
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              {activeBladeId ? (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="text-blue-400/50">{">"}</span>
                  <span className="font-bold">READING:</span>
                  {certificatesData.find((c) => c.id === activeBladeId) && (
                    <span className="animate-typing-active">
                      {certificatesData.find((c) => c.id === activeBladeId)?.issuer.toUpperCase()}
                      ::
                      {certificatesData
                        .find((c) => c.id === activeBladeId)
                        ?.title.replace(/\s+/g, "_")
                        .toUpperCase()}
                    </span>
                  )}
                  <span className="w-1.5 h-3 bg-blue-500 animate-terminal-cursor ml-0.5" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="animate-marquee whitespace-nowrap">
                    {">"} CERT_VAULT_v2 — ALL SYSTEMS NOMINAL —— {">"} CERT_VAULT_v2 — ALL
                    SYSTEMS NOMINAL ——
                  </span>
                </div>
              )}
            </div>

            {/* Diagnostic indicators */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]" />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]"
                  style={{ animationDelay: "0.5s" }}
                />
                <span className="text-[8px] font-mono text-gray-400 uppercase opacity-50 ml-0.5">PSU</span>
              </div>
              <span className="flex items-center gap-1 text-[8px] font-mono text-gray-400 uppercase opacity-50">
                <div className="w-1 h-1 rounded-full bg-green-500/60" />
                LNK::UP
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[8px] font-mono text-gray-400 uppercase opacity-50">
                <div className="w-1 h-1 rounded-full bg-blue-500/60 animate-psu-blink" />
                CPU::MOD
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }

        @keyframes fan-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-fan-spin { animation: fan-spin 1.2s linear infinite; }

        @keyframes rack-scan {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.4; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-rack-scan { animation: rack-scan 7s ease-in-out infinite; }

        @keyframes hdd-blink {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 1; }
        }
        .animate-hdd-blink { animation: hdd-blink 2s ease-in-out infinite; }

        @keyframes nic-blink {
          0%, 88%, 100% { opacity: 0.15; }
          91%, 97%      { opacity: 1; }
        }
        .animate-nic-blink { animation: nic-blink 3s ease-in-out infinite; }

        @keyframes psu-blink {
          0%, 70%, 100% { opacity: 1; }
          80%           { opacity: 0.25; }
        }
        .animate-psu-blink { animation: psu-blink 2.5s ease-in-out infinite; }

        @keyframes temp-bar {
          0%, 100% { width: 42%; }
          50%      { width: 66%; }
        }
        .animate-temp-bar { animation: temp-bar 5s ease-in-out infinite; }

        @keyframes stat-fill {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        .animate-stat-fill { animation: stat-fill 0.5s ease-out forwards; }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 20s linear infinite; }

        @keyframes status-flash {
          0%   { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .animate-status-flash { animation: status-flash 0.4s ease-out forwards; }

        @keyframes terminal-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        .animate-terminal-cursor { animation: terminal-cursor 0.8s step-end infinite; }

        @keyframes scan-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan-bar { animation: scan-bar 2s linear infinite; }

        @keyframes typing-active {
          from { width: 0; }
          to   { width: 100%; }
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
