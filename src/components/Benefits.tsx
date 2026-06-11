'use client';

import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, FileSearch, Sparkles } from 'lucide-react';

const benefitCards = [
  {
    icon: MessageSquare,
    title: "Deep Reasoning",
    description: "Complex synthesis across thousands of pages. Our models understand context, not just keywords."
  },
  {
    icon: FileSearch,
    title: "Source Citations",
    description: "Zero hallucination policy. Every answer includes a direct link to the source document and page."
  },
  {
    icon: ShieldCheck,
    title: "Isolated Privacy",
    description: "Enterprise-grade isolation. Your data is encrypted and never used for global model training."
  }
];

export function Benefits() {
  return (
    <section className="py-40 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4 text-primary font-bold text-xs tracking-widest uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>Infrastructure</span>
          </motion.div>
          <h2 className="text-5xl font-headline font-bold mb-6 text-slate-900 tracking-tight">Built for Enterprise Intelligence</h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">Scalable, secure, and precise document analysis for modern research teams.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-12 rounded-[3rem] bg-slate-50/50 border border-slate-100 space-y-8 transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary/10 group cursor-default"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <benefit.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold text-slate-900 tracking-tight">{benefit.title}</h3>
                <p className="text-slate-500 leading-relaxed text-base font-medium">
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
