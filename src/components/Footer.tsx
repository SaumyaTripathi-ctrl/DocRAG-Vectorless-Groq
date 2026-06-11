'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight">DocuMind</span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          </nav>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DocuMind. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
