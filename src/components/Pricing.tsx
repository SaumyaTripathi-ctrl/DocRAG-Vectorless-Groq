'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for individuals getting started.",
    features: ["50 Documents", "Standard AI model", "Chat history", "Source citations"],
    button: "Start for Free",
    popular: false
  },
  {
    name: "Pro",
    price: "29",
    description: "Best for power users and small teams.",
    features: ["Unlimited Documents", "Premium GPT-4o model", "Cross-doc synthesis", "Priority support", "Custom prompts"],
    button: "Get Pro Now",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with security needs.",
    features: ["SSO/SAML", "SOC2 Compliance", "Private model training", "Account manager", "API access"],
    button: "Contact Sales",
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-white relative">
      <div className="floating-blob top-0 left-1/4 opacity-50" />
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl font-headline font-bold text-zinc-900 tracking-tight">Simple, scalable pricing</h2>
          <p className="text-lg text-zinc-500 mt-4 font-medium">Choose the plan that fits your knowledge workflow.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[2.5rem] border ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-zinc-100'} bg-white flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900">{plan.price !== "Custom" ? `$${plan.price}` : plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-zinc-400 font-medium">/mo</span>}
                </div>
                <p className="text-sm text-zinc-500 mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                    <div className="bg-indigo-50 p-1 rounded-md">
                      <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? 'default' : 'outline'}
                className={`w-full rounded-2xl h-14 font-bold text-base transition-all duration-300 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100' : 'border-zinc-200 hover:bg-zinc-50'}`}
              >
                {plan.button}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
