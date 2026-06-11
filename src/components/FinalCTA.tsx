'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-40 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-10"
        >
          <div className="flex justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20"
            >
              <Brain className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-headline font-bold text-white tracking-tight leading-[1.1]">
              Ready to try it?
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Upload your first document and start chatting. No credit card required.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold bg-white text-black hover:bg-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105 group">
              Start Free Trial
              <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
            </Button>
            <p className="text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase">Private • Secure • Instant</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}