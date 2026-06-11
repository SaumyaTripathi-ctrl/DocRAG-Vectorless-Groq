'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, Brain, Quote, ChevronRight, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { askQuestion, getFollowUps } from '@/app/actions';

interface Message {
  role: 'user' | 'model';
  content: string;
  displayContent?: string;
  isTyping?: boolean;
}

export function ChatLayout({ documents }: { documents: File[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [activeSources, setActiveSources] = useState<{ doc: string; page: number; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const typeMessage = async (index: number, fullText: string) => {
    let current = "";
    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      setMessages(prev => {
        const next = [...prev];
        next[index] = { ...next[index], displayContent: current };
        return next;
      });
      // Fast typing for technical feel
      await new Promise(r => setTimeout(r, 15));
    }
    setMessages(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isTyping: false };
      return next;
    });
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', content: text, displayContent: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setFollowUps([]);
    setActiveSources([]);

    // Simulate context extraction
    const mockContext = "The annual report indicates that revenue has grown by 23% in the last fiscal year, reaching $4.5 million. Our customer base expanded significantly in the EMEA region.";
    
    try {
      const response = await askQuestion(text, mockContext);
      const modelMsgIndex = messages.length + 1;
      const modelMsg: Message = { 
        role: 'model', 
        content: response.answer, 
        displayContent: "", 
        isTyping: true 
      };
      
      setMessages(prev => [...prev, modelMsg]);
      setLoading(false);

      await typeMessage(modelMsgIndex, response.answer);

      // Show sources after typing
      setActiveSources([
        { doc: documents[0]?.name || "AnnualReport.pdf", page: 12, text: "The growth in revenue (23%) was driven primarily by cloud services..." }
      ]);

      const suggestions = await getFollowUps([...messages, userMsg, { role: 'model', content: response.answer }]);
      setFollowUps(suggestions);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 bg-[#FBFBFF] relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-headline font-bold mb-4">Step 2: Research & Chat</h2>
          <p className="text-muted-foreground font-body text-lg">Instant insights with deep-linked citations.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row h-[750px] overflow-hidden"
        >
          {/* Left: Knowledge Base */}
          <div className="w-full lg:w-72 border-r bg-slate-50/40 p-8 overflow-y-auto hidden lg:block">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Intelligence Source</h4>
            <div className="space-y-4">
              {documents.length > 0 ? documents.map((doc, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="truncate font-medium">{doc.name}</span>
                </motion.div>
              )) : (
                <div className="text-xs text-muted-foreground text-center py-20 opacity-40">
                  Ready for documents...
                </div>
              )}
            </div>
          </div>

          {/* Center: Chat Hub */}
          <div className="flex-1 flex flex-col relative min-w-0 bg-white">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Research Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-medium">Neural Engine Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-slate-400" />
                  </motion.div>
                  <p className="font-medium text-lg max-w-[200px]">Ask your documents anything.</p>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[1.5rem] ${
                    m.role === 'user' 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 rounded-tr-sm' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.displayContent}</p>
                    {m.isTyping && <span className="inline-block w-1.5 h-4 bg-primary/30 animate-pulse ml-1 align-middle" />}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 p-5 rounded-[1.5rem] rounded-tl-sm border border-slate-100 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Synthesizing...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-8 space-y-6">
              <AnimatePresence>
                {followUps.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 flex-wrap"
                  >
                    {followUps.map((q, i) => (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-[11px] bg-white text-primary border border-primary/20 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-primary/5 transition-all"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-inner focus-within:ring-2 ring-primary/20 transition-all"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your knowledge..."
                  className="border-none bg-transparent focus-visible:ring-0 shadow-none text-base p-4 h-12"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !input.trim()} 
                  size="icon" 
                  className="rounded-xl shrink-0 h-12 w-12 bg-primary shadow-lg shadow-primary/30 transition-all active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Citations Panel */}
          <div className="w-full lg:w-80 border-l bg-slate-50/40 p-8 overflow-y-auto hidden xl:block">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Verified Sources</h4>
            <div className="space-y-6">
              <AnimatePresence>
                {activeSources.map((source, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Quote className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary truncate max-w-[120px]">{source.doc}</span>
                      </div>
                      <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">PAGE {source.page}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                      "{source.text}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {activeSources.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-24 opacity-30 italic">
                  Citations appear here.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}