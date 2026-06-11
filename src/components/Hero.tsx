'use client';

import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, FileCode, FileType, FileTerminal, Brain } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FloatingFile = ({ delay, icon: Icon, color, initialX, initialY }: any) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.3], [initialX, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [initialY, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  return (
    <motion.div
      style={{ x, y, opacity, scale }}
      className={`absolute p-4 rounded-2xl bg-white shadow-xl ${color} flex items-center justify-center`}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
  );
};

const ChatBubble = ({ side, delay, text }: any) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const x = useTransform(scrollYProgress, [0.3, 0.45], [side === 'left' ? -100 : 100, 0]);

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute ${side === 'left' ? 'left-[-140px]' : 'right-[-140px]'} top-[20%] p-3 rounded-2xl shadow-lg text-xs max-w-[120px] ${side === 'left' ? 'bg-primary text-white' : 'bg-white text-slate-800'}`}
    >
      {text}
    </motion.div>
  );
};

export function Hero() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-headline font-bold leading-tight"
          >
            Chat With Your <span className="text-primary">Documents</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-body leading-relaxed"
          >
            Upload PDFs, DOCX, PPTs and instantly get accurate answers from your own knowledge base with citation-backed intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg gap-2">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            {['PDF', 'DOCX', 'PPTX', 'TXT'].map((type) => (
              <span key={type} className="px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground border">
                {type}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative flex justify-center items-center h-[500px]">
          {/* AI Cube Visual */}
          <div className="relative z-10 w-48 h-48">
            <motion.div 
              className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.5)] flex items-center justify-center relative overflow-hidden"
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
               <Brain className="w-20 h-20 text-white" />
               <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
            </motion.div>
            
            {/* Chat Emergence */}
            <ChatBubble side="left" text="Analyze findings" />
            <ChatBubble side="right" text="Revenue grew 23%" />
          </div>

          {/* Floating Documents */}
          <FloatingFile icon={FileText} color="text-red-500" initialX={-250} initialY={-150} />
          <FloatingFile icon={FileType} color="text-blue-500" initialX={250} initialY={-100} />
          <FloatingFile icon={FileCode} color="text-emerald-500" initialX={-200} initialY={150} />
          <FloatingFile icon={FileTerminal} color="text-slate-700" initialX={200} initialY={180} />
        </div>
      </div>
    </section>
  );
}
