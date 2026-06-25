"use client";
import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Send,
  Wifi,
  Cpu,
  Settings,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  Database
} from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  useEffect(() => {
    if (status === "sending") {
      const logs = [
        "ESTABLISHING_LINK... OK",
        "AUTHENTICATING_UPLINK... OK",
        "ENCRYPTING_PAYLOAD... OK",
        "ROUTING_TO_COMMS_HUB... STANDBY"
      ];
      let currentIdx = 0;
      const timer = setInterval(() => {
        if (currentIdx < logs.length) {
          setDiagnosticLogs(prev => [...prev, logs[currentIdx]]);
          currentIdx++;
        } else {
          clearInterval(timer);
        }
      }, 600);
      return () => clearInterval(timer);
    } else {
      setDiagnosticLogs([]);
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => setStatus("success"), 2500);
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.message || "UPLINK_FAILURE: INVALID_RESPONSE");
      }
    } catch {
      setStatus("error");
      setErrorMsg("UPLINK_FAILURE: NETWORK_DISCONNECT");
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Section Header with Industrial Detailing */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-0.5 flex-1 bg-gray-200" />
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="font-mono text-sm font-black tracking-[0.3em] uppercase text-gray-400">
              COMMS_CHANNEL::01
            </h2>
          </div>
          <div className="h-0.5 flex-1 bg-gray-200" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left Side: Diagnostic Display & Socials */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h3 className="text-4xl font-black text-gray-900 leading-none mb-4 uppercase tracking-tighter">
                Initiate<br /><span className="text-blue-600">Broadcast.</span>
              </h3>
              <p className="text-gray-500 font-mono text-xs uppercase leading-relaxed tracking-tight">
                Establishing point-to-point secure transmission. My inbox is open for collaborations, research, or system inquiries.
              </p>
            </div>

            {/* System Status Dashboard */}
            <div className="bg-gray-100/50 rounded border border-gray-200 p-4 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold text-gray-400">HUB_STATUS</span>
                <span className="font-mono text-[9px] font-bold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ONLINE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-gray-100 flex flex-col gap-1">
                  <Wifi size={10} className="text-gray-400" />
                  <span className="font-mono text-[8px] text-gray-500 uppercase">Uplink</span>
                  <span className="font-mono text-[9px] font-bold text-gray-900 uppercase">1.2 Gbps</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-100 flex flex-col gap-1">
                  <Database size={10} className="text-gray-400" />
                  <span className="font-mono text-[8px] text-gray-500 uppercase">Storage</span>
                  <span className="font-mono text-[9px] font-bold text-gray-900 uppercase">32% AVIL</span>
                </div>
              </div>
            </div>

            {/* Social Links - EMERGENCY_CHANNELS */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest block">EMERGENCY_CHANNELS</span>
              <div className="flex gap-2">
                {[
                  { icon: <Github size={18} />, href: "https://github.com/Anuja-jayasinghe", label: "GH" },
                  { icon: <Linkedin size={18} />, href: "https://linkedin.com/in/anuja-jayasinghe", label: "LI" },
                  { icon: <Mail size={18} />, href: "mailto:anujajayasinhe@gmail.com", label: "EM" }
                ].map((channel, i) => (
                  <a
                    key={i}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
                  >
                    <div className="group-hover:scale-110 transition-transform">{channel.icon}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: High-Fidelity Communication Chassis */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-100 rounded-lg border-[10px] border-gray-200 shadow-2xl shadow-black/5 overflow-hidden relative">

              {/* Chassis Top Bar */}
              <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center px-4 justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shadow-inner" />
                  <span className="font-mono text-[9px] font-bold text-gray-500 flex items-center gap-1">
                    <Settings size={10} className="animate-spin-slow" /> ENCRYPTION_MODULE_v4.2
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-4 h-1 bg-gray-400 rounded-full opacity-30" />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-10">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6 shadow-inner border border-blue-100">
                      <Send className="w-10 h-10 text-blue-600 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-black font-mono text-gray-900 mb-2 uppercase tracking-tight">Transmission_Stable</h3>
                    <p className="text-gray-500 font-mono text-[10px] mb-8 uppercase">PAYLOAD SUCCESSFULLY DELIVERED TO THE HUB.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="bg-blue-600 text-white font-mono text-[10px] font-black px-10 py-4 rounded-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                      OPEN_NEW_LINK
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative">
                    {/* Background CRT Scanline Effect for inputs */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="name" className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <ChevronRight size={10} className="text-blue-500" /> COM_ID::NAME
                        </label>
                        <div className="relative group/field">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            disabled={status === "sending"}
                            suppressHydrationWarning // browser autofill extensions inject attrs post-hydration
                            className="w-full bg-gray-200 border border-gray-300 rounded-sm px-4 py-4 text-accent font-mono font-bold text-xs focus:outline-none focus:border-accent transition-all placeholder:text-gray-400 shadow-inner"
                            placeholder="ENTER_SENDER_IDENTITY..."
                          />
                          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-blue-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="email" className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <ChevronRight size={10} className="text-blue-500" /> LINK_ADDR::EMAIL
                        </label>
                        <div className="relative group/field">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            disabled={status === "sending"}
                            suppressHydrationWarning // browser autofill extensions inject attrs post-hydration
                            className="w-full bg-gray-200 border border-gray-300 rounded-sm px-4 py-4 text-accent font-mono font-bold text-xs focus:outline-none focus:border-accent transition-all placeholder:text-gray-400 shadow-inner"
                            placeholder="ENTER_CONTACT_UPLINK..."
                          />
                          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-blue-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="message" className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ChevronRight size={10} className="text-blue-500" /> RAW_DATA::PAYLOAD
                      </label>
                      <div className="relative group/field">
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          disabled={status === "sending"}
                          suppressHydrationWarning // browser autofill extensions inject attrs post-hydration
                          className="w-full bg-gray-200 border border-gray-300 rounded-sm px-4 py-4 text-accent font-mono font-bold text-xs focus:outline-none focus:border-accent transition-all resize-none placeholder:text-gray-400 shadow-inner"
                          placeholder="ENCODE_YOUR_MESSAGE_HERE..."
                        />
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-blue-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                      </div>
                    </div>

                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-950/20 border border-red-500/30 rounded-sm px-4 py-3 text-red-500 text-[10px] font-mono uppercase font-black"
                      >
                        {errorMsg}
                      </motion.div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6 mt-10">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="flex-1 bg-blue-600 text-white font-mono text-[11px] font-black py-5 px-8 rounded-sm hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden active:scale-[0.98]"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shimmer pointer-events-none" />
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          {status === "sending" ? (
                            <>
                              <Cpu className="animate-spin h-4 w-4" />
                              BROADCASTING_...
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              BROADCAST_MESSAGE
                            </>
                          )}
                        </div>
                      </button>

                      {/* Diagnostic Output (Only visible during transmission) */}
                      <AnimatePresence>
                        {status === "sending" && (
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="flex-1 bg-gray-900 border border-blue-500/20 rounded-sm p-4 font-mono text-[8px] space-y-1 overflow-hidden h-[60px]"
                          >
                            {diagnosticLogs.map((log, i) => (
                              <div key={i} className="text-blue-500/80 tracking-tighter">
                                <span className="text-blue-500/20 mr-2">[{i.toString().padStart(2, '0')}]</span>
                                {log}
                              </div>
                            ))}
                            <div className="w-1 h-3 bg-blue-500 animate-terminal-cursor" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                )}
              </div>

              {/* Industrial Mounting Detail */}
              <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-20">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                }
                .animate-shimmer {
                    animation: shimmer 2s linear infinite;
                }
            `}</style>
    </section>
  );
}