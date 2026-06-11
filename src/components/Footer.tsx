'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-slate-900">DocuMind</span>
          </div>

          <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-primary transition-colors">API</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          </nav>

          <div className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} DocuMind AI.
          </div>
        </div>
      </div>
    </footer>
  );
}
