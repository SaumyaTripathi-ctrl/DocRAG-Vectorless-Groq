'use client';

import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, FileSearch } from 'lucide-react';

const benefitCards = [
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Complex reasoning on multiple large documents simultaneously. No limits on curiosity."
  },
  {
    icon: FileSearch,
    title: "Source Citations",
    description: "Verifiable answers with direct links to the exact paragraph and page of your source documents."
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Enterprise-grade encryption. Your data is isolated and never used for training models."
  }
];

export function Benefits() {
  return (
    <section className="py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-4 text-slate-900">Built for Professionals</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Enterprise-ready tools to accelerate your research and knowledge discovery.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] bg-white border border-slate-200 space-y-6 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <benefit.icon className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-headline font-bold text-slate-900">{benefit.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
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
