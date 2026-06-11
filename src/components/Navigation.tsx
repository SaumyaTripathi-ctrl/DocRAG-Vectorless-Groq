'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/50"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary p-1.5 rounded-lg text-white shadow-sm transition-transform"
          >
            <FileText className="w-5 h-5" />
          </motion.div>
          <span className="font-headline font-bold text-xl tracking-tight text-zinc-900">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="#" className="hover:text-zinc-900 transition-colors">Product</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Security</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-500 font-semibold hover:text-zinc-900 hover:bg-zinc-100">Login</Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6 font-bold transition-all shadow-sm">
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}