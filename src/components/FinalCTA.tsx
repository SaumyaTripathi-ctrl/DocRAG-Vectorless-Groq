'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-40 bg-slate-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20"
            >
              <Brain className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-headline font-bold text-white leading-[1] tracking-tight">
            Unlock the knowledge <br /> locked in your files.
          </h2>
          
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Join 10,000+ researchers and professionals who are transforming their document research today.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="rounded-full px-16 h-20 text-2xl font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 hover:scale-105 transition-all group">
              Start Free Trial
              <Sparkles className="ml-2 w-6 h-6 group-hover:animate-pulse" />
            </Button>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">No credit card required • 14 day trial</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
