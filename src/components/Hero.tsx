'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';

const DOCS = [
  { type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', x: -40, y: -40, rotate: -12 },
  { type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', x: 40, y: 0, rotate: 8 },
  { type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', x: -20, y: 60, rotate: -4 },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-16">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold tracking-wider uppercase">
            <span>Productivity Redefined</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-headline font-bold leading-[1.05] text-zinc-900 tracking-tight">
            Chat With Your <br />
            <span className="text-indigo-600">Documents.</span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
            Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge.
          </p>

          <div className="flex items-center gap-4">
            <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 opacity-60">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Supports</span>
            {['PDF', 'DOCX', 'PPTX', 'TXT'].map(f => (
              <span key={f} className="text-xs font-bold text-zinc-900">{f}</span>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Product Stack */}
        <div className="relative h-[500px] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {DOCS.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, x: 0, y: 0, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: doc.x, 
                  y: doc.y, 
                  rotate: doc.rotate 
                }}
                transition={{ 
                  delay: i * 0.1, 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={`absolute w-52 h-64 ${doc.bg} border border-zinc-200/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-4 group cursor-default transition-transform hover:scale-105`}
              >
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center border border-zinc-100 transition-transform group-hover:rotate-6">
                  <FileText className={`w-10 h-10 ${doc.color}`} />
                </div>
                <span className={`text-[11px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
