'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const DOCS = [
  { 
    id: 'pdf',
    type: 'PDF', 
    color: 'text-red-500', 
    bg: 'bg-red-50', 
    startPos: { x: -350, y: -180 },
    rotate: -12,
    stackZ: 40,
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 350, y: -160 },
    rotate: 8,
    stackZ: 30,
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -320, y: 160 },
    rotate: -8,
    stackZ: 20,
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-zinc-500', 
    bg: 'bg-zinc-50', 
    startPos: { x: 380, y: 180 },
    rotate: 12,
    stackZ: 10,
  },
];

interface DocumentCardProps {
  doc: typeof DOCS[0];
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, scrollYProgress }: DocumentCardProps) {
  // Phase 1: Gather (0 to 0.4)
  // Phase 2: Travel down to next section (0.4 to 1.0)
  const x = useTransform(scrollYProgress, [0, 0.4], [doc.startPos.x, 0]);
  const y = useTransform(
    scrollYProgress, 
    [0, 0.4, 1], 
    [doc.startPos.y, 0, 1000] // Move deep into next section
  );
  
  const rotate = useTransform(scrollYProgress, [0, 0.4], [doc.rotate, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6], [1, 1, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  
  const shadow = useTransform(
    scrollYProgress,
    [0.35, 0.45],
    ["0px 4px 6px rgba(0,0,0,0.05)", "0px 25px 50px rgba(0,0,0,0.1)"]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        boxShadow: shadow,
        zIndex: doc.stackZ,
        position: 'absolute',
      }}
      className={`w-36 h-48 ${doc.bg} border border-zinc-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 backdrop-blur-sm hidden lg:flex`}
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
        <FileText className={`w-7 h-7 ${doc.color}`} />
      </div>
      <span className={`text-[8px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative py-32 lg:py-48 bg-white">
      <div className="container mx-auto px-6 grid lg:grid-cols-1 items-center justify-center text-center relative z-10 min-h-[60vh]">
        {/* Content */}
        <motion.div 
          initial={{ opacity: 1 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase">
            Intelligent Document Analysis
          </div>

          <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-zinc-900 tracking-tight">
            Chat With Your <br />
            <span className="text-indigo-600">Documents.</span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-lg mx-auto leading-relaxed font-medium">
            Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge base.
          </p>

          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Animation Anchor - Absolutely positioned relative to center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
          {DOCS.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
