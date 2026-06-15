'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Database, Sparkles, Send, User, Loader2, Layout, BookOpen, HelpCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { WorkspaceDocument } from '@/app/page';
import { askQuestion, generateNotesAction } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
};

interface ChatLayoutProps {
  documents: WorkspaceDocument[];
  onResetWorkspace?: () => void;
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

// Custom lightweight Markdown-to-JSX renderer supporting tables, headings, bold/italics, lists, and quiz callouts
function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let currentListType: 'bullet' | 'number' | null = null;
  let keyCounter = 0;
  
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (currentListType === 'bullet') {
        elements.push(
          <ul key={`ul-${keyCounter++}`} className="list-disc pl-6 my-3 space-y-1">
            {currentList}
          </ul>
        );
      } else if (currentListType === 'number') {
        elements.push(
          <ol key={`ol-${keyCounter++}`} className="list-decimal pl-6 my-3 space-y-1">
            {currentList}
          </ol>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerCells = tableRows[0];
      const bodyRows = tableRows.slice(1);
      
      const isDivider = (row: string[]) => row.every(cell => /^[\s:-]+$/.test(cell));
      let finalBodyRows = bodyRows;
      if (bodyRows.length > 0 && isDivider(bodyRows[0])) {
        finalBodyRows = bodyRows.slice(1);
      }

      elements.push(
        <div key={`table-wrapper-${keyCounter++}`} className="my-4 overflow-x-auto border border-zinc-200/60 rounded-2xl shadow-sm bg-white">
          <table className="w-full text-sm text-left text-zinc-600 border-collapse">
            <thead className="bg-zinc-50/70 text-xs text-zinc-700 uppercase font-bold border-b border-zinc-200">
              <tr>
                {headerCells.map((cell, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold border-r border-zinc-200/50 last:border-r-0">
                    {parseInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalBodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/20 transition-colors">
                  {headerCells.map((_, cIdx) => {
                    const cell = row[cIdx] || '';
                    return (
                      <td key={cIdx} className="px-6 py-4 border-r border-zinc-100/50 last:border-r-0 text-zinc-700">
                        {parseInline(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const parseInline = (lineText: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    let key = 0;
    
    const boldParts = lineText.split('**');
    boldParts.forEach((boldPart, boldIndex) => {
      const isBold = boldIndex % 2 === 1;
      
      const italicParts = boldPart.split('*');
      const italicElements = italicParts.map((italicPart, italicIndex) => {
        const isItalic = italicIndex % 2 === 1;
        if (isItalic) {
          return <em key={key++} className="italic text-zinc-800">{italicPart}</em>;
        }
        return italicPart;
      });

      if (isBold) {
        tokens.push(
          <strong key={key++} className="font-bold text-zinc-900">
            {italicElements}
          </strong>
        );
      } else {
        tokens.push(...italicElements);
      }
    });

    return tokens;
  };

  const isDividerLine = (str: string) => {
    const t = str.trim();
    return t.includes('|') && /^[|:\s-]+$/.test(t);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table Detection
    const hasPipe = trimmed.includes('|');
    const startsOrEndsWithPipe = trimmed.startsWith('|') || trimmed.endsWith('|');
    const nextLineIsDivider = (i + 1 < lines.length) && isDividerLine(lines[i + 1]);

    if (hasPipe && (inTable || startsOrEndsWithPipe || nextLineIsDivider)) {
      if (!inTable) {
        flushList();
        inTable = true;
      }
      let cells = line.split('|').map(c => c.trim());
      if (cells[0] === '') cells.shift();
      if (cells[cells.length - 1] === '') cells.pop();
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Correct Answer Callout
    const correctMatch = trimmed.match(/^(?:[-*+]\s+)?(?:✅\s*)?(?:\*\*)?Correct Answer(?:\*\*)?\s*:\s*(.*)$/i);
    if (correctMatch) {
      flushList();
      elements.push(
        <div key={`correct-${keyCounter++}`} className="my-4 p-4 bg-emerald-50/60 border border-emerald-200/80 border-l-4 border-l-emerald-500 rounded-r-2xl rounded-l-md flex items-start gap-3 shadow-sm transition-all hover:shadow-md">
          <span className="text-emerald-600 text-xl select-none leading-none mt-0.5">✅</span>
          <div className="text-emerald-900 text-sm leading-relaxed">
            <span className="font-bold block text-emerald-900 mb-0.5">Correct Answer</span>
            <span className="font-medium text-emerald-800">{parseInline(correctMatch[1])}</span>
          </div>
        </div>
      );
      continue;
    }

    // Explanation Callout
    const explanationMatch = trimmed.match(/^(?:[-*+]\s+)?(?:💡\s*)?(?:\*\*)?(?:Short\s+)?Explanation(?:\*\*)?\s*:\s*(.*)$/i);
    if (explanationMatch) {
      flushList();
      elements.push(
        <div key={`explanation-${keyCounter++}`} className="my-4 p-4 bg-amber-50/40 border border-amber-200/60 border-l-4 border-l-amber-500 rounded-r-2xl rounded-l-md flex items-start gap-3 shadow-sm transition-all hover:shadow-md">
          <span className="text-amber-500 text-xl select-none leading-none mt-0.5">💡</span>
          <div className="text-zinc-800 text-sm leading-relaxed">
            <span className="font-bold block text-amber-800 mb-0.5">Explanation</span>
            <span className="text-zinc-700">{parseInline(explanationMatch[1])}</span>
          </div>
        </div>
      );
      continue;
    }

    // Horizontal Separator
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`hr-${keyCounter++}`} className="my-6 border-t border-zinc-200" />);
      continue;
    }

    // Headings (supporting h1 to h6)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      
      let className = "font-bold text-zinc-900 ";
      if (level === 1) className += "text-2xl mt-6 mb-3";
      else if (level === 2) className += "text-xl mt-5 mb-2.5";
      else if (level === 3) className += "text-lg mt-4 mb-2";
      else className += "text-base mt-3 mb-1.5";

      const Tag = `h${level}` as any;

      elements.push(
        <Tag key={`h-${keyCounter++}`} className={className}>
          {parseInline(content)}
        </Tag>
      );
      continue;
    }

    // Bullet Lists
    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType !== 'bullet') {
        flushList();
        currentListType = 'bullet';
      }
      currentList.push(
        <li key={`li-${keyCounter++}`} className="text-zinc-700">
          {parseInline(bulletMatch[1])}
        </li>
      );
      continue;
    }

    // Numbered Lists
    const numberMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numberMatch) {
      if (currentListType !== 'number') {
        flushList();
        currentListType = 'number';
      }
      currentList.push(
        <li key={`li-${keyCounter++}`} className="text-zinc-700">
          {parseInline(numberMatch[1])}
        </li>
      );
      continue;
    }

    // Empty Lines
    if (trimmed === '') {
      flushList();
      elements.push(<div key={`spacer-${keyCounter++}`} className="h-2" />);
      continue;
    }

    // Plain Text / Paragraphs
    flushList();
    elements.push(
      <p key={`p-${keyCounter++}`} className="my-2.5 text-zinc-700 leading-relaxed">
        {parseInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="space-y-1">{elements}</div>;
}

export function ChatLayout({ documents, onResetWorkspace }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTools, setIsGeneratingTools] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, isGeneratingTools]);

  const handleGenerateNotes = async () => {
    if (isGeneratingTools || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: "Generate study notes for the uploaded documents." }]);
    setIsGeneratingTools(true);

    try {
      const context = documents.map(d => `Document: ${d.name}\n${d.content}`).join('\n\n');
      const response = await generateNotesAction(context);
      
      // Strip duplicate Agent Used tag if present in raw LLM response
      const cleanAnswer = response.answer.replace(/(?:[-*+_\s])*Agent\s+Used\s*:.*?(?:\n|$)/gi, '').trim();
      const assistantText = `${cleanAnswer}\n\n*Agent Used: ${response.agent}*`;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantText,
        sources: response.sources && response.sources.length > 0 ? response.sources : []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while generating study notes." }]);
    } finally {
      setIsGeneratingTools(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    if (onResetWorkspace) {
      onResetWorkspace();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isGeneratingTools) return;

    const text = inputValue;
    setInputValue("");

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const context = documents.map(d => `Document: ${d.name}\n${d.content}`).join('\n\n');
      const response = await askQuestion(text, context, history);
      
      // Strip duplicate Agent Used tag if present in raw LLM response
      const cleanAnswer = response.answer.replace(/(?:[-*+_\s])*Agent\s+Used\s*:.*?(?:\n|$)/gi, '').trim();
      const assistantText = `${cleanAnswer}\n\n*Agent Used: ${response.agent}*`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantText,
        sources: response.sources && response.sources.length > 0 ? response.sources : []
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
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight lg:text-5xl">Chat with Knowledge</h2>
          <p className="text-lg font-medium text-zinc-500 mt-4 leading-relaxed">Ask questions across all your uploaded documents simultaneously.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 max-w-6xl mx-auto w-full h-[750px] border border-zinc-200/60 rounded-[3rem] bg-white/80 backdrop-blur-2xl flex shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative"
        >
          {/* Sidebar - Knowledge Base */}
          <div className="w-80 border-r border-zinc-100 bg-zinc-50/30 flex flex-col hidden lg:flex">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200/50">
                  <Layout className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Knowledge Base</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {documents.length === 0 ? (
                <div className="text-center py-24 px-4">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100">
                    <Database className="w-7 h-7 text-zinc-200" />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">No active sources</p>
                </div>
              ) : (
                documents.map((doc, i) => {
                  const colorClasses = getDocColor(doc.type);
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-zinc-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer group"
                    >
                      <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm border shrink-0", colorClasses)}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">{doc.name}</span>
                        <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">{doc.size} • {doc.type}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            {documents.length > 0 && (
              <div className="p-6 border-t border-zinc-100 bg-zinc-50/10 space-y-3 shrink-0">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Workspace Actions</h4>
                <Button 
                  onClick={handleGenerateNotes} 
                  disabled={isGeneratingTools || isLoading}
                  className="w-full bg-white text-zinc-700 border border-zinc-200/60 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-200 rounded-2xl py-5 font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Generate Notes
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="w-full bg-white text-zinc-700 border border-zinc-200/60 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-200 rounded-2xl py-5 font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      New Chat
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem] border-zinc-100 bg-white/90 backdrop-blur-2xl p-8 max-w-md shadow-2xl">
                    <AlertDialogHeader className="space-y-3">
                      <AlertDialogTitle className="text-xl font-headline font-bold text-zinc-900">Start a new chat?</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium text-zinc-500 leading-relaxed">
                        This will remove uploaded documents and clear conversation history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 flex gap-3 sm:space-x-0">
                      <AlertDialogCancel className="flex-1 border-zinc-200 rounded-2xl py-6 font-bold text-xs hover:bg-zinc-50 text-zinc-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleNewChat}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-6 font-bold text-xs shadow-lg shadow-indigo-200"
                      >
                        Start New Chat
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Main Chat Interface */}
          <div className="flex-1 flex flex-col bg-white/40">
            <div 
              ref={scrollRef}
              className="flex-1 p-8 lg:p-12 overflow-y-auto space-y-10 custom-scrollbar scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-2xl text-zinc-900 tracking-tight">DocuMind AI Ready</h4>
                    <p className="text-sm text-zinc-500 max-w-[320px] font-medium leading-relaxed">
                      Upload documents to the knowledge base and ask me anything. I can synthesize across all sources simultaneously.
                    </p>
                  </div>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[90%] lg:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white",
                        msg.role === 'assistant' ? "bg-indigo-600 shadow-indigo-200" : "bg-white border-zinc-100"
                      )}>
                        {msg.role === 'assistant' ? (
                          <Sparkles className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className={cn(
                          "relative p-6 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-sm backdrop-blur-sm w-full overflow-hidden",
                          msg.role === 'user' 
                            ? 'bg-zinc-900 text-white rounded-tr-none' 
                            : 'bg-white/80 border border-zinc-100 text-zinc-800 rounded-tl-none'
                        )}>
                          {msg.role === 'user' ? (
                            msg.content
                          ) : (
                            <MarkdownRenderer text={msg.content} />
                          )}
                        </div>
                        
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2 px-1">
                            {msg.sources.slice(0, 3).map((src, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 transition-colors cursor-help"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                {src}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {(isLoading || isGeneratingTools) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 border-2 border-white">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 border border-zinc-100 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-4 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] animate-pulse">
                      {isGeneratingTools ? "Generating study resources..." : "Synthesizing Context..."}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
 
            {/* Input Area */}
            <div className="p-10 pt-0 bg-gradient-to-t from-white/80 to-transparent">
              <div className="flex gap-4 bg-zinc-50/50 backdrop-blur-md border border-zinc-200 rounded-[3rem] p-3 transition-all focus-within:ring-[6px] focus-within:ring-indigo-600/5 focus-within:border-indigo-600/30 group shadow-lg shadow-zinc-200/20">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    documents.length > 0 
                      ? "Ask anything about your sources..." 
                      : "Ingest documents to activate AI"
                  }
                  disabled={documents.length === 0 || isLoading || isGeneratingTools}
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-6 h-14 text-base font-medium placeholder:text-zinc-400"
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={documents.length === 0 || isLoading || isGeneratingTools || !inputValue.trim()}
                  size="icon" 
                  className="bg-indigo-600 hover:bg-indigo-700 w-14 h-14 rounded-full shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all shrink-0 hover:scale-105 active:scale-95"
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-6">
                <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.4em]">Gemini 1.5 Pro Enabled</p>
                <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.4em]">Zero Knowledge Encryption</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
