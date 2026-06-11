'use client';

import { Navigation } from '@/components/Navigation';
import { VisualStory } from '@/components/VisualStory';
import { Benefits } from '@/components/Benefits';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-body selection:bg-primary/20 overflow-x-hidden">
      <Navigation />
      
      <main>
        {/* The primary futuristic scroll experience */}
        <VisualStory />
        
        {/* Remaining sections fade in naturally below the story */}
        <div className="relative z-10 bg-background">
          <Benefits />
          <FinalCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}
