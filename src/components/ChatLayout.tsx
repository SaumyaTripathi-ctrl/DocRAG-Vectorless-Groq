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

  // "Flowing icons" that appear just before the chat starts
  const [showFlowingIcons, setShowFlowingIcons] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShowFlowingIcons(true);
      // Brief delay to suggest "processing" from previous section
      const timer = setTimeout(() => {
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
          setTypedText(AI_RESPONSE.slice(0, i));
          i++;
          if (i > AI_RESPONSE.length) {
            clearInterval(interval);
            setIsTyping(false);
            setTimeout(() => setShowCitations(true), 500);
          }
        }, 30);
        return () => clearInterval(interval);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden relative">
      {/* Flowing Icons Transition Layer */}
      {showFlowingIcons && !isTyping && typedText === "" && (
        <div className="absolute inset-x-0 top-0 h-40 flex justify-center gap-12 pointer-events-none z-0">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              initial={{ y: -100, opacity: 0, scale: 0.5 }}
              animate={{ y: 200, opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: id * 0.2, ease: "easeInOut" }}
              className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center"
            >
              <FileText className="w-5 h-5 text-indigo-500" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Extract Intelligence Instantly</h2>
          <p className="text-lg font-medium text-zinc-500 mt-2">The agent understands your files and answers with verifiable citations.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto h-[700px] border border-zinc-200 rounded-[2.5rem] bg-white flex shadow-2xl overflow-hidden relative"
        >
          {/* Sidebar */}
          <div className="w-72 border-r border-zinc-100 bg-zinc-50/30 flex flex-col hidden lg:flex">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Layout className="w-3.5 h-3.5 text-indigo-600" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Source Files</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {['Annual_Report.pdf', 'Research_Paper.docx', 'Meeting_Notes.txt'].map((doc, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className={`flex items-center gap-3 p-4 rounded-2xl text-xs transition-all ${i === 0 ? 'bg-white border border-zinc-100 text-zinc-900 font-bold shadow-sm' : 'text-zinc-500'}`}
                >
                  <FileText className={`w-4 h-4 ${i === 0 ? 'text-red-500' : 'text-zinc-300'}`} />
                  <span className="truncate">{doc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 }}
                  className="bg-zinc-900 text-white p-5 rounded-[1.5rem] rounded-tr-sm text-sm max-w-[80%] font-medium shadow-xl"
                >
                  What was the growth in Q3?
                </motion.div>
              </div>

              {isInView && (
                <div className="flex justify-start gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.5 }}
                    className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[1.5rem] rounded-tl-sm text-sm max-w-[90%] leading-relaxed text-zinc-600">
                    <div className="text-[10px] font-bold text-indigo-600 mb-2 uppercase tracking-widest">AI Agent</div>
                    <div className="min-h-[1.5em] relative">
                      {typedText}
                      {isTyping && <span className="cursor-blink" />}
                    </div>
                    
                    <AnimatePresence>
                      {showCitations && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 flex flex-wrap gap-2"
                        >
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-100 shadow-sm">
                            <Database className="w-2.5 h-2.5" /> Source: Page 14
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 pt-0">
              <div className="flex gap-4 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] p-2 pr-2">
                <div className="flex-1 flex items-center px-6 text-zinc-400 text-sm italic font-medium">
                  Ask your documents anything...
                </div>
                <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 w-12 h-12 rounded-xl shadow-lg">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Citations Panel */}
          <div className="w-80 border-l border-zinc-100 bg-zinc-50/30 flex flex-col hidden xl:flex">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Citations</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
              {[14, 21, 28].map((page, i) => (
                <motion.div 
                  key={page}
                  initial={{ opacity: 0, y: 10 }}
                  animate={showCitations ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className={`p-4 bg-white border rounded-2xl shadow-sm space-y-2 group transition-all ${i === 0 && showCitations ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-zinc-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Page {page}</span>
                    <Database className="w-3 h-3 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">"...revenue increase driven by enterprise growth and subscription metrics..."</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
