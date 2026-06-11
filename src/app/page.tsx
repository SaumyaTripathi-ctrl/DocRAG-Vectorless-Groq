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
        {/* Step 1: Documents & Intro */}
        <Hero />
        
        {/* Step 2: Upload Action */}
        <UploadSection />
        
        {/* Step 3: Product Showcase */}
        <ChatLayout />
        
        {/* Final Context */}
        <Benefits />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
