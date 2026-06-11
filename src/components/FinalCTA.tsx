'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-40 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-10"
        >
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-headline font-bold text-zinc-900 tracking-tight leading-[1.1]">
              Ready to chat with your documents?
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
              Join thousands of researchers and teams using DocuMind.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:scale-105">
              Start Your Free Trial
            </Button>
            <p className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">No credit card required</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}