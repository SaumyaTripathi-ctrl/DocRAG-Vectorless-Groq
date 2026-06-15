'use client';

import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { ChatLayout } from '@/components/ChatLayout';
import { Benefits } from '@/components/Benefits';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

export type WorkspaceDocument = {
  name: string;
  content: string;
  type: string;
  size: string;
};

export default function Home() {
  const [uploadedDocs, setUploadedDocs] = useState<WorkspaceDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (docs: WorkspaceDocument[]) => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setUploadedDocs(prev => [...prev, ...docs]);
      setIsProcessing(false);
      // Scroll to chat
      document.getElementById('workspace-chat')?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
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
