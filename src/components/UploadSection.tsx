'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { WorkspaceDocument } from '@/app/page';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onUpload: (docs: WorkspaceDocument[]) => void;
  isProcessing: boolean;
}

export function UploadSection({ onUpload, isProcessing }: UploadSectionProps) {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: WorkspaceDocument[] = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      // In a real app, we'd extract text from the file here. 
      // For this prototype, we'll use placeholder content.
      content: `This is the extracted content of ${file.name}. It contains important information about the topic discussed in the document.`
    }));

    onUpload(newDocs);
    toast({
      title: "Files received",
      description: `Processing ${newDocs.length} documents...`,
    });
  };

  return (
    <section className="py-40 bg-zinc-50 border-y border-zinc-100 relative overflow-visible">
      <div className="container mx-auto px-6 max-w-4xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Step 1: Ingest
          </div>
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight">Upload Your Knowledge</h2>
          <p className="text-zinc-500 mt-4 text-xl font-medium">Add your PDFs, reports, or notes to start the conversation.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] border border-zinc-200 p-10 shadow-sm relative z-10"
        >
          <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] blur-3xl -z-10" />

          <label className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-20 text-center transition-all cursor-pointer bg-zinc-50/30 mb-0 group relative overflow-hidden block hover:border-indigo-200 hover:bg-indigo-50/10">
            <input 
              type="file" 
              multiple 
              className="hidden" 
              accept=".pdf,.docx,.pptx,.txt"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100 group-hover:scale-105 transition-all">
              {isProcessing ? (
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-indigo-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-zinc-900">
              {isProcessing ? 'Analyzing Documents...' : 'Click or drag files here'}
            </h3>
            <p className="text-base text-zinc-400 mt-2 font-medium">PDF, DOCX, PPTX up to 50MB</p>
          </label>
        </motion.div>
      </div>
    </section>
  );
}
