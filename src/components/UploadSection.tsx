'use client';

import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { WorkspaceDocument } from '@/app/page';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onUpload: (docs: WorkspaceDocument[]) => void;
  isProcessing: boolean;
}

export function UploadSection({ onUpload, isProcessing }: UploadSectionProps) {
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    
    // Read uploaded files using FileReader and store as Base64 Data URLs
    const readDocs = await Promise.all(
      fileList.map(file => {
        return new Promise<WorkspaceDocument>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Data = event.target?.result as string;
            resolve({
              name: file.name,
              size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
              type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
              content: base64Data
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onUpload(readDocs);
    toast({
      title: "Documents Received",
      description: `Analyzing ${readDocs.length} file${readDocs.length > 1 ? 's' : ''}...`,
    });
  };

  return (
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-70" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-70" />

      <div className="container mx-auto px-6 max-w-4xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-8 border border-indigo-100 shadow-sm">
            Step 1: Ingest
          </div>
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight lg:text-5xl">Upload Your Knowledge</h2>
          <p className="text-zinc-500 mt-6 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Import your PDFs, reports, or research papers to unlock conversational intelligence.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3.5rem] border border-zinc-200 p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] relative group overflow-hidden"
        >
          <label className="border-2 border-dashed border-zinc-100 rounded-[2.5rem] p-24 text-center transition-all cursor-pointer bg-zinc-50/50 hover:bg-indigo-50/10 hover:border-indigo-200 block group relative">
            <input 
              type="file" 
              multiple 
              className="hidden" 
              accept=".pdf,.docx,.pptx,.txt"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-zinc-100 text-indigo-600"
              >
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12" />
                )}
              </motion.div>
              
              <h3 className="text-3xl font-bold text-zinc-900 mb-3">
                {isProcessing ? 'Analyzing...' : 'Drop files to start'}
              </h3>
              <p className="text-zinc-400 font-medium text-lg">PDF, DOCX, PPTX or TXT files up to 50MB</p>
              
              <div className="mt-12 flex justify-center gap-4 opacity-40">
                <FileText className="w-6 h-6" />
                <div className="w-px h-6 bg-zinc-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">Encrypted Locally</span>
              </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-500 -z-10" />
          </label>
        </motion.div>
      </div>
    </section>
  );
}