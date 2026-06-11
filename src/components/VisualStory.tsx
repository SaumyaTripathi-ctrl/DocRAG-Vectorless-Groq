'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Brain, FileText, Sparkles, Send, BrainCircuit, Quote, History, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DOCUMENTS = [
  { id: 'pdf', label: 'PDF', color: 'bg-red-500', iconColor: 'text-red-500', angle: 0 },
  { id: 'docx', label: 'DOCX', color: 'bg-blue-500', iconColor: 'text-blue-500', angle: 90 },
  { id: 'pptx', label: 'PPTX', color: 'bg-orange-500', iconColor: 'text-orange-500', angle: 180 },
  { id: 'txt', label: 'TXT', color: 'bg-slate-500', iconColor: 'text-slate-500', angle: 270 },
];

export function VisualStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [chatAnswer, setChatAnswer] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<{x: number, y: number, duration: number, delay: number}[]>([]);

  const fullAnswer = "Based on the internal quarterly audit, revenue growth is up by 18.4% year-over-year. The primary drivers are the expansion into the APAC market and a 12% increase in retention among enterprise tier customers. Operational costs have stabilized since Q2.";

  // Phases:
  // Phase 1: Orbit (0 - 0.25)
  // Phase 2: Absorption (0.25 - 0.4)
  // Phase 3: Core Expansion & Open (0.4 - 0.6)
  // Phase 4: Chat Reveal (0.6 - 0.8)
  // Phase 5: Dashboard State (0.8 - 1.0)

  const coreScale = useTransform(scrollYProgress, [0, 0.25, 0.4, 0.6], [1, 1.1, 1.3, 2.5]);
  const coreRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const coreOpacity = useTransform(scrollYProgress, [0.6, 0.7], [1, 0.1]);
  const coreY = useTransform(scrollYProgress, [0.7, 1], [0, -400]);

  const docOrbitRadius = useTransform(scrollYProgress, [0, 0.25, 0.4], [300, 300, 0]);
  const docOpacity = useTransform(scrollYProgress, [0.35, 0.4], [1, 0]);
  const docScale = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);

  const chatContainerOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const chatContainerY = useTransform(scrollYProgress, [0.65, 0.75], [100, 0]);
  const chatContainerScale = useTransform(scrollYProgress, [0.75, 0.9], [0.9, 1]);

  const dashboardOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const dashboardY = useTransform(scrollYProgress, [0.85, 1], [50, 0]);

  useEffect(() => {
    setIsMounted(true);
    setParticles([...Array(30)].map(() => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10
    })));
  }, []);

  // Typing effect trigger
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.78) {
        let i = 0;
        const interval = setInterval(() => {
          setChatAnswer(fullAnswer.slice(0, i));
          i++;
          if (i > fullAnswer.length) clearInterval(interval);
        }, 20);
        return () => clearInterval(interval);
      } else {
        setChatAnswer("");
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-background">
      {/* Sticky Scene Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        
        {/* Futuristic Background */}
        <div className="absolute inset-0 futuristic-grid -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-background to-background -z-10" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {isMounted && particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ x: p.x, y: p.y }}
              animate={{
                y: [null, -1000],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay
              }}
            />
          ))}
        </div>

        {/* The Scene */}
        <div className="relative w-full h-full flex items-center justify-center perspective-2000">
          
          {/* AI CORE */}
          <motion.div
            style={{ 
              scale: coreScale, 
              rotateY: coreRotation,
              opacity: coreOpacity,
              y: coreY
            }}
            className="relative z-20 w-80 h-80 preserve-3d"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-purple-600/40 to-indigo-900/40 glass-morphism rounded-full core-glow flex items-center justify-center border border-white/20">
              <BrainCircuit className="w-32 h-32 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              
              {/* Internal Pulse */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full"
              />
            </div>
          </motion.div>

          {/* ORBITING DOCUMENTS */}
          <AnimatePresence>
            {DOCUMENTS.map((doc, i) => (
              <motion.div
                key={doc.id}
                style={{ 
                  opacity: docOpacity,
                  scale: docScale
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 2 }}
                  className="flex items-center"
                  style={{ width: docOrbitRadius.get() * 2 }}
                >
                  <motion.div 
                    style={{ rotate: -360 }}
                    className="w-16 h-20 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                  >
                    <div className={`h-4 ${doc.color}`} />
                    <div className="flex-1 flex items-center justify-center p-2">
                      <FileText className={`w-8 h-8 ${doc.iconColor}`} />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* CHAT INTERFACE OVERLAY */}
          <motion.div
            style={{ 
              opacity: chatContainerOpacity,
              y: chatContainerY,
              scale: chatContainerScale,
              pointerEvents: scrollYProgress.get() > 0.8 ? 'auto' : 'none'
            }}
            className="absolute z-30 w-full max-w-4xl h-[600px] glass-morphism rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">DocuMind AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/50 font-medium">Processing active context</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-sm text-sm max-w-[80%] shadow-lg">
                  What are the key findings from the internal quarterly report?
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl rounded-tl-sm text-sm max-w-[90%] space-y-4">
                  <p className="leading-relaxed text-white/90">
                    {chatAnswer}
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle" />
                  </p>

                  {/* Sources Preview */}
                  <AnimatePresence>
                    {chatAnswer.length > 50 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4 border-t border-white/10 flex flex-wrap gap-3"
                      >
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white/60">
                          <Quote className="w-3 h-3" />
                          <span>Q4_Report.pdf • Page 12</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white/60">
                          <Quote className="w-3 h-3" />
                          <span>Audit_Findings.docx • Page 3</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Chat Input Area */}
            <div className="p-8 pt-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex gap-2">
                <Input 
                  disabled
                  placeholder="Ask a follow up question..." 
                  className="bg-transparent border-none text-white focus-visible:ring-0"
                />
                <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* DASHBOARD ELEMENTS (FADE IN LATER) */}
          <motion.div
            style={{ 
              opacity: dashboardOpacity,
              y: dashboardY,
              pointerEvents: scrollYProgress.get() > 0.9 ? 'auto' : 'none'
            }}
            className="absolute bottom-10 left-10 right-10 flex justify-between gap-10"
          >
            {/* Left sidebar mock */}
            <div className="w-64 space-y-4 hidden xl:block">
              <div className="h-4 w-32 bg-white/10 rounded mb-8" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-3">
                  <div className="w-4 h-4 bg-white/10 rounded" />
                  <div className="h-2 flex-1 bg-white/10 rounded" />
                </div>
              ))}
            </div>

            {/* Right sources mock */}
            <div className="w-80 space-y-4 hidden 2xl:block">
              <div className="h-4 w-32 bg-white/10 rounded mb-8" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-2 w-20 bg-primary/20 rounded" />
                    <div className="h-2 w-8 bg-white/10 rounded" />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-3/4 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Hero Overlay Content (Step 0) */}
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-40 pointer-events-none">
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Next-Gen Information Intelligence</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-headline font-bold leading-tight text-white max-w-5xl mx-auto">
            Documents to Knowledge, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">Instantly.</span>
          </h1>
          <p className="text-xl text-white/40 max-w-xl mx-auto font-body">
            Watch your static data transform into interactive intelligence. Scroll to see the magic happen.
          </p>
          <div className="flex justify-center gap-4 pointer-events-auto">
             <Button size="lg" className="rounded-full px-12 h-16 bg-primary text-lg font-bold">Start Chatting Free</Button>
          </div>
        </motion.div>
      </div>

      {/* Background Glow */}
      <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-primary/10 to-transparent pointer-events-none -z-20" />
    </div>
  );
}
