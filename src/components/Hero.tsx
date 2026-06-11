'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const DOCS = [
  { 
    id: 'pdf',
    type: 'PDF', 
    color: 'text-rose-500', 
    bg: 'bg-rose-50', 
    startPos: { x: -480, y: -240 },
    rotate: -12,
    stackZ: 40,
    landProgress: 0.4,
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 480, y: -200 },
    rotate: 8,
    stackZ: 30,
    landProgress: 0.45,
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -440, y: 220 },
    rotate: -10,
    stackZ: 20,
    landProgress: 0.5,
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50', 
    startPos: { x: 500, y: 260 },
    rotate: 15,
    stackZ: 10,
    landProgress: 0.55,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

interface DocumentCardProps {
  doc: typeof DOCS[0];
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, scrollYProgress }: DocumentCardProps) {
  const x = useTransform(scrollYProgress, [0, doc.landProgress], [doc.startPos.x, 0]);
  const y = useTransform(
    scrollYProgress, 
    [0, doc.landProgress, 1], 
    [doc.startPos.y, 0, 1500]
  );
  
  const rotate = useTransform(scrollYProgress, [0, doc.landProgress], [doc.rotate, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55, 0.65, 0.75], [1, 1, 1.15, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);
  
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.55, 0.65],
    [
      "0px 8px 12px rgba(0,0,0,0.05)", 
      "0px 20px 40px rgba(0,0,0,0.08)", 
      "0px 60px 100px rgba(0,0,0,0.12)"
    ]
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
      className={`w-44 h-56 ${doc.bg} border border-zinc-200/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 backdrop-blur-md hidden lg:flex will-change-transform group shadow-sm animate-float`}
    >
      <div className="w-16 h-16 rounded-[1.75rem] bg-white shadow-lg shadow-zinc-200/50 flex items-center justify-center border border-zinc-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
        <FileText className={`w-9 h-9 ${doc.color}`} />
      </div>
      <span className={`text-[11px] font-bold ${doc.color} opacity-80 tracking-[0.2em] uppercase`}>{doc.type}</span>
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
    <section ref={containerRef} className="relative min-h-[180vh] bg-mesh overflow-visible">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none -z-10" />

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center overflow-visible">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 max-w-5xl mx-auto relative z-20 pointer-events-none px-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-indigo-100 text-indigo-600 text-[11px] font-bold tracking-[0.2em] uppercase shadow-sm">
            <Sparkles className="w-4 h-4" />
            Conversational Intelligence
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl lg:text-[5.5rem] font-headline font-bold leading-[1.05] text-zinc-900 tracking-tight pointer-events-auto">
            Your Documents. <br />
            <span className="text-indigo-600 relative inline-block">
              Conversational.
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-2 left-0 h-2 bg-indigo-600/10 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-2xl text-zinc-500 max-w-xl mx-auto leading-relaxed font-medium pointer-events-auto">
            Synthesize complexity into clarity. Upload documents and get verifiable answers instantly.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-8 pointer-events-auto flex items-center justify-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="rounded-full px-14 h-20 text-xl font-bold bg-zinc-900 hover:bg-zinc-800 shadow-2xl shadow-zinc-200/80 transition-all duration-300 group">
                Start Workspace
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

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