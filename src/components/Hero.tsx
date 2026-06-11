'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const DOCS = [
  { type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', startX: -600, startY: -300, rotate: -25, floatDelay: 0 },
  { type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', startX: 600, startY: -200, rotate: 20, floatDelay: 0.5 },
  { type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', startX: -500, startY: 300, rotate: -15, floatDelay: 1 },
  { type: 'TXT', color: 'text-zinc-500', bg: 'bg-zinc-50', startX: 550, startY: 250, rotate: 10, floatDelay: 1.5 },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const mergeProgress = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const verticalProgress = useTransform(scrollYProgress, [0.4, 1], [0, 800]);
  const opacityProgress = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex items-center overflow-hidden bg-mesh">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }}
          className="max-w-3xl space-y-8"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-7xl font-headline font-bold leading-[1.05] text-zinc-900 tracking-tight"
          >
            Chat With Your <br />
            <span className="text-indigo-600">Documents.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-zinc-500 max-w-lg mx-auto leading-relaxed font-medium"
          >
            Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-8 pt-6"
          >
            {['PDF', 'DOCX', 'PPTX', 'TXT'].map(f => (
              <span key={f} className="text-xs font-bold text-zinc-900 tracking-widest">{f}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Distributed Documents that gather and merge */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {DOCS.map((doc, i) => (
            <motion.div
              key={i}
              style={{
                x: useTransform(mergeProgress, (v) => (v * doc.startX) + (1 - v) * mousePos.x),
                y: useTransform(mergeProgress, (v) => (v * doc.startY) + (1 - v) * mousePos.y),
                translateY: verticalProgress,
                rotate: useTransform(mergeProgress, (v) => v * doc.rotate),
                opacity: opacityProgress,
                scale: useTransform(mergeProgress, (v) => 0.8 + (1 - v) * 0.2),
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 0.8,
                y: [0, -15, 0],
              }}
              transition={{ 
                opacity: { duration: 1.2, delay: 0.8 + i * 0.1 },
                scale: { duration: 1.2, delay: 0.8 + i * 0.1 },
                y: { 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: doc.floatDelay 
                }
              }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              className={`absolute w-44 h-56 ${doc.bg} border border-zinc-200/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 backdrop-blur-sm`}
            >
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
                <FileText className={`w-8 h-8 ${doc.color}`} />
              </div>
              <span className={`text-[10px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}