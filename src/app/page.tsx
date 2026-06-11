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
      
      <main>
        {/* The Hero component now handles the large scroll-transition Story */}
        <Hero />
        
        {/* Product Sections */}
        <UploadSection />
        <ChatLayout />
        <Benefits />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}