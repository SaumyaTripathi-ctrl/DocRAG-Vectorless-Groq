'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_FILES = [
  { name: 'Annual Report.pdf', size: '2.4 MB', status: 'uploaded' },
  { name: 'Research Paper.docx', size: '1.1 MB', status: 'uploaded' },
  { name: 'Financial Data.csv', size: '4.8 MB', status: 'uploaded' },
];

export function UploadSection() {
  return (
    <section className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Step 1: Secure Upload</h2>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Your data stays private. Encrypted and isolated.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center hover:border-primary/40 transition-all group/upload cursor-pointer bg-white/[0.02] mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover/upload:scale-110 group-hover/upload:bg-primary group-hover/upload:text-white transition-all">
              <Upload className="w-8 h-8 text-zinc-400 group-hover/upload:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white">Click or drag files</h3>
            <p className="text-sm text-zinc-500 mt-1">PDF, DOCX, PPTX up to 50MB</p>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{file.name}</h4>
                    <span className="text-[10px] font-medium text-zinc-500 tracking-widest uppercase">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <button className="text-zinc-600 hover:text-white transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button className="rounded-full px-12 h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200 shadow-xl transition-all hover:scale-105 active:scale-95">
              Process Knowledge
            </Button>
          </div>
        </motion.div>

        {/* Transition Visual */}
        <div className="flex flex-col items-center mt-12 opacity-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-primary" />
          </motion.div>
          <div className="flex gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="w-1 h-1 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}