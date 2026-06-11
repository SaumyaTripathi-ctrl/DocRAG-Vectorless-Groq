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
    <div className="min-h-screen font-body selection:bg-indigo-100 selection:text-indigo-900 bg-white">
      <Navigation />
      
      <main className="relative">
        {/* Section 1: Hero */}
        <Hero />
        
        {/* Section 2: Upload Documents */}
        <UploadSection />
        
        {/* Section 3: Chat with Agent */}
        <ChatLayout />
        
        {/* Section 4: Benefits */}
        <Benefits />
        
        {/* Section 5: CTA */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
