'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Database, Sparkles, Send, User, Loader2, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { WorkspaceDocument } from '@/app/page';
import { askQuestion } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
};

interface ChatLayoutProps {
  documents: WorkspaceDocument[];
}

const getDocColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'PDF': return 'text-rose-500 bg-rose-50 border-rose-100';
    case 'DOCX': return 'text-blue-500 bg-blue-50 border-blue-100';
    case 'PPTX': return 'text-orange-500 bg-orange-50 border-orange-100';
    case 'TXT': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    default: return 'text-indigo-500 bg-indigo-50 border-indigo-100';
  }
};

export function ChatLayout({ documents }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const context = documents.map(d => `Document: ${d.name}\n${d.content}`).join('\n\n');
      const response = await askQuestion(text, context);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.answer,
        sources: documents.length > 0 ? documents.map(d => d.name) : []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 overflow-hidden relative min-h-screen flex flex-col">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 flex-1 flex flex-col relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-6 border border-indigo-100/50 shadow-sm">
            Step 2: Converse
          </div>
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight lg:text-5xl">Chat with your Knowledge</h2>
          <p className="text-lg font-medium text-zinc-500 mt-4 leading-relaxed">Ask questions across all your uploaded documents simultaneously.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 max-w-6xl mx-auto w-full h-[750px] border border-zinc-200/60 rounded-[3rem] bg-white/80 backdrop-blur-2xl flex shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative group"
        >
          {/* Sidebar - Knowledge Base */}
          <div className="w-80 border-r border-zinc-100 bg-zinc-50/50 flex flex-col hidden lg:flex">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                  <Layout className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Knowledge Base</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {documents.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100">
                    <Database className="w-6 h-6 text-zinc-300" />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">No active documents</p>
                </div>
              ) : (
                documents.map((doc, i) => {
                  const colorClasses = getDocColor(doc.type);
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-5 rounded-[1.75rem] text-xs bg-white border border-zinc-100 text-zinc-900 font-bold shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm border", colorClasses)}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{doc.name}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">{doc.size} • {doc.type}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 flex flex-col bg-white/40">
            <div 
              ref={scrollRef}
              className="flex-1 p-8 lg:p-12 overflow-y-auto space-y-10 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                    <Sparkles className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xl text-zinc-900">Agent Ready</h4>
                    <p className="text-sm text-zinc-500 max-w-[280px]">Ask a question about your documents to begin synthesis.</p>
                  </div>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-5'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-100 border-2 border-white">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "relative max-w-[85%] lg:max-w-[75%] p-6 rounded-[2.25rem] text-[15px] font-medium leading-relaxed shadow-sm",
                        msg.role === 'user' 
                          ? 'bg-zinc-900 text-white rounded-tr-sm shadow-zinc-200' 
                          : 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-sm'
                      )}>
                        {msg.content}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-5 pt-5 border-t border-zinc-100 flex flex-wrap gap-2">
                            {msg.sources.slice(0, 3).map((src, idx) => (
                              <span key={idx} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-indigo-100/50">
                                <Database className="w-3.5 h-3.5" /> {src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 ml-4 border border-zinc-200 shadow-sm">
                          <User className="w-6 h-6 text-zinc-500" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex justify-start gap-5">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white border border-zinc-100 p-6 rounded-[2.25rem] rounded-tl-sm flex items-center gap-4">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">Synthesizing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-10 pt-0">
              <div className="flex gap-4 bg-zinc-50 border border-zinc-200 rounded-[3rem] p-4 transition-all focus-within:ring-[6px] focus-within:ring-indigo-600/5 focus-within:border-indigo-600/30">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={documents.length > 0 ? "Ask a question about your knowledge..." : "Upload documents to activate agent"}
                  disabled={documents.length === 0 || isLoading}
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-6 h-14 text-base font-medium placeholder:text-zinc-400"
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={documents.length === 0 || isLoading || !inputValue.trim()}
                  size="icon" 
                  className="bg-indigo-600 hover:bg-indigo-700 w-14 h-14 rounded-[2rem] shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all shrink-0"
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-center mt-5 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em]">Proprietary Synthesis Model v1.0.4</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}