'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Layout, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

const AI_RESPONSE = "Revenue grew by 23% in Q3, primarily driven by new enterprise subscriptions and an optimized SaaS delivery model. Operating expenses remained stable.";

export function ChatLayout() {
  const [typedText, setTypedText] = useState("");
  const [showCitations, setShowCitations] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
          setTypedText(AI_RESPONSE.slice(0, i));
          i++;
          if (i > AI_RESPONSE.length) {
            clearInterval(interval);
            setIsTyping(false);
            setTimeout(() => setShowCitations(true), 600);
          }
        }, 30);
        return () => clearInterval(interval);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight lg:text-4xl">Extract Intelligence Instantly</h2>
          <p className="text-lg font-medium text-zinc-500 mt-4 leading-relaxed">The agent understands your files and answers with verifiable, real-time citations.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto h-[700px] border border-zinc-200 rounded-[3rem] bg-white flex shadow-2xl shadow-zinc-200/80 overflow-hidden relative group"
        >
          {/* Sidebar */}
          <div className="w-72 border-r border-zinc-100 bg-zinc-50/50 flex flex-col hidden lg:flex">
            <div className="p-8 border-b border-zinc-100 flex items-center gap-3">
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <Layout className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Source Files</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {['Annual_Report.pdf', 'Research_Paper.docx', 'Meeting_Notes.txt'].map((doc, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className={`flex items-center gap-3 p-4 rounded-2xl text-xs transition-all duration-300 ${i === 0 ? 'bg-white border border-zinc-200 text-zinc-900 font-bold shadow-md shadow-zinc-100' : 'text-zinc-500 hover:bg-white/50'}`}
                >
                  <FileText className={`w-4 h-4 ${i === 0 ? 'text-red-500' : 'text-zinc-300'}`} />
                  <span className="truncate">{doc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white relative">
            <div className="flex-1 p-10 lg:p-14 overflow-y-auto space-y-12 custom-scrollbar">
              <div className="flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zinc-900 text-white px-7 py-5 rounded-[2rem] rounded-tr-sm text-sm max-w-[80%] font-medium shadow-xl shadow-zinc-200"
                >
                  What was the growth in Q3?
                </motion.div>
              </div>

              {isInView && (
                <div className="flex justify-start gap-5">
                  <motion.div 
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="bg-zinc-50 border border-zinc-100 p-8 lg:p-10 rounded-[2rem] rounded-tl-sm text-sm max-w-[90%] leading-relaxed text-zinc-600 shadow-sm">
                    <div className="text-[10px] font-bold text-indigo-600 mb-4 uppercase tracking-[0.25em]">AI Agent Response</div>
                    <div className="min-h-[1.5em] relative text-base font-medium text-zinc-800">
                      {typedText}
                      {isTyping && <span className="cursor-blink" />}
                    </div>
                    
                    <AnimatePresence>
                      {showCitations && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 pt-6 border-t border-zinc-200/50 flex flex-wrap gap-2"
                        >
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full flex items-center gap-2 border border-indigo-100 shadow-sm cursor-help"
                          >
                            <Database className="w-3 h-3" /> Source: Page 14
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 pt-0">
              <div className="flex gap-4 bg-zinc-50 border border-zinc-200 rounded-[2rem] p-3 pr-3 transition-all focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:border-indigo-600/20">
                <div className="flex-1 flex items-center px-6 text-zinc-400 text-sm italic font-medium">
                  Ask your documents anything...
                </div>
                <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 w-12 h-12 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all">
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
