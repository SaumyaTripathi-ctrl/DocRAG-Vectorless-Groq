'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const DOCS = [
  { 
    id: 'pdf',
    type: 'PDF', 
    color: 'text-red-500', 
    bg: 'bg-red-50', 
    startPos: { x: -600, y: -100 },
    rotate: -25,
    stackZ: 40
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 500, y: -350 },
    rotate: 15,
    stackZ: 30
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -500, y: 350 },
    rotate: -15,
    stackZ: 20
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-zinc-500', 
    bg: 'bg-zinc-50', 
    startPos: { x: 600, y: 100 },
    rotate: 20,
    stackZ: 10
  },
];

interface DocumentCardProps {
  doc: typeof DOCS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, index, scrollYProgress }: DocumentCardProps) {
  // Phase 1: Gathering (0.0 to 0.5)
  // Phase 2: Stacking Pulse (0.5 to 0.7)
  // Phase 3: Downward Travel (0.7 to 1.0)
  
  const gatherStart = index * 0.08;
  const gatherEnd = 0.5;
  
  // Horizontal movement: Gather at 0, stay at 0
  const x = useTransform(scrollYProgress, [gatherStart, gatherEnd, 1], [doc.startPos.x, 0, 0]);
  
  // Vertical movement: Gather at 0, stay, then travel DOWN to the next section
  const y = useTransform(
    scrollYProgress, 
    [gatherStart, gatherEnd, 0.75, 1], 
    [doc.startPos.y, 0, 0, 800] // Travels 800px down to "enter" the Upload section
  );
  
  const rotate = useTransform(scrollYProgress, [gatherStart, gatherEnd, 1], [doc.rotate, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.6, 0.75, 1], [1, 1, 1.15, 1.15, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex: doc.stackZ,
        position: 'absolute',
      }}
      className={`w-36 h-48 ${doc.bg} border border-zinc-200/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm hidden lg:flex`}
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
        <FileText className={`w-7 h-7 ${doc.color}`} />
      </div>
      <span className={`text-[10px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <section ref={containerRef} className="relative min-h-[200vh] bg-white">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03)_0%,transparent_50%)]" />
        
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

            <div className="flex flex-col items-center gap-2 pt-8 opacity-60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Try asking:</span>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {['Summarize report', 'Extract findings', 'Compare files'].map(f => (
                  <span key={f} className="text-xs font-semibold text-zinc-900 italic">"{f}"</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Documents Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {DOCS.map((doc, i) => (
            <DocumentCard 
              key={doc.id} 
              doc={doc} 
              index={i} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
