'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, ChevronRight, Brain, MessageSquare, Quote, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChatLayout() {
  const [typedText, setTypedText] = useState("");
  const [showSources, setShowSources] = useState(false);
  const fullText = "Based on the provided documents, the key findings show a 23% increase in year-over-year revenue. This growth was primarily driven by the expansion of the SaaS enterprise segment, while operating expenses were reduced by 12% through infrastructure optimization.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowSources(true), 500);
      }
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl font-headline font-bold text-slate-900 mb-6 tracking-tight">The Future of Knowledge Discovery</h2>
          <p className="text-xl text-slate-500 font-medium">Ask natural language questions and get verifiable answers with precise page references.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto h-[750px] border border-slate-200 rounded-[3rem] bg-white flex shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          {/* Column 1: Document List */}
          <div className="w-72 border-r border-slate-100 bg-slate-50/40 flex flex-col">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Context Library</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {['Annual_Report_2023.pdf', 'Growth_Strategy.docx', 'Tech_Audit.txt', 'Market_Trends.pptx'].map((doc, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className={`flex items-center gap-3 p-4 rounded-2xl text-sm transition-all cursor-pointer ${i === 0 ? 'bg-white border border-slate-100 shadow-sm text-primary font-bold' : 'text-slate-500 hover:bg-white/60'}`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${i === 0 ? 'text-primary' : 'text-slate-300'}`} />
                  <span className="truncate">{doc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Column 2: Chat Interface */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-10 overflow-y-auto space-y-10 custom-scrollbar">
              {/* User Message */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="bg-slate-900 text-white p-5 rounded-3xl rounded-tr-sm text-base max-w-[80%] shadow-xl">
                  What are the key financial findings from the report?
                </div>
              </motion.div>

              {/* AI Message */}
              <div className="flex justify-start gap-5">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"
                >
                  <Brain className="w-7 h-7 text-white" />
                </motion.div>
                <div className="bg-slate-50 border border-slate-100 p-7 rounded-3xl rounded-tl-sm text-base max-w-[90%] leading-relaxed text-slate-700 shadow-sm relative">
                  <div className="absolute -top-3 left-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI AGENT
                  </div>
                  {typedText}
                  <span className="inline-block w-1.5 h-5 bg-primary ml-1.5 animate-pulse rounded-full align-middle" />
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-10 pt-0">
              <div className="flex gap-4 bg-slate-50 border border-slate-200 rounded-[2rem] p-3 pr-3 transition-all focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/30">
                <Input 
                  disabled 
                  placeholder="Ask about your documents..." 
                  className="bg-transparent border-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 text-lg h-12"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90 w-12 h-12 rounded-2xl shadow-lg">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Column 3: Citations */}
          <div className="w-80 border-l border-slate-100 bg-slate-50/40 flex flex-col">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Sources</h3>
            </div>
            <div className="flex-1 p-8 space-y-5">
              <AnimatePresence>
                {showSources && [12, 17, 24].map((page, i) => (
                  <motion.div 
                    key={page}
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                    className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 group cursor-pointer hover:border-primary/40 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-md">Report • P{page}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">"...revenue increase driven by enterprise segment growth across..."</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
