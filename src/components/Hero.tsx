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
    startPos: { x: -600, y: -400 },
    rotate: -15,
    stackZ: 40,
    gatherRange: [0, 0.4] as [number, number]
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 600, y: -350 },
    rotate: 10,
    stackZ: 30,
    gatherRange: [0.1, 0.45] as [number, number]
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -500, y: 500 },
    rotate: -10,
    stackZ: 20,
    gatherRange: [0.2, 0.5] as [number, number]
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-zinc-500', 
    bg: 'bg-zinc-50', 
    startPos: { x: 700, y: 400 },
    rotate: 15,
    stackZ: 10,
    gatherRange: [0.3, 0.55] as [number, number]
  },
];

interface DocumentCardProps {
  doc: typeof DOCS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, scrollYProgress }: DocumentCardProps) {
  // Phase 1: Gathering to center
  const x = useTransform(scrollYProgress, [doc.gatherRange[0], doc.gatherRange[1], 1], [doc.startPos.x, 0, 0]);
  
  // Phase 2: Stay centered then travel down
  // Range 0.6 to 1 handles the travel downward out of the viewport
  const y = useTransform(
    scrollYProgress, 
    [doc.gatherRange[0], doc.gatherRange[1], 0.7, 1], 
    [doc.startPos.y, 0, 0, 1000]
  );

  const rotate = useTransform(scrollYProgress, [doc.gatherRange[0], doc.gatherRange[1]], [doc.rotate, 0]);
  
  // Scale pulse when stacked
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.6, 0.7, 1], [1, 1, 1.15, 1.15, 1]);
  
  // Opacity fade at the very end
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  
  // Shadow depth when stacked
  const shadow = useTransform(
    scrollYProgress,
    [0.5, 0.6],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 25px 50px rgba(0,0,0,0.15)"]
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
      className={`w-44 h-56 ${doc.bg} border border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 backdrop-blur-sm hidden lg:flex`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
        <FileText className={`w-9 h-9 ${doc.color}`} />
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
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-white">
      {/* Sticky container ensures the hero is pinned while animation plays */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 relative z-10">
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase">
              Intelligent Document Analysis
            </div>

            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-zinc-900 tracking-tight">
              Chat With Your <br />
              <span className="text-indigo-600">Documents.</span>
            </h1>

            <p className="text-xl text-zinc-500 max-w-lg leading-relaxed font-medium">
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

          {/* Right Side: Animation Anchor */}
          <div className="relative h-[600px] flex items-center justify-center pointer-events-none">
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
      </div>
    </section>
  );
}
