'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Command } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Navigation() {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 50], [90, 72]);
  const backgroundColor = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <motion.header 
      style={{ height, backgroundColor }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-transparent data-[scrolled=true]:border-zinc-200/50"
    >
      <motion.div 
        style={{ opacity: borderOpacity }}
        className="absolute inset-x-0 bottom-0 h-px bg-zinc-100" 
      />
      
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -8 }}
            whileTap={{ scale: 0.9 }}
            className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100 transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
          </motion.div>
          <span className="font-headline font-bold text-2xl tracking-tight text-zinc-900">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-zinc-500">
          <Link href="#product-workspace" className="hover:text-zinc-900 transition-colors duration-200 flex items-center gap-2">
            Workspace
          </Link>
          <Link href="#features" className="hover:text-zinc-900 transition-colors duration-200">
            Security
          </Link>
          <div className="flex items-center gap-2 bg-indigo-50/80 px-4 py-1.5 rounded-full border border-indigo-100/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">v1.0 stable</span>
          </div>
        </nav>

        <div className="flex items-center gap-5">
          <Button variant="ghost" className="text-zinc-500 font-bold hover:text-zinc-900 hover:bg-zinc-100/50 rounded-full px-6 transition-all">Sign In</Button>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-8 h-12 font-bold transition-all shadow-xl shadow-zinc-200/50 flex items-center gap-2">
              <Command className="w-4 h-4" />
              Start Free
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}