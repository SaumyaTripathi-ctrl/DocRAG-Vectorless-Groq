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
    <section className="py-40 bg-zinc-50 border-y border-zinc-100 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight">Upload Your Knowledge</h2>
          <p className="text-zinc-500 mt-4 text-xl font-medium">The documents gathered above are now ready for processing.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[3rem] border border-zinc-200 p-10 shadow-sm relative"
        >
          {/* Decorative Reaction Effect when the scroll animation "lands" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] blur-3xl -z-10"
          />

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-20 text-center transition-all cursor-pointer bg-zinc-50/30 mb-10 group relative">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 group-hover:scale-105 transition-all">
              <Upload className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">Release documents here</h3>
            <p className="text-base text-zinc-400 mt-2 font-medium">PDF, DOCX, PPTX up to 50MB</p>
          </div>

          {/* File List */}
          <div className="space-y-5">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
                className="flex flex-col p-6 rounded-[1.5rem] border border-zinc-100 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center">
                      <file.icon className={`w-7 h-7 ${file.color}`} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{file.name}</h4>
                      <span className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase">{file.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.2) + 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase">Complete</span>
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  </div>
                </div>

                <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.2 + 0.6, ease: "easeInOut" }}
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
