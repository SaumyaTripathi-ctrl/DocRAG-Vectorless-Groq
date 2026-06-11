'use client';

import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, FileSearch, Sparkles } from 'lucide-react';

const benefitCards = [
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Complex synthesis across thousands of pages. Our models understand deep context, not just simple keywords."
  },
  {
    icon: FileSearch,
    title: "Source Citations",
    description: "Zero hallucination policy. Every answer includes a direct link to the original document and precise page number."
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Enterprise-grade isolation. Your data is encrypted at rest and in transit, and never used for training models."
  }
];

export function Benefits() {
  return (
    <section className="py-40 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4 text-primary font-bold text-xs tracking-widest uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>Infrastructure</span>
          </motion.div>
          <h2 className="text-4xl font-headline font-bold mb-6 text-white tracking-tight">Built for Enterprise Intelligence</h2>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium">Precision document analysis for modern research teams.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 space-y-8 transition-all hover:bg-zinc-900/50 hover:border-primary/30 group cursor-default"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-xl group-hover:shadow-primary/20 border border-white/5">
                <benefit.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold text-white tracking-tight">{benefit.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-base font-medium">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}