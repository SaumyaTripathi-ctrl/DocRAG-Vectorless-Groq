'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const DOCS = [
  { type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', top: '15%', left: '10%', rotate: -15, delay: 0.2 },
  { type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', top: '20%', right: '12%', rotate: 12, delay: 0.4 },
  { type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', bottom: '25%', left: '15%', rotate: -8, delay: 0.6 },
  { type: 'TXT', color: 'text-zinc-500', bg: 'bg-zinc-50', bottom: '20%', right: '10%', rotate: 10, delay: 0.8 },
];

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh pt-16">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now in Beta
          </motion.div>

          <h1 className="text-6xl lg:text-7xl font-headline font-bold leading-[1.1] text-zinc-900 tracking-tight">
            Chat With Your <br />
            <span className="text-indigo-600">Documents.</span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-lg mx-auto leading-relaxed font-medium">
            Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-8 pt-12 opacity-40">
            {['PDF', 'DOCX', 'PPTX', 'TXT'].map(f => (
              <span key={f} className="text-xs font-bold text-zinc-900 tracking-widest">{f}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Decorative Documents */}
      <div className="absolute inset-0 pointer-events-none">
        {DOCS.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: mousePos.x * (i + 1) * 0.2,
              translateY: mousePos.y * (i + 1) * 0.2
            }}
            transition={{ 
              opacity: { duration: 1, delay: doc.delay },
              scale: { duration: 1, delay: doc.delay },
              y: { duration: 1, delay: doc.delay },
              x: { type: "spring", stiffness: 50, damping: 20 },
              translateY: { type: "spring", stiffness: 50, damping: 20 }
            }}
            style={{
              position: 'absolute',
              top: doc.top,
              left: doc.left,
              right: doc.right,
              bottom: doc.bottom,
              rotate: doc.rotate
            }}
            className={`w-32 h-44 ${doc.bg} border border-zinc-200/50 rounded-xl shadow-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm hidden lg:flex`}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-zinc-100"
            >
              <FileText className={`w-6 h-6 ${doc.color}`} />
            </motion.div>
            <span className={`text-[8px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
