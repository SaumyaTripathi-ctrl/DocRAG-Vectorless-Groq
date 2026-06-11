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
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold text-slate-900">Upload Your Documents</h2>
          <p className="text-slate-500 mt-2">Get started by dragging your research materials here.</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors group cursor-pointer bg-slate-50/50 mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Click or drag files to upload</h3>
            <p className="text-sm text-slate-400 mt-1">PDF, DOCX, PPTX up to 50MB each</p>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {MOCK_FILES.map((file, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{file.name}</h4>
                    <span className="text-xs text-slate-400">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {file.status === 'uploading' ? (
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${file.progress}%` }} />
                    </div>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <button className="text-slate-300 hover:text-slate-900 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button className="rounded-full px-12 h-14 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white">
              Process All Documents
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
