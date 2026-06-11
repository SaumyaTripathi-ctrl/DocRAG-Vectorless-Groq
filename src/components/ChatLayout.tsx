'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, ChevronRight, Brain, Sparkles, Database } from 'lucide-react';
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
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-headline font-bold text-white mb-4 tracking-tight">Step 2: Instant Discovery</h2>
          <p className="text-lg text-zinc-500 font-medium">Query thousands of pages in seconds. Precise verifiable answers.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto h-[650px] border border-white/10 rounded-[2.5rem] bg-zinc-950/50 backdrop-blur-xl flex shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center gap-2">
              <Database className="w-3 h-3 text-primary" />
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Knowledge Base</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {['Annual_Report_2023.pdf', 'Growth_Strategy.docx', 'Tech_Audit.txt', 'Market_Trends.pptx'].map((doc, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 p-3 rounded-xl text-[11px] transition-all cursor-pointer ${i === 0 ? 'bg-white/5 border border-white/10 text-white font-bold' : 'text-zinc-500 hover:bg-white/5'}`}
                >
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${i === 0 ? 'text-primary' : 'text-zinc-600'}`} />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-transparent">
            <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
              {/* User Message */}
              <div className="flex justify-end">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white text-black p-4 rounded-2xl rounded-tr-sm text-sm max-w-[80%] font-medium"
                >
                  What are the key financial findings from the report?
                </motion.div>
              </div>

              {/* AI Message */}
              <div className="flex justify-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl rounded-tl-sm text-sm max-w-[90%] leading-relaxed text-zinc-300 shadow-sm relative">
                  <div className="absolute -top-3 left-0 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI ENGINE
                  </div>
                  {typedText}
                  {typedText.length < fullText.length && <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse" />}
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-6 pt-0">
              <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pr-2 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                <Input 
                  disabled 
                  placeholder="Ask your documents..." 
                  className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-600 text-sm h-10"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90 w-10 h-10 rounded-xl transition-transform active:scale-90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Citations Panel */}
          <div className="w-72 border-l border-white/5 bg-black/20 flex flex-col">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Verifiable Sources</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <AnimatePresence>
                {showSources && [12, 17, 24].map((page, i) => (
                  <motion.div 
                    key={page}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 border border-white/5 rounded-xl shadow-sm space-y-2 group cursor-pointer hover:border-primary/40 transition-all hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary uppercase">Page {page}</span>
                      <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[10px] text-zinc-500 italic leading-relaxed line-clamp-2">"...revenue increase driven by enterprise segment growth across..."</p>
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