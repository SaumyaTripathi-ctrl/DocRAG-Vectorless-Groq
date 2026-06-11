'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary p-1.5 rounded-lg text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-white transition-colors">Security</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-400 font-semibold hover:text-white hover:bg-white/5">Login</Button>
          <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-bold transition-all hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}