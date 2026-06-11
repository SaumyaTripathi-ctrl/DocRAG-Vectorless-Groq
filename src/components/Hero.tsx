'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const FLOATING_DOCS = [
  { id: 1, type: 'pdf', color: 'text-red-500', bg: 'bg-red-50', x: -100, y: -80, delay: 0 },
  { id: 2, type: 'docx', color: 'text-blue-500', bg: 'bg-blue-50', x: 120, y: -40, delay: 0.5 },
  { id: 3, type: 'pptx', color: 'text-orange-500', bg: 'bg-orange-50', x: -80, y: 100, delay: 1 },
  { id: 4, type: 'txt', color: 'text-slate-500', bg: 'bg-slate-50', x: 110, y: 120, delay: 1.5 },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New: Support for large CSV datasets</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-slate-900">
              Chat With Your <br />
              <span className="text-primary">Documents</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Upload PDFs, DOCX, PPTs and get instant, accurate answers from your own knowledge base in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                Start Chatting Free
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-14 text-base font-semibold gap-2 border border-slate-200">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supports</span>
              <div className="flex gap-4 items-center">
                {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                  <span key={ext} className="text-sm font-medium text-slate-600">{ext}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Animated Visual */}
          <div className="flex-1 relative w-full max-w-[500px] h-[500px] flex items-center justify-center">
            {/* AI Core Box */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-48 h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-pulse" />
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Floating Documents */}
            {FLOATING_DOCS.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 1,
                  x: doc.x,
                  y: [doc.y, doc.y - 15, doc.y],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  opacity: { delay: doc.delay, duration: 0.5 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: doc.delay },
                  rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: doc.delay }
                }}
                className={`absolute w-14 h-18 ${doc.bg} rounded-xl border border-slate-100 shadow-lg flex flex-col p-2`}
              >
                <div className={`h-2 w-full rounded-full ${doc.color.replace('text', 'bg')} opacity-20 mb-2`} />
                <div className="flex-1 flex items-center justify-center">
                  <FileText className={`w-6 h-6 ${doc.color}`} />
                </div>
              </motion.div>
            ))}

            {/* Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
