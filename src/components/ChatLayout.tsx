'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Send, Brain, Quote, ChevronRight, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { askQuestion, getFollowUps } from '@/app/actions';

interface Message {
  role: 'user' | 'model';
  content: string;
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
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setFollowUps([]);

    // Simulate RAG call
    // In a real app, we'd extract text from the actual uploaded files
    const mockContext = "The annual report indicates that revenue has grown by 23% in the last fiscal year, reaching $4.5 million. Our customer base expanded significantly in the EMEA region.";
    
    try {
      const response = await askQuestion(text, mockContext);
      const modelMsg: Message = { role: 'model', content: response.answer };
      setMessages(prev => [...prev, modelMsg]);

      // Mock sources
      setActiveSources([
        { doc: documents[0]?.name || "AnnualReport.pdf", page: 12, text: "The growth in revenue (23%) was driven primarily by cloud services..." }
      ]);

      // Get follow ups
      const suggestions = await getFollowUps([...messages, userMsg, modelMsg]);
      setFollowUps(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 bg-[#FBFBFF]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold mb-4">Step 2: Chat With Agent</h2>
          <p className="text-muted-foreground font-body">Ask questions and get citation-backed answers.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border flex flex-col lg:flex-row h-[700px] overflow-hidden">
          {/* Left: Document List */}
          <div className="w-full lg:w-64 border-r bg-slate-50/50 p-6 overflow-y-auto hidden lg:block">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Knowledge Base</h4>
            <div className="space-y-3">
              {documents.length > 0 ? documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white border rounded-xl shadow-sm text-sm">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
              )) : (
                <div className="text-xs text-muted-foreground text-center py-10 italic">
                  No documents uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Center: Chat Interface */}
          <div className="flex-1 flex flex-col relative min-w-0">
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">AI Research Assistant</h3>
                  <p className="text-[10px] text-green-500 font-medium">Online • Semantic Engine Active</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-50">
                  <MessageSquare className="w-12 h-12" />
                  <p>Start a conversation with your documents.</p>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-800 border'
                    }`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl border flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Synthesizing information...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Follow-up Questions */}
            <AnimatePresence>
              {followUps.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-6 py-2 flex gap-2 flex-wrap"
                >
                  {followUps.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20 font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex gap-2 bg-slate-50 border rounded-2xl p-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your documents..."
                  className="border-none bg-transparent focus-visible:ring-0 shadow-none text-sm"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !input.trim()} 
                  size="icon" 
                  className="rounded-xl shrink-0 h-10 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Source References */}
          <div className="w-full lg:w-72 border-l bg-slate-50/50 p-6 overflow-y-auto hidden xl:block">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Sources & Citations</h4>
            <div className="space-y-4">
              {activeSources.map((source, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="p-4 bg-white rounded-xl border shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Quote className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold text-primary truncate max-w-[120px]">{source.doc}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium">Page {source.page}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    "...{source.text}..."
                  </p>
                </motion.div>
              ))}

              {activeSources.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-10 italic">
                  Citations will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
