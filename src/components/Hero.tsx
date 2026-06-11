'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Brain, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';

const DOCS = [
  { type: 'PDF', color: 'text-red-400', orbitSpeed: 15, radius: 120, delay: 0 },
  { type: 'DOCX', color: 'text-blue-400', orbitSpeed: 25, radius: 160, delay: 1 },
  { type: 'PPTX', color: 'text-orange-400', orbitSpeed: 20, radius: 200, delay: 2 },
  { type: 'TXT', color: 'text-zinc-400', orbitSpeed: 30, radius: 140, delay: 0.5 },
];

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden mesh-gradient faint-grid">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligence at Scale</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-headline font-bold leading-[1.1] text-white tracking-tight max-w-xl">
              Chat With Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Documents</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs and get instant, verifiable answers with precise source citations from your private knowledge base.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all hover:scale-105">
                Start Chatting Free
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-white/10 hover:bg-white/5 gap-2 group transition-all">
                Watch Demo
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Live Demo Card */}
            <div className="pt-4">
              <LiveDemoCard />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Enterprise Secure</span>
              <div className="flex gap-4 items-center opacity-40">
                {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                  <span key={ext} className="text-[10px] font-bold text-white">{ext}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Visual */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            {/* AI Core */}
            <motion.div
              style={{ x: mousePos.x, y: mousePos.y }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="relative z-20 w-56 h-56 bg-zinc-900/50 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Orbiting Docs */}
            {DOCS.map((doc, i) => (
              <OrbitingDoc key={i} {...doc} mousePos={mousePos} />
            ))}

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
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
        x: mousePos.x * 0.5,
        y: mousePos.y * 0.5,
      }}
      className="flex items-start justify-center"
    >
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
        className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl flex flex-col items-center gap-1"
      >
        <FileText className={`w-6 h-6 ${color}`} />
        <span className={`text-[8px] font-bold ${color} opacity-60`}>{type}</span>
      </motion.div>
    </motion.div>
  );
}

function FloatingParticle() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    setPos({ x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500 });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.1, 0.4, 0.1],
        y: [0, -30, 0],
        x: [0, 20, 0]
      }}
      transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
      style={{ left: `50%`, top: `50%`, x: pos.x, y: pos.y }}
      className="absolute w-1 h-1 bg-primary rounded-full"
    />
  );
}

function LiveDemoCard() {
  const [step, setStep] = useState(0);
  const scenarios = [
    { q: "What is the revenue growth?", a: "Revenue grew 23% YoY.", src: "Source: Page 12" },
    { q: "Who leads the AI team?", a: "Sarah Chen is the Head of AI.", src: "Source: Page 4" },
    { q: "Is the data encrypted?", a: "Yes, AES-256 at rest.", src: "Source: Security.pdf" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % scenarios.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 max-w-sm shadow-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-widest uppercase">
            <MessageSquare className="w-3 h-3" />
            <span>Interactive Demo</span>
          </div>
          <p className="text-white font-semibold text-sm italic">"{scenarios[step].q}"</p>
          <div className="space-y-2">
            <p className="text-zinc-400 text-xs leading-relaxed">{scenarios[step].a}</p>
            <span className="inline-block bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold">
              {scenarios[step].src}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}