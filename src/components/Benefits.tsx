'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Quote, ShieldCheck } from 'lucide-react';

const benefitCards = [
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Ask questions in natural language and get instant, human-like responses."
  },
  {
    icon: Quote,
    title: "Source Backed",
    description: "Every answer includes references and page citations for total verification."
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Your documents stay protected and are never used for training models."
  }
];

export function Benefits() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {benefitCards.map((benefit, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2rem] bg-slate-50 border border-border/50 space-y-6 text-center"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-primary">
                <benefit.icon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
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
