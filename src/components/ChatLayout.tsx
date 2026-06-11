'use client';

import { motion } from 'framer-motion';
import { MessageSquare, FileText, ChevronRight, Search, Layout, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatLayout() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Step 2: Start the Conversation</h2>
          <p className="text-lg text-zinc-500">Query across your entire knowledge base. Get answers with verifiable citations.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto h-[600px] border border-zinc-200 rounded-[2.5rem] bg-white flex shadow-2xl overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-64 border-r border-zinc-100 bg-zinc-50/30 flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Layout className="w-3 h-3 text-indigo-600" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Documents</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {['Annual_Report.pdf', 'Growth_Strategy.docx', 'Tech_Audit.txt'].map((doc, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 p-3 rounded-xl text-[11px] transition-all ${i === 0 ? 'bg-white border border-zinc-100 text-zinc-900 font-bold shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}`}
                >
                  <FileText className={`w-3.5 h-3.5 ${i === 0 ? 'text-indigo-500' : 'text-zinc-300'}`} />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="flex justify-end">
                <div className="bg-zinc-900 text-white p-4 rounded-2xl rounded-tr-sm text-sm max-w-[80%] font-medium">
                  What are the key financial findings from the report?
                </div>
              </div>

              <div className="flex justify-start gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl rounded-tl-sm text-sm max-w-[90%] leading-relaxed text-zinc-600">
                  <div className="text-[10px] font-bold text-indigo-600 mb-2 uppercase tracking-widest">AI Agent</div>
                  Based on the provided documents, revenue increased by 23% YoY. This was primarily driven by the expansion of the SaaS enterprise segment, while operating expenses were reduced by 12% through optimization.
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-2 pr-2">
                <div className="flex-1 flex items-center px-4 text-zinc-400 text-sm">
                  Ask your documents...
                </div>
                <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 w-10 h-10 rounded-xl">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Citations Panel */}
          <div className="w-72 border-l border-zinc-100 bg-zinc-50/30 flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Database className="w-3 h-3 text-indigo-600" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Sources</h3>
            </div>
            <div className="flex-1 p-6 space-y-4">
              {[12, 17, 24].map((page, i) => (
                <div 
                  key={page}
                  className="p-4 bg-white border border-zinc-100 rounded-xl shadow-sm space-y-2 group cursor-pointer hover:border-indigo-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase">Page {page}</span>
                    <Search className="w-3 h-3 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <p className="text-[10px] text-zinc-400 italic leading-relaxed line-clamp-2">"...revenue increase driven by enterprise segment growth across..."</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}