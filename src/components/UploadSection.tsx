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
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Upload Your Documents</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Secure and isolated ingestion for private analysis.</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl relative overflow-hidden">
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-100 rounded-2xl p-12 text-center hover:border-primary/40 transition-all group cursor-pointer bg-slate-50/50 mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-50 group-hover:scale-105 transition-all">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Click or drag files to upload</h3>
            <p className="text-sm text-slate-400 mt-1">PDF, DOCX, PPTX up to 50MB each</p>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {MOCK_FILES.map((file, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-white hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{file.name}</h4>
                    <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">{file.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {file.status === 'uploading' ? (
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        className="h-full bg-primary" 
                      />
                    </div>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <button className="text-slate-300 hover:text-slate-900 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="rounded-full px-12 h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl">
              Process All Documents
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
