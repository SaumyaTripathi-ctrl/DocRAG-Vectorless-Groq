'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  "Acme Corp", "GlobalTech", "Lumina", "Vertex", "Pulse", "Nexus"
];

export function SocialProof() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-12">
          Trusted by high-performing teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-xl font-headline font-bold text-zinc-900"
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
