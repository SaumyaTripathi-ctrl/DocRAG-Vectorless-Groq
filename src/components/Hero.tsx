'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

const DOCS = [
  { type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', x: -120, y: -80, rotate: -15 },
  { type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', x: 120, y: -40, rotate: 10 },
  { type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', x: -80, y: 100, rotate: 5 },
  { type: 'TXT', color: 'text-zinc-500', bg: 'bg-zinc-100', x: 100, y: 80, rotate: -8 },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const mergeProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const chatOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const chatScale = useTransform(scrollYProgress, [0.4, 0.6], [0.95, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <section className="sticky top-0 h-screen flex items-center overflow-hidden soft-grid bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Text Content */}
          <motion.div style={{ opacity: contentOpacity }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Productivity</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-headline font-bold leading-[1.05] text-zinc-900 tracking-tight">
              Chat With Your <br />
              <span className="text-indigo-600">Documents.</span>
            </h1>

            <p className="text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with precise citations from your own knowledge base.
            </p>

            <div className="flex items-center gap-4">
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6 opacity-60">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Supports</span>
              {['PDF', 'DOCX', 'PPTX'].map(f => (
                <span key={f} className="text-xs font-bold text-zinc-900">{f}</span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interactive Story */}
          <div className="relative h-[600px] flex items-center justify-center">
            
            {/* Document Stack merging into Chat */}
            <div className="relative w-full h-full flex items-center justify-center">
              {DOCS.map((doc, i) => (
                <DocumentCard 
                  key={i} 
                  {...doc} 
                  mergeProgress={mergeProgress} 
                />
              ))}

              {/* Chat Interface Reveal */}
              <motion.div 
                style={{ opacity: chatOpacity, scale: chatScale }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">DocuMind AI</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-6">
                    <div className="flex justify-end">
                      <div className="bg-zinc-100 text-zinc-900 p-3 rounded-2xl rounded-tr-sm text-[12px] font-medium max-w-[80%]">
                        What was the growth in Q3?
                      </div>
                    </div>
                    <div className="flex justify-start gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-sm text-[12px] leading-relaxed text-zinc-600 shadow-sm">
                          Revenue grew by 23% in Q3, driven by enterprise subscriptions.
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Source: Page 14</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DocumentCard({ type, color, bg, x, y, rotate, mergeProgress }: any) {
  const finalX = useTransform(mergeProgress, [0, 1], [x, 0]);
  const finalY = useTransform(mergeProgress, [0, 1], [y, 0]);
  const finalRotate = useTransform(mergeProgress, [0, 1], [rotate, 0]);
  const opacity = useTransform(mergeProgress, [0.8, 1], [1, 0]);

  return (
    <motion.div
      style={{ x: finalX, y: finalY, rotate: finalRotate, opacity }}
      className={`absolute w-40 h-52 ${bg} border border-zinc-200/50 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-3`}
    >
      <FileText className={`w-12 h-12 ${color}`} />
      <span className={`text-[10px] font-bold ${color} opacity-60 tracking-widest uppercase`}>{type}</span>
    </motion.div>
  );
}