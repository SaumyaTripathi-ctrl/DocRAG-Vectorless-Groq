'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Sparkles, Brain, Cpu } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

const DOCUMENTS = [
  { id: 'pdf', label: 'PDF', color: 'bg-[#FF4B4B]', iconColor: 'text-[#FF4B4B]', orbitRadius: 280, speed: 20, delay: 0 },
  { id: 'docx', label: 'DOCX', color: 'bg-[#2B579A]', iconColor: 'text-[#2B579A]', orbitRadius: 220, speed: 25, delay: 2 },
  { id: 'pptx', label: 'PPTX', color: 'bg-[#D24726]', iconColor: 'text-[#D24726]', orbitRadius: 320, speed: 18, delay: 4 },
  { id: 'txt', label: 'TXT', color: 'bg-[#7E7E7E]', iconColor: 'text-[#7E7E7E]', orbitRadius: 250, speed: 22, delay: 6 },
];

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; duration: number; delay: number }[]>([]);
  
  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particles generation on client side
    const newParticles = [...Array(20)].map(() => ({
      x: Math.random() * 800 - 400,
      y: Math.random() * 800 - 400,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 10
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const sceneX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const sceneY = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  const bgGlowX = useTransform(springX, [-0.5, 0.5], [50, -50]);
  const bgGlowY = useTransform(springY, [-0.5, 0.5], [50, -50]);

  return (
    <section className="relative pt-40 pb-32 overflow-hidden min-h-screen flex items-center bg-[#F8F9FD]">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_50%)]" />
        <motion.div 
          style={{ x: bgGlowX, y: bgGlowY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-primary/10 via-purple-500/5 to-transparent blur-[120px] rounded-full" 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Headline Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Next-Gen Knowledge Intelligence</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-headline font-bold leading-[1.05] tracking-tight text-slate-900">
              Your Knowledge, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600">Supercharged.</span>
            </h1>
            <p className="text-xl text-slate-500 font-body leading-relaxed max-w-xl mx-auto">
              Upload complex documents and engage with a neural intelligence engine that understands context, citations, and deep structure.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group">
                Start Chatting Free
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Sparkles className="ml-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.span>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg gap-3 border-slate-200 text-slate-600 bg-white/50 backdrop-blur hover:bg-white hover:border-primary/20 transition-all">
                <PlayCircle className="w-6 h-6 text-primary" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Massive Animation Scene */}
          <motion.div 
            style={{ x: sceneX, y: sceneY }}
            className="relative w-full max-w-[900px] aspect-square flex items-center justify-center perspective-2000"
          >
            {/* Background Glow Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] border border-primary/10 rounded-full animate-[spin_60s_linear_infinite] opacity-50" />
              <div className="absolute w-[700px] h-[700px] border border-primary/5 rounded-full animate-[spin_100s_linear_infinite_reverse] opacity-30" />
            </div>

            {/* AI Cube - The Main Focal Point */}
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
                y: [0, -20, 0] 
              }}
              transition={{ 
                rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-20 w-80 h-80 preserve-3d"
            >
              {/* Main Cube Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-800 rounded-[3rem] shadow-[0_80px_160px_rgba(79,70,229,0.4)] border-white/20 border-t border-l flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
                
                {/* Internal Brain/Logo */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 flex flex-col items-center gap-4 text-white"
                >
                  <Brain className="w-32 h-32 drop-shadow-2xl" />
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-80">Neural Active</span>
                  </div>
                </motion.div>
                
                {/* Scanner Light Effect */}
                <motion.div 
                  animate={{ top: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-md"
                />
              </div>

              {/* Dynamic Reflection Shadow */}
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-16 bg-black/10 blur-[60px] rounded-full scale-x-125" />
            </motion.div>

            {/* Live AI Neural Stream Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-10 z-30 w-full max-w-sm"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary">PROCESSING</span>
                </div>
                <div className="space-y-2">
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-3 w-3/4 bg-slate-100 rounded-md" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="h-3 w-1/2 bg-slate-100 rounded-md" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    className="h-3 w-5/6 bg-slate-100 rounded-md" 
                  />
                </div>
              </div>
            </motion.div>

            {/* Orbiting Documents */}
            {isMounted && DOCUMENTS.map((doc, index) => (
              <motion.div
                key={doc.id}
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{
                  duration: doc.speed,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div 
                  style={{ width: doc.orbitRadius * 2 }}
                  className="flex items-center"
                >
                  <motion.div 
                    animate={{ 
                      rotate: [0, -360],
                      y: [0, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: doc.speed, repeat: Infinity, ease: "linear" },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                    }}
                    className="pointer-events-auto"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 5, y: -10 }}
                      className="w-14 h-18 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col group cursor-pointer transition-shadow hover:shadow-primary/20"
                    >
                      <div className={`h-5 ${doc.color} flex items-center justify-center`}>
                        <span className="text-[8px] font-bold text-white uppercase tracking-tighter">{doc.label}</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-2">
                        <FileText className={`w-7 h-7 ${doc.iconColor} group-hover:scale-110 transition-transform`} />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Floating Particles */}
            {isMounted && (
              <div className="absolute inset-0 pointer-events-none">
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full blur-[1px]"
                    initial={{ x: p.x, y: p.y, opacity: 0 }}
                    animate={{ 
                      y: [null, p.y - 150], 
                      opacity: [0, 0.4, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full -z-10" />
    </section>
  );
}
