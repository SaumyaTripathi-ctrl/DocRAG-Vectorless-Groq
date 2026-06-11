'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-20 bg-white border-t border-zinc-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-zinc-900">DocuMind</span>
          </div>

          <nav className="flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <Link href="#" className="hover:text-zinc-900 transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Security</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy</Link>
          </nav>

          <div className="text-xs text-zinc-400 font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} DocuMind AI
          </div>
        </div>
      </div>
    </footer>
  );
}
