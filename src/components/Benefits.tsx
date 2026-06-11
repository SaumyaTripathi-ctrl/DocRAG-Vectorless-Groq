'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Quote, ShieldCheck } from 'lucide-react';

const benefitCards = [
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Ask complex questions in natural language and get instant, human-like responses from your own knowledge."
  },
  {
    icon: Quote,
    title: "Source Citations",
    description: "Every answer includes deep-linked page citations so you can verify facts and navigate to original sources."
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Your documents are stored in isolated encrypted silos and are never used to train public AI models."
  }
];

export function Benefits() {
  return (
    <section id="features" className="py-40 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-headline font-bold mb-4 text-white">Powerful Research Tools</h2>
          <p className="text-white/40 text-lg">Designed for the modern knowledge worker.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 text-center transition-all hover:bg-white/[0.04] group hover:border-primary/20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-xl">
                <benefit.icon className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-headline font-bold text-white">{benefit.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">
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
