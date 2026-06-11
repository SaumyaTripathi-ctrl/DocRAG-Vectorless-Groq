'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-32 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <h2 className="text-4xl lg:text-6xl font-headline font-bold text-white">
            Ready to chat with your documents?
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Join thousands of researchers, students, and professionals working smarter.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50 rounded-full px-12 h-16 text-xl font-bold">
            Start Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
