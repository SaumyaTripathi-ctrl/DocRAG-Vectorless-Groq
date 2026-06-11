'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-10"
        >
          <h2 className="text-4xl lg:text-6xl font-headline font-bold text-slate-900 leading-tight">
            Ready to chat with <br /> your documents?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Join thousands of researchers and professionals who are unlocking their knowledge base today.
          </p>
          <Button size="lg" className="rounded-full px-12 h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20">
            Start Free Now
          </Button>
          <p className="text-slate-400 text-sm">Free tier includes 50MB and 20 documents/month.</p>
        </motion.div>
      </div>
    </section>
  );
}
