'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Play, Sparkles, Brain } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const FLOATING_DOCS = [
  { id: 1, type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', x: -140, y: -100, delay: 0 },
  { id: 2, type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', x: 160, y: -60, delay: 0.5 },
  { id: 3, type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', x: -120, y: 140, delay: 1 },
  { id: 4, type: 'TXT', color: 'text-slate-500', bg: 'bg-slate-50', x: 150, y: 160, delay: 1.5 },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden premium-gradient-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wide uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New: Support for large CSV datasets</span>
            </motion.div>
            
            <h1 className="text-6xl lg:text-8xl font-headline font-bold leading-[1] text-slate-900 tracking-tight">
              Chat With Your <br />
              <span className="text-primary italic">Documents</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs to get instant, accurate answers from your own knowledge base in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                Start Chatting Free
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-semibold gap-2 border-slate-200 hover:bg-slate-50 transition-all">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Supported formats</span>
              <div className="flex gap-4 items-center">
                {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                  <span key={ext} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-default">{ext}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Animated Visual */}
          <div className="flex-1 relative w-full max-w-[600px] h-[600px] flex items-center justify-center">
            {/* Background Glow */}
            <motion.div 
              animate={{ 
                x: mousePos.x * -0.5,
                y: mousePos.y * -0.5,
                scale: [1, 1.1, 1]
              }}
              transition={{ scale: { duration: 8, repeat: Infinity } }}
              className="absolute w-[450px] h-[450px] bg-primary/10 blur-[100px] rounded-full"
            />

            {/* AI Core Box */}
            <motion.div
              style={{
                x: mousePos.x,
                y: mousePos.y,
                rotateY: mousePos.x * 0.5,
                rotateX: mousePos.y * -0.5,
              }}
              className="relative z-10 w-56 h-56 glass-morphism rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/50"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
              <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40 relative overflow-hidden group">
                <Brain className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>

            {/* Floating Documents */}
            {FLOATING_DOCS.map((doc) => (
              <motion.div
                key={doc.id}
                style={{
                  x: doc.x + mousePos.x * 2,
                  y: doc.y + mousePos.y * 2,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  y: [doc.y, doc.y - 15, doc.y],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  opacity: { delay: doc.delay, duration: 0.5 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: doc.delay },
                  rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: doc.delay }
                }}
                className={`absolute w-16 h-20 ${doc.bg} rounded-2xl border border-white shadow-xl flex flex-col p-2.5 backdrop-blur-sm group hover:scale-110 transition-transform`}
              >
                <div className={`h-1.5 w-10 rounded-full ${doc.color.replace('text', 'bg')} opacity-20 mb-2`} />
                <div className="flex-1 flex items-center justify-center">
                  <FileText className={`w-8 h-8 ${doc.color}`} />
                </div>
                <span className={`text-[8px] font-bold ${doc.color} text-center mt-1 opacity-60`}>{doc.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
