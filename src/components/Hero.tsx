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
    startPos: { x: -450, y: -220 },
    rotate: -15,
    stackZ: 40,
    landProgress: 0.4, // Lands first
  },
  { 
    id: 'docx',
    type: 'DOCX', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    startPos: { x: 450, y: -180 },
    rotate: 10,
    stackZ: 30,
    landProgress: 0.45, // Lands second
  },
  { 
    id: 'pptx',
    type: 'PPTX', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    startPos: { x: -400, y: 180 },
    rotate: -8,
    stackZ: 20,
    landProgress: 0.5, // Lands third
  },
  { 
    id: 'txt',
    type: 'TXT', 
    color: 'text-zinc-500', 
    bg: 'bg-zinc-50', 
    startPos: { x: 480, y: 220 },
    rotate: 12,
    stackZ: 10,
    landProgress: 0.55, // Lands last
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

interface DocumentCardProps {
  doc: typeof DOCS[0];
  scrollYProgress: MotionValue<number>;
}

function DocumentCard({ doc, scrollYProgress }: DocumentCardProps) {
  // Phase 1: Gather (0 to landProgress) - Sequential arrival
  const x = useTransform(scrollYProgress, [0, doc.landProgress], [doc.startPos.x, 0]);
  
  // Phase 2: Move down (landProgress to 1.0) - Travel as a stack
  // We calculate y so it starts from its unique y, lands at 0, then travels to 1200
  const y = useTransform(
    scrollYProgress, 
    [0, doc.landProgress, 1], 
    [doc.startPos.y, 0, 1400]
  );
  
  // Rotation straightens out as it lands
  const rotate = useTransform(scrollYProgress, [0, doc.landProgress], [doc.rotate, 0]);
  
  // Pulse effect when the stack is complete (around 0.6)
  const scale = useTransform(scrollYProgress, [0, 0.55, 0.65, 0.75], [1, 1, 1.15, 1]);
  
  // Always visible from the start, fades at the very end
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);
  
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.55, 0.65],
    [
      "0px 4px 6px rgba(0,0,0,0.05)", 
      "0px 10px 20px rgba(0,0,0,0.1)", 
      "0px 40px 80px rgba(0,0,0,0.15)"
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
      className={`w-40 h-52 ${doc.bg} border border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 backdrop-blur-sm hidden lg:flex will-change-transform group`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-zinc-100 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
        <FileText className={`w-8 h-8 ${doc.color}`} />
      </div>
      <span className={`text-[10px] font-bold ${doc.color} opacity-60 tracking-widest uppercase`}>{doc.type}</span>
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
    <section ref={containerRef} className="relative min-h-[160vh] bg-mesh overflow-visible">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-mesh opacity-50 -z-10" />

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center overflow-visible">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-4xl mx-auto relative z-20 pointer-events-none"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-md border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase">
            Intelligent Document Analysis
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-zinc-900 tracking-tight pointer-events-auto">
            Chat With Your <br />
            <span className="text-indigo-600 relative">
              Documents.
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-1 left-0 h-1 bg-indigo-600/20 rounded-full -z-10"
              />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-zinc-500 max-w-lg mx-auto leading-relaxed font-medium pointer-events-auto">
            Upload PDFs, DOCX, and PPTs. Get instant, verifiable answers with source citations from your own knowledge base.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4 pointer-events-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300 group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animation Anchor */}
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
