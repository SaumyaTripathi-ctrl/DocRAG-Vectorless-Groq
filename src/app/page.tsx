'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { ChatLayout } from '@/components/ChatLayout';
import { Benefits } from '@/components/Benefits';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [docs, setDocs] = useState<File[]>([]);

  const handleFilesAdded = (files: File[]) => {
    setDocs(prev => [...prev, ...files]);
    // Optionally auto-scroll to chat or keep context
  };

  return (
    <div className="min-h-screen font-body selection:bg-primary/20">
      <Navigation />
      
      <main>
        <Hero />
        
        <UploadSection onFilesAdded={handleFilesAdded} />
        
        <ChatLayout documents={docs} />
        
        <Benefits />
        
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
