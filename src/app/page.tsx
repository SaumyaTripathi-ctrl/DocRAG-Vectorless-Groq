'use client';

import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { ChatLayout } from '@/components/ChatLayout';
import { Benefits } from '@/components/Benefits';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { extractDocumentsAction } from './actions';

export type WorkspaceDocument = {
  name: string;
  content: string;
  type: string;
  size: string;
};

export default function Home() {
  const [uploadedDocs, setUploadedDocs] = useState<WorkspaceDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (docs: WorkspaceDocument[]) => {
    setIsProcessing(true);
    try {
      // Send base64 to server to extract plain text
      const extracted = await extractDocumentsAction(
        docs.map(d => ({ name: d.name, content: d.content }))
      );

      const parsedDocs = docs.map((d, index) => ({
        ...d,
        content: extracted[index].text // replace base64 binary content with lightweight plain text
      }));

      setUploadedDocs(prev => [...prev, ...parsedDocs]);
      
      // Scroll to chat
      document.getElementById('workspace-chat')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error("Text extraction failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetWorkspace = () => {
    setUploadedDocs([]);
  };

  return (
    <div className="min-h-screen font-body selection:bg-indigo-100 selection:text-indigo-900 bg-white relative">
      {/* Persistent Professional Background Layer */}
      <div className="fixed inset-0 bg-mesh bg-grid -z-20 pointer-events-none opacity-60" />
      
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        
        <div id="product-workspace" className="space-y-0">
          <UploadSection onUpload={handleUpload} isProcessing={isProcessing} />
          
          <div id="workspace-chat">
            <ChatLayout documents={uploadedDocs} onResetWorkspace={handleResetWorkspace} />
          </div>
        </div>

        <Benefits />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
