'use client';

import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { ChatLayout } from '@/components/ChatLayout';
import { Benefits } from '@/components/Benefits';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-body selection:bg-primary/30 overflow-x-hidden bg-background">
      <Navigation />
      
      <main className="space-y-0">
        <Hero />
        <UploadSection />
        <ChatLayout />
        <Benefits />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}