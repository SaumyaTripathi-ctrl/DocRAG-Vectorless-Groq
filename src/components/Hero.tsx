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
    startPos: { x: -300, y: -200 },
    rotate: -15,
    stackZ: 40
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 300, y: -250 },
    rotate: 10,
    stackZ: 30
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -250, y: 250 },
    rotate: -10,
    stackZ: 20
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-zinc-500', 
    bg: 'bg-zinc-50', 
    startPos: { x: 350, y: 200 },
    rotate: 15,
    stackZ: 10
  },
];

interface DocumentCardProps {
  doc: typeof DOCS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, index, scrollYProgress }: DocumentCardProps) {
  // Movement ranges
  const gatherStart = 0;
  const gatherEnd = 0.5;
  
  // Transition logic: Spread -> Stack in Center -> Travel Down
  const x = useTransform(scrollYProgress, [gatherStart, gatherEnd, 1], [doc.startPos.x, 0, 0]);
  const y = useTransform(scrollYProgress, [gatherStart, gatherEnd, 0.7, 1], [doc.startPos.y, 0, 0, 800]);
  const rotate = useTransform(scrollYProgress, [gatherStart, gatherEnd], [doc.rotate, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [1, 1.1, 1.1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

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
      className={`w-40 h-52 ${doc.bg} border border-zinc-200/60 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 backdrop-blur-sm hidden lg:flex`}
    >
      <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center border border-zinc-100">
        <FileText className={`w-8 h-8 ${doc.color}`} />
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
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase">
              Productivity Redefined
            </div>

            <h1 className="text-5xl lg:text-6xl font-headline font-bold leading-[1.15] text-zinc-900 tracking-tight">
              Chat With Your <br />
              <span className="text-indigo-600">Documents.</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-lg leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge base.
            </p>

            <div className="pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
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
