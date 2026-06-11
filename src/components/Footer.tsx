'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-1.5 rounded-lg text-white shadow-lg shadow-primary/20">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-white">DocuMind</span>
          </div>

          <nav className="flex items-center gap-8 text-sm font-semibold text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">API Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </nav>

          <div className="text-xs text-zinc-600 font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} DocuMind AI
          </div>
        </div>
      </div>
    </footer>
  );
}