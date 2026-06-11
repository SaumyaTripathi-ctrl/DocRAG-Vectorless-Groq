'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_FILES = [
  { name: 'Annual Report.pdf', size: '2.4 MB', status: 'uploaded' },
  { name: 'Research Paper.docx', size: '1.1 MB', status: 'uploaded' },
  { name: 'Meeting Notes.txt', size: '15 KB', status: 'uploading', progress: 65 },
  { name: 'Financial Data.csv', size: '4.8 MB', status: 'uploaded' },
];

export function UploadSection() {
  return (
    <section className="py-32 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-headline font-bold text-slate-900 tracking-tight">Upload Your Documents</h2>
          <p className="text-slate-500 mt-4 text-lg">Instant ingestion for secure, isolated document analysis.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-16 text-center hover:border-primary/40 transition-all group cursor-pointer bg-slate-50/30 mb-10 hover:bg-primary/5">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-100 group-hover:shadow-lg transition-all"
            >
              <Upload className="w-10 h-10 text-primary" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900">Click or drag files to upload</h3>
            <p className="text-base text-slate-400 mt-2">PDF, DOCX, PPTX up to 50MB each</p>
          </div>

          {/* File List */}
          <div className="space-y-4">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-white hover:border-primary/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{file.name}</h4>
                    <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {file.status === 'uploading' ? (
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        className="h-full bg-primary" 
                      />
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </motion.div>
                  )}
                  <button className="text-slate-300 hover:text-slate-900 transition-colors p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button className="rounded-full px-16 h-16 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all hover:scale-105">
              Process All Documents
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
