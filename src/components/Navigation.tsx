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
      className="fixed top-0 left-0 right-0 z-[100] bg-background/50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Brain className="w-6 h-6" />
          </motion.div>
          <span className="font-headline font-bold text-xl tracking-tight text-white">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#" className="hover:text-primary transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-primary transition-colors">Security</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-white/60 hover:text-white hover:bg-white/5">Login</Button>
          <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-bold shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
