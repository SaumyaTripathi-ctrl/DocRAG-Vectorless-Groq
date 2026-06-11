'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, ChevronRight, MessageSquare, Database } from 'lucide-react';

const DOCS = [
  { type: 'PDF', color: 'text-red-400', orbitSpeed: 20, radius: 140, delay: 0 },
  { type: 'DOCX', color: 'text-blue-400', orbitSpeed: 28, radius: 180, delay: 1.5 },
  { type: 'PPTX', color: 'text-orange-400', orbitSpeed: 24, radius: 220, delay: 3 },
  { type: 'TXT', color: 'text-zinc-400', orbitSpeed: 32, radius: 160, delay: 0.8 },
];

const TRY_PROMPTS = [
  "Summarize this report",
  "Extract key findings",
  "Compare documents"
];

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden mesh-gradient faint-grid">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Grade Intelligence</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-headline font-bold leading-[1.1] text-white tracking-tight max-w-xl">
              Chat With Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">Documents</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs and get instant, verifiable answers with precise source citations from your private knowledge base.
            </p>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-105">
                  Start Chatting Free
                </Button>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Try asking:</span>
                <div className="flex flex-wrap gap-2">
                  {TRY_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs text-zinc-400 transition-colors hover:text-white"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Secure Formats</span>
              <div className="flex gap-4 items-center opacity-40">
                {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                  <span key={ext} className="text-[10px] font-bold text-white">{ext}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Visual */}
          <div className="relative h-[650px] hidden lg:flex items-center justify-center">
            {/* Background Orbit Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              {[140, 180, 220].map((r, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full border border-primary/40"
                  style={{ width: r * 2, height: r * 2 }}
                />
              ))}
            </div>

            {/* AI Core Pulse */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute w-32 h-32 bg-primary rounded-full blur-3xl pointer-events-none"
            />

            {/* AI Core */}
            <motion.div
              style={{ x: mousePos.x, y: mousePos.y }}
              className="relative z-20 w-48 h-48 bg-zinc-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]"
              >
                {/* Modern AI Symbol (Hex Node) */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </motion.div>
              
              {/* Answer Preview Card */}
              <div className="absolute -right-24 -top-8 pointer-events-none">
                <FloatingAnswerPreview />
              </div>
            </motion.div>

            {/* Orbiting Docs */}
            {DOCS.map((doc, i) => (
              <OrbitingDoc key={i} {...doc} mousePos={mousePos} />
            ))}

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
              <FloatingParticle key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitingDoc({ type, color, orbitSpeed, radius, delay, mousePos }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{ 
        opacity: { delay, duration: 1 },
        rotate: { duration: orbitSpeed, repeat: Infinity, ease: "linear" }
      }}
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        x: mousePos.x * 0.4,
        y: mousePos.y * 0.4,
      }}
      className="flex items-start justify-center"
    >
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
        className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl flex flex-col items-center gap-1 group"
      >
        <FileText className={`w-6 h-6 ${color} group-hover:scale-110 transition-transform`} />
        <span className={`text-[8px] font-bold ${color} opacity-60`}>{type}</span>
      </motion.div>
    </motion.div>
  );
}

function FloatingParticle() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPos({ x: Math.random() * 800 - 400, y: Math.random() * 800 - 400 });
  }, []);

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.1, 0.4, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
      style={{ left: `50%`, top: `50%`, x: pos.x, y: pos.y }}
      className="absolute w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
    />
  );
}

function FloatingAnswerPreview() {
  const [step, setStep] = useState(0);
  const scenarios = [
    { text: "Revenue increased by 23%", src: "Source: Page 12" },
    { text: "AES-256 data encryption", src: "Source: Security.pdf" },
    { text: "Sarah Chen is AI Head", src: "Source: Team.docx" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % scenarios.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-48 shadow-2xl space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Live Insight</span>
        </div>
        <p className="text-white text-[11px] font-medium leading-relaxed">"{scenarios[step].text}"</p>
        <span className="inline-block text-primary text-[9px] font-bold">
          {scenarios[step].src}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
