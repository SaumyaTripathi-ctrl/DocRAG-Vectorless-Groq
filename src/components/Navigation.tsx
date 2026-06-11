'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white shadow-lg shadow-primary/20">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight text-slate-900">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#" className="hover:text-primary transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 font-bold">Login</Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
