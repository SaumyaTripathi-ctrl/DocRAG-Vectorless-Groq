'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-40 bg-mesh relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto space-y-12"
        >
          <div className="space-y-5">
            <h2 className="text-4xl lg:text-6xl font-headline font-bold text-zinc-900 tracking-tight leading-[1.1]">
              Ready to transform your <br /> knowledge?
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Upload your first document and start chatting in seconds. Join thousands of high-performing teams.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <Button size="lg" className="relative rounded-full px-14 h-18 text-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all duration-300">
                Start Free Trial
              </Button>
            </motion.div>
            <p className="text-zinc-400 text-[10px] font-bold tracking-[0.3em] uppercase">No credit card required • Instant access</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
