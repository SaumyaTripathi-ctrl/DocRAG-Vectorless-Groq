'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Upload, FileText, CheckCircle2, FileJson, FileBox } from 'lucide-react';
import { useRef } from 'react';

const MOCK_FILES = [
  { name: 'Annual_Report.pdf', size: '2.4 MB', icon: FileText, color: 'text-red-500' },
  { name: 'Research_Paper.docx', size: '1.1 MB', icon: FileText, color: 'text-blue-500' },
  { name: 'Meeting_Notes.txt', size: '42 KB', icon: FileText, color: 'text-zinc-500' },
];

export function UploadSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Small document icons travel downward as we scroll to the chat section
  const iconY = useTransform(scrollYProgress, [0.4, 0.8], [0, 200]);
  const iconOpacity = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 1, 0]);

  return (
    <section ref={sectionRef} className="py-32 bg-zinc-50 border-y border-zinc-100 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Step 1: Upload Your Knowledge</h2>
          <p className="text-zinc-500 mt-2 text-lg">Select the documents you want to chat with.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] border border-zinc-200 p-10 shadow-sm relative overflow-hidden"
        >
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-zinc-100 rounded-[1.5rem] p-16 text-center hover:border-indigo-200 transition-all cursor-pointer bg-zinc-50/30 mb-8 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100 group-hover:scale-105 transition-all">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Drag & drop files here</h3>
            <p className="text-sm text-zinc-400 mt-1">PDF, DOCX, PPTX up to 50MB</p>
          </div>

          {/* File List */}
          <div className="space-y-4">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center">
                    <file.icon className={`w-6 h-6 ${file.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{file.name}</h4>
                    <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Ready</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transitional Icons: Documents traveling to Chat */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-20 flex flex-col items-center gap-4 pointer-events-none z-20">
        {[FileText, FileJson, FileBox].map((Icon, i) => (
          <motion.div
            key={i}
            style={{ y: iconY, opacity: iconOpacity }}
            className="w-10 h-10 bg-white border border-zinc-200 rounded-lg shadow-lg flex items-center justify-center"
          >
            <Icon className="w-5 h-5 text-indigo-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
