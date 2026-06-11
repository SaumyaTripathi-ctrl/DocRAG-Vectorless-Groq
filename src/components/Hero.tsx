'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Play, Sparkles, Brain } from 'lucide-react';

const FLOATING_DOCS = [
  { id: 1, type: 'PDF', color: 'text-red-500', bg: 'bg-red-50', x: -140, y: -100, delay: 0 },
  { id: 2, type: 'DOCX', color: 'text-blue-500', bg: 'bg-blue-50', x: 160, y: -60, delay: 0.5 },
  { id: 3, type: 'PPTX', color: 'text-orange-500', bg: 'bg-orange-50', x: -120, y: 140, delay: 1 },
  { id: 4, type: 'TXT', color: 'text-slate-500', bg: 'bg-slate-50', x: 150, y: 160, delay: 1.5 },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New: Support for large CSV datasets</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-headline font-bold leading-[1.1] text-slate-900 tracking-tight">
              Chat With Your <br />
              <span className="text-primary italic">Documents</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Upload PDFs, DOCX, and PPTs and get instant, accurate answers from your own knowledge base in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Start Chatting Free
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-semibold gap-2 border-slate-200 hover:bg-slate-50">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Supported formats</span>
              <div className="flex gap-4 items-center">
                {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                  <span key={ext} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-default">{ext}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Simple Animated Visual */}
          <div className="flex-1 relative w-full max-w-[500px] h-[500px] flex items-center justify-center">
            {/* AI Core Box */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-48 h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            {/* Floating Documents */}
            {FLOATING_DOCS.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  x: doc.x,
                  y: doc.y + (Math.sin(Date.now() / 1000 + doc.id) * 10),
                }}
                transition={{ 
                  opacity: { delay: doc.delay, duration: 0.5 },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`absolute w-14 h-18 ${doc.bg} rounded-xl border border-white shadow-lg flex flex-col p-2 backdrop-blur-sm`}
              >
                <div className={`h-1 w-8 rounded-full ${doc.color.replace('text', 'bg')} opacity-20 mb-1.5`} />
                <div className="flex-1 flex items-center justify-center">
                  <FileText className={`w-6 h-6 ${doc.color}`} />
                </div>
                <span className={`text-[7px] font-bold ${doc.color} text-center mt-1 opacity-60`}>{doc.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
