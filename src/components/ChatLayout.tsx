'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Layout, Database, Sparkles, Plus, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { WorkspaceDocument } from '@/app/page';
import { askQuestion } from '@/app/actions';
import { Input } from '@/components/ui/input';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
};

interface ChatLayoutProps {
  documents: WorkspaceDocument[];
}

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

    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Combine all document contents for context
      const context = documents.map(d => `Document: ${d.name}\n${d.content}`).join('\n\n');
      const response = await askQuestion(inputValue, context);
      
      const assistantMsg: Message = { 
        role: 'assistant', 
        content: response.answer,
        sources: documents.length > 0 ? [documents[0].name] : [] 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 bg-zinc-50/30 overflow-hidden relative min-h-screen flex flex-col">
      <div className="floating-blob bottom-0 right-0 opacity-30" />
      
      <div className="container mx-auto px-6 flex-1 flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Step 2: Converse
          </div>
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight lg:text-5xl">Chat with your Knowledge</h2>
          <p className="text-lg font-medium text-zinc-500 mt-4 leading-relaxed">Ask questions across all your uploaded documents simultaneously.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 max-w-6xl mx-auto w-full h-[700px] border border-zinc-200 rounded-[3rem] bg-white flex shadow-2xl shadow-zinc-200/80 overflow-hidden relative group"
        >
          {/* Sidebar - Knowledge Base */}
          <div className="w-72 border-r border-zinc-100 bg-zinc-50/80 backdrop-blur-md flex flex-col hidden lg:flex">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Layout className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Knowledge Base</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2.5 custom-scrollbar">
              {documents.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Database className="w-5 h-5 text-zinc-300" />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">No documents yet</p>
                </div>
              ) : (
                documents.map((doc, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-2xl text-xs bg-white border border-zinc-200 text-zinc-900 font-bold shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50">
                      <FileText className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{doc.name}</span>
                      <span className="text-[9px] text-zinc-400 font-medium">{doc.size}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 flex flex-col bg-white relative">
            <div 
              ref={scrollRef}
              className="flex-1 p-8 lg:p-10 overflow-y-auto space-y-8 custom-scrollbar bg-white"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Start the conversation</h4>
                    <p className="text-sm text-zinc-500">Ask a question about your uploaded documents.</p>
                  </div>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-4'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`relative max-w-[85%] lg:max-w-[75%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-sm shadow-xl shadow-zinc-200' 
                        : 'bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-tl-sm'
                    }`}>
                      {msg.content}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-zinc-200/50 flex flex-wrap gap-2">
                          {msg.sources.map((src, idx) => (
                            <span key={idx} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-indigo-100">
                              <Database className="w-3 h-3" /> {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 ml-4 border border-zinc-200">
                        <User className="w-5 h-5 text-zinc-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex justify-start gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-[2rem] rounded-tl-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Agent is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 pt-0">
              <div className="flex gap-4 bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-3 transition-all focus-within:ring-4 focus-within:ring-indigo-600/5 focus-within:border-indigo-600/20">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={documents.length > 0 ? "Ask your documents anything..." : "Upload documents to start chatting"}
                  disabled={documents.length === 0 || isLoading}
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-6 h-14 text-sm font-medium placeholder:text-zinc-400"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={documents.length === 0 || isLoading || !inputValue.trim()}
                  size="icon" 
                  className="bg-indigo-600 hover:bg-indigo-700 w-14 h-14 rounded-3xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-center mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.3em]">AI Agent Powered by DocuMind v1.0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
