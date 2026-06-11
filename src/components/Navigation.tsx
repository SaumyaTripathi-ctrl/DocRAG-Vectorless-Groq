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
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200/50"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary p-1.5 rounded-lg text-white shadow-sm shadow-primary/20 transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
          </motion.div>
          <span className="font-headline font-bold text-xl tracking-tight text-zinc-900">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="#" className="hover:text-zinc-900 transition-colors duration-200">Product</Link>
          <div className="relative group">
            <Link href="#pricing" className="hover:text-zinc-900 transition-colors duration-200">Pricing</Link>
            <span className="absolute -top-3 -right-6 bg-indigo-50 text-indigo-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full scale-0 group-hover:scale-100 transition-transform">NEW</span>
          </div>
          <Link href="#" className="hover:text-zinc-900 transition-colors duration-200">Security</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-zinc-500 font-semibold hover:text-zinc-900 hover:bg-zinc-100/50 rounded-full px-5 transition-all">Login</Button>
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6 font-bold transition-all shadow-lg shadow-zinc-200 hover:shadow-zinc-300">
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
