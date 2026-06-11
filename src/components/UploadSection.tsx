'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UploadSection({ onFilesAdded }: { onFilesAdded: (files: File[]) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      onFilesAdded(filesArray);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <section id="upload" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold mb-4">Step 1: Upload Documents</h2>
          <p className="text-muted-foreground font-body">Get your knowledge base ready in seconds.</p>
        </div>

        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center min-h-[400px] ${
            dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <UploadCloud className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-headline font-semibold mb-2">Drag and drop files here</h3>
          <p className="text-muted-foreground mb-8">PDF, DOCX, PPTX, or TXT up to 50MB</p>
          
          <div className="relative">
            <input 
              type="file" 
              multiple 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => {
                if(e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  setUploadedFiles(prev => [...prev, ...filesArray]);
                  onFilesAdded(filesArray);
                }
              }}
            />
            <Button size="lg" className="rounded-full px-10">Select Files</Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
