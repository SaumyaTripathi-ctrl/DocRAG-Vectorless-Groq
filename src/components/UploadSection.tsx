'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UploadSection({ onFilesAdded }: { onFilesAdded: (files: File[]) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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
    <section id="upload" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-headline font-bold mb-4">Step 1: Upload Documents</h2>
          <p className="text-muted-foreground font-body text-lg">Build your custom intelligence engine in seconds.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-[3rem] p-16 transition-all flex flex-col items-center justify-center min-h-[450px] overflow-hidden ${
            dragActive ? 'border-primary bg-primary/5 scale-[1.02] shadow-2xl' : 'border-slate-200 hover:border-primary/40 bg-slate-50/50'
          }`}
        >
          <motion.div 
            animate={{ y: dragActive ? -10 : 0 }}
            className="bg-primary p-6 rounded-[2rem] mb-8 shadow-xl shadow-primary/20 text-white"
          >
            <UploadCloud className="w-14 h-14" />
          </motion.div>
          
          <h3 className="text-2xl font-headline font-semibold mb-3">Drop files here to start</h3>
          <p className="text-muted-foreground mb-10 text-center max-w-sm">Support for PDF, DOCX, PPTX, or TXT up to 50MB. All data is processed securely.</p>
          
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
            <Button size="lg" className="rounded-full px-12 h-14 bg-primary hover:bg-primary/90 text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
              Choose Files
            </Button>
          </div>

          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {uploadedFiles.map((file, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                      </div>
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeFile(i)} 
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}