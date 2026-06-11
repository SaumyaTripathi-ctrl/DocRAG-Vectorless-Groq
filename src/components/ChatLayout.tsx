'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, ChevronRight, Brain, Sparkles } from 'lucide-react';
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
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-headline font-bold text-slate-900 mb-4 tracking-tight">The Future of Knowledge Discovery</h2>
          <p className="text-lg text-slate-500 font-medium">Ask natural language questions and get verifiable answers with precise page references.</p>
        </div>

        <div className="max-w-6xl mx-auto h-[650px] border border-slate-200 rounded-[2.5rem] bg-white flex shadow-2xl overflow-hidden">
          {/* Column 1: Document List */}
          <div className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documents</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {['Annual_Report_2023.pdf', 'Growth_Strategy.docx', 'Tech_Audit.txt', 'Market_Trends.pptx'].map((doc, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all cursor-pointer ${i === 0 ? 'bg-white border border-slate-100 shadow-sm text-primary font-bold' : 'text-slate-500 hover:bg-white/60'}`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${i === 0 ? 'text-primary' : 'text-slate-300'}`} />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Chat Interface */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                  What are the key financial findings from the report?
                </div>
              </div>

              {/* AI Message */}
              <div className="flex justify-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl rounded-tl-sm text-sm max-w-[90%] leading-relaxed text-slate-700 shadow-sm relative">
                  <div className="absolute -top-3 left-0 bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI AGENT
                  </div>
                  {typedText}
                  {typedText.length < fullText.length && <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />}
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-6 pt-0">
              <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 pr-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40">
                <Input 
                  disabled 
                  placeholder="Ask about your documents..." 
                  className="bg-transparent border-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 text-base h-10"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90 w-10 h-10 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Column 3: Citations */}
          <div className="w-72 border-l border-slate-100 bg-slate-50/50 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sources</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <AnimatePresence>
                {showSources && [12, 17, 24].map((page, i) => (
                  <motion.div 
                    key={page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm space-y-2 group cursor-pointer hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase">Page {page}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed line-clamp-2">"...revenue increase driven by enterprise segment growth across..."</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
