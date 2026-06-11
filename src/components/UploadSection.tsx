'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const MOCK_FILES = [
  { name: 'Annual_Report.pdf', size: '2.4 MB', icon: FileText, color: 'text-red-500' },
  { name: 'Research_Paper.docx', size: '1.1 MB', icon: FileText, color: 'text-blue-500' },
  { name: 'Meeting_Notes.txt', size: '42 KB', icon: FileText, color: 'text-zinc-500' },
];

export function UploadSection() {
  return (
    <section className="py-32 bg-zinc-50 border-y border-zinc-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Upload Your Knowledge</h2>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Select the documents you want to chat with.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 shadow-sm"
        >
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-16 text-center transition-all cursor-pointer bg-zinc-50/30 mb-8 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100 group-hover:scale-105 transition-all">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Drag & drop files here</h3>
            <p className="text-sm text-zinc-400 mt-1 font-medium">PDF, DOCX, PPTX up to 50MB</p>
          </div>

          {/* File List */}
          <div className="space-y-4">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                      <file.icon className={`w-6 h-6 ${file.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{file.name}</h4>
                      <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">{file.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.2) + 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Ready</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  </div>
                </div>

                <div className="relative h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2 + 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-indigo-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
