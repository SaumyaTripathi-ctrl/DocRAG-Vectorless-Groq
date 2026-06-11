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
    description: "Enterprise isolation. Your data is encrypted locally and never used for training models."
  }
];

export function Benefits() {
  return (
    <section id="features" className="py-32 bg-zinc-50/50 relative overflow-hidden border-t border-zinc-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl font-headline font-bold text-zinc-900 tracking-tight">Enterprise-Grade Intelligence</h2>
          <p className="text-zinc-500 mt-4 font-medium leading-relaxed">Built for security and accuracy above all else.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="space-y-6 group p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500"
            >
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-zinc-100 transition-all duration-300 group-hover:shadow-indigo-100 group-hover:border-indigo-100"
              >
                <benefit.icon className="w-7 h-7" />
              </motion.div>
              <div className="space-y-3">
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
