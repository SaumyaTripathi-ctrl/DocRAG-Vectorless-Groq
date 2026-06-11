'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-40 bg-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-[1000px] h-[1000px] bg-secondary/20 rounded-full blur-[120px]" 
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-5xl lg:text-7xl font-headline font-bold text-white leading-tight">
            Ready to unlock your <br /> knowledge base?
          </h2>
          <p className="text-primary-foreground/70 text-xl max-w-2xl mx-auto">
            Join the elite researchers and professionals who are changing the way they work with documents.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50 rounded-full px-16 h-20 text-2xl font-bold shadow-2xl shadow-black/20">
              Start Chatting Free
            </Button>
          </motion.div>
          <p className="text-primary-foreground/40 text-sm font-medium">No credit card required. Up to 50MB per file.</p>
        </motion.div>
      </div>
    </section>
  );
}