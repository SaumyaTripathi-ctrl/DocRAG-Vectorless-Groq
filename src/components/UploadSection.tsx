'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_FILES = [
  { name: 'Annual Report 2023.pdf', size: '2.4 MB' },
  { name: 'Growth Strategy.docx', size: '1.1 MB' },
];

export function UploadSection() {
  return (
    <section className="py-32 bg-zinc-50/50 border-y border-zinc-100">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Step 1: Build Your Context</h2>
          <p className="text-zinc-500 mt-2 text-lg">Securely upload your files. Encrypted, private, and isolated.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm relative overflow-hidden"
        >
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-zinc-100 rounded-2xl p-12 text-center hover:border-indigo-200 transition-all cursor-pointer bg-zinc-50/30 mb-8 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100 group-hover:scale-105 transition-all">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Drag & drop files here</h3>
            <p className="text-sm text-zinc-400 mt-1">PDF, DOCX, PPTX up to 50MB</p>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{file.name}</h4>
                    <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <button className="text-zinc-300 hover:text-zinc-900 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="rounded-full px-12 h-14 text-lg font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-md">
              Process Knowledge
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}