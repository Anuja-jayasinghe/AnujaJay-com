"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ExternalLink, Github, FolderCode, Terminal, FileCode2, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "../../data/projects.json";
import { getOptimizedImagePath } from "@/lib/image-utils";

interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  liveUrl?: string;
  imagePath?: string;
}

export default function TerminalOne() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lockedProjectId, setLockedProjectId] = useState<string | null>(null);
  const [typedOutput, setTypedOutput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({ "tools": true, "web": true });
  const [isMobile, setIsMobile] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const miniProjects = projectsData.filter((p) => p.type === "mini");
  
  // Logical Grouping
  const TOOLS_IDS = ["nic-detail", "mouse-active", "ceb-management", "ranking-calc", "js-calculator", "project-mgmt"];
  const WEB_IDS = ["hangman", "ecoaction", "jaysync-lab"];

  const groupedProjects = {
    tools: miniProjects.filter(p => TOOLS_IDS.includes(p.id)),
    web: miniProjects.filter(p => WEB_IDS.includes(p.id))
  };

  const handleMouseEnter = (project: Project) => {
    if (lockedProjectId) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      setActiveProject(project);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!lockedProjectId) {
      setActiveProject(null);
    }
  };

  const handleClick = (project: Project) => {
    if (lockedProjectId === project.id) {
      setLockedProjectId(null);
    } else {
      setLockedProjectId(project.id);
      setActiveProject(project);
    }
  };

  const toggleDir = (dir: string) => {
    setExpandedDirs(prev => ({ ...prev, [dir]: !prev[dir] }));
  };

  useEffect(() => {
    if (!activeProject) {
      setTypedOutput("");
      return;
    }

    setIsTyping(true);
    setTypedOutput("");

    const payload = [
      `$ mount /dev/projects/${activeProject.id}.bin /mnt/preview`,
      `[  OK  ] Mounting filesystem...`,
      `[SYSTEM] OBJECT_NAME: ${activeProject.title.toUpperCase()}`,
      `[SOURCE] REPO: github.com/${activeProject.repoUrl.split('github.com/')[1]}`,
      ...(activeProject.liveUrl
        ? [`[REMOTE] URI:  ${activeProject.liveUrl.replace("https://", "")}`]
        : []),
      `[BINARY] STACK: ${activeProject.techStack.join(" // ")}`,
      `[MANIFEST_START]`,
      `${activeProject.description}`,
      `[EOF]`,
      ` `,
    ].join("\n");

    let currentIdx = 0;
    const interval = setInterval(() => {
      setTypedOutput(payload.slice(0, currentIdx + 1));
      currentIdx++;
      if (currentIdx === payload.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [activeProject]);

  return (
    <div className="w-full max-w-[1200px] mx-auto rounded-lg overflow-hidden border border-black/10 flex flex-col font-mono text-sm shadow-2xl bg-gray-100">

      {/* Window Chrome - Light Industrial */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-black/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-black/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-black/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-black/10" />
          <div className="flex items-center gap-2 ml-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <Terminal className="w-3 h-3" />
            <span>Project_Terminal_v4.2</span>
          </div>
        </div>
        <div className="text-[10px] text-green-500/30 font-bold">MODE: CRT_EMULATION_ON</div>
      </div>

      <div className="flex flex-col md:flex-row relative">
        
        {/* Sidebar: File Explorer */}
        <div className="w-full md:w-64 bg-gray-200 border-b md:border-b-0 md:border-r border-black/10 flex flex-col shrink-0 z-10">
          <div className="p-3 text-[10px] font-bold text-gray-400 tracking-widest flex items-center gap-2 uppercase border-b border-black/10">
            <FolderCode className="w-3.5 h-3.5" />
            SRC/LAB/PROJECTS
          </div>

          {/* Directory Rendering */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible py-2 custom-scrollbar no-scrollbar-md">
            {Object.entries(groupedProjects).map(([dir, items]) => (
              <div key={dir} className="flex flex-row md:flex-col shrink-0 md:shrink-1 items-center md:items-stretch border-r md:border-r-0 border-black/5 last:border-r-0">
                <button 
                  onClick={() => toggleDir(dir)}
                  className="flex items-center gap-1.5 px-3 py-1 text-gray-500 hover:text-gray-700 text-[10px] md:text-xs transition-colors shrink-0 whitespace-nowrap"
                >
                  {expandedDirs[dir] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span className="uppercase tracking-tighter font-black">📁 {dir}/</span>
                </button>
                
                <AnimatePresence initial={false}>
                  {(expandedDirs[dir] || isMobile) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex md:flex-col overflow-visible shrink-0"
                    >
                      {items.map((project) => (
                        <button
                          key={project.id}
                          onMouseEnter={() => handleMouseEnter(project)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleClick(project)}
                          className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-1.5 shrink-0 text-left transition-all duration-200 group relative min-w-fit ${activeProject?.id === project.id
                              ? "text-blue-600 bg-blue-500/5 shadow-inner"
                              : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                            }`}
                        >
                          {lockedProjectId === project.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                          )}
                          <FileCode2 className={`w-3 h-3 shrink-0 ${activeProject?.id === project.id ? "text-blue-500" : "text-gray-400"}`} />
                          <span className="text-[11px] font-bold whitespace-nowrap">{project.id.toLowerCase()}.bin</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Main Window: Terminal Output */}
        <div className="flex-1 bg-gray-900 flex flex-col min-h-[350px] md:min-h-[500px] relative overflow-hidden">
          
          {/* CRT Overlay Effects */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Scanlines */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
            {/* Screen Flicker */}
            <div className="absolute inset-0 opacity-[0.015] bg-white animate-flicker pointer-events-none" />
          </div>

          <div className="p-4 md:p-8 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
            {!activeProject ? (
              <div className="h-full flex flex-col justify-center items-center select-none gap-4">
                <Terminal className="w-16 h-16 text-green-500/10 animate-pulse" />
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[10px] text-green-500/30 uppercase tracking-[0.2em] font-bold">System_Idle</span>
                  <span className="text-[10px] text-gray-700 max-w-[200px]">SELECT A SOURCE BINARY FROM THE LEFT TO INITIATE SEQUENCE</span>
                </div>
              </div>
            ) : (
              <div className="max-w-[800px]">
                {/* Typed output with industrial syntax colouring */}
                <pre className="whitespace-pre-wrap font-mono text-[10px] md:text-xs leading-relaxed pb-8 terminal-glow">
                  {typedOutput.split("\n").map((line, i) => {
                    if (line.startsWith("$"))
                      return <span key={i} className="text-blue-400 font-bold">{line}{"\n"}</span>;
                    if (line.startsWith("[  OK  ]"))
                       return <span key={i} className="text-green-400 font-bold tracking-tighter "><span className="text-white/10">[</span>  OK  <span className="text-white/20">]</span> {line.split('OK  ] ')[1]}{"\n"}</span>;
                    if (line.startsWith("[SYSTEM]") || line.startsWith("[BINARY]"))
                      return <span key={i} className="text-cyan-400 font-bold">{line}{"\n"}</span>;
                    if (line.startsWith("[SOURCE]") || line.startsWith("[REMOTE]"))
                      return <span key={i} className="text-blue-300/80">{line}{"\n"}</span>;
                    if (line.startsWith("[MANIFEST"))
                      return <span key={i} className="text-gray-400 font-black tracking-widest block bg-white/5 px-2 py-0.5 my-2 uppercase">{line}{"\n"}</span>;
                    if (line.startsWith("[EOF]") || line.startsWith("[EOF]"))
                      return <span key={i} className="text-gray-500 italic">{line}{"\n"}</span>;
                    return <span key={i} className="text-blue-200/70">{line}{"\n"}</span>;
                  })}
                  {isTyping && (
                    <span className="inline-block w-2.5 h-4 ml-1 bg-blue-500 animate-terminal-cursor align-middle shadow-[0_0_8px_#3b82f6]" />
                  )}
                </pre>

                {/* Post-typing actions: Assets & Links */}
                <AnimatePresence>
                  {!isTyping && activeProject && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex flex-col md:flex-row gap-8 py-6 border-t border-white/5"
                    >
                      {activeProject.imagePath ? (
                        <div className="relative w-full md:w-64 overflow-hidden rounded border border-white/10 shrink-0 aspect-video group/img">
                          <Image
                            src={getOptimizedImagePath(activeProject.imagePath)}
                            alt={activeProject.title}
                            fill
                            className="object-cover opacity-70 group-hover/img:opacity-100 transition-opacity duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
                        </div>
                      ) : (
                        <div className="w-full md:w-64 h-36 bg-white/[0.05] rounded border border-white/5 flex items-center justify-center text-gray-500 italic text-[10px] shrink-0 uppercase tracking-widest">
                          [ Null_Asset_Record ]
                        </div>
                      )}

                      <div className="flex flex-col gap-4 justify-center">
                        <div className="space-y-1">
                          <span className="text-[9px] text-gray-600 uppercase font-black tracking-tighter">Repository_Access</span>
                          <a
                            href={activeProject.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 text-gray-400 hover:text-white transition-all text-xs font-bold group/link"
                          >
                            <Github className="w-4 h-4 text-gray-600 group-hover/link:text-white transition-colors" />
                            <span className="border-b border-transparent group-hover/link:border-white">
                              anujajay://repo/{activeProject.id}
                            </span>
                          </a>
                        </div>

                        {activeProject.liveUrl && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Remote_Deployment</span>
                            <a
                              href={activeProject.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 text-blue-400 hover:text-blue-200 transition-all text-xs font-bold group/link"
                            >
                              <ExternalLink className="w-4 h-4 text-blue-500 group-hover/link:text-blue-200 transition-colors" />
                              <span className="border-b border-transparent group-hover/link:border-blue-200">
                                execute https://{activeProject.liveUrl.replace("https://", "")}
                              </span>
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .terminal-glow {
          text-shadow: 0 0 5px rgba(59, 130, 246, 0.4);
        }
        .no-scrollbar-md::-webkit-scrollbar {
          display: block;
        }
        @media (min-width: 768px) {
          .no-scrollbar-md::-webkit-scrollbar {
            display: none;
          }
        }
        @keyframes flicker {
          0% { opacity: 0.015; }
          5% { opacity: 0.02; }
          10% { opacity: 0.01; }
          15% { opacity: 0.03; }
          25% { opacity: 0.015; }
          30% { opacity: 0.025; }
          100% { opacity: 0.015; }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
}
