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

  return (
    <div className="min-h-screen font-body selection:bg-indigo-100 selection:text-indigo-900 bg-white">
      <Navigation />
      
      <main className="relative">
        <Hero />
        
        <div id="product-workspace" className="space-y-0">
          <UploadSection onUpload={handleUpload} isProcessing={isProcessing} />
          
          <div id="workspace-chat">
            <ChatLayout documents={uploadedDocs} />
          </div>
        </div>

        <Benefits />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
