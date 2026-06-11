'use client';

import { motion } from 'framer-motion';
import { Search, ShieldCheck, Zap } from 'lucide-react';

const benefitCards = [
  {
    icon: Search,
    title: "Instant Retrieval",
    description: "Complex synthesis across thousands of pages. Our models understand deep context instantly."
  },
  {
    icon: Zap,
    title: "Source Citations",
    description: "No hallucinations. Every answer includes a direct link to the original document and precise page number."
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Enterprise isolation. Your data is encrypted and never used for training models."
  }
];

export function Benefits() {
  return (
    <section className="py-32 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="space-y-6 group"
            >
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-zinc-100 transition-shadow group-hover:shadow-md"
              >
                <benefit.icon className="w-6 h-6" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold text-zinc-900 tracking-tight">{benefit.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
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
