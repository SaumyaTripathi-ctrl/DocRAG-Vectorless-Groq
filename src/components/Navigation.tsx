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
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Brain className="w-6 h-6" />
          </motion.div>
          <span className="font-headline font-bold text-xl tracking-tight">DocuMind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#upload" className="hover:text-primary transition-colors">Upload</Link>
          <Link href="#chat" className="hover:text-primary transition-colors">Chat</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex hover:bg-primary/5">Login</Button>
          <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}