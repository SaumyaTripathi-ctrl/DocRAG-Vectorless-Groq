'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Brain, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DOCUMENTS = [
  { id: 'pdf', type: 'PDF', color: 'bg-red-500', iconColor: 'text-red-500', orbitRadius: 180, speed: 8, offset: 0 },
  { id: 'docx', type: 'DOCX', color: 'bg-blue-500', iconColor: 'text-blue-500', orbitRadius: 150, speed: 6, offset: Math.PI / 2 },
  { id: 'pptx', type: 'PPTX', color: 'bg-orange-500', iconColor: 'text-orange-500', orbitRadius: 165, speed: 7, offset: Math.PI },
  { id: 'txt', type: 'TXT', color: 'bg-slate-500', iconColor: 'text-slate-500', orbitRadius: 140, speed: 5, offset: (3 * Math.PI) / 2 },
];

export function Hero() {
  const [animationStep, setAnimationStep] = useState<'idle' | 'orbiting' | 'uploading' | 'final'>('idle');
  const [uploadedIndices, setUploadedIndices] = useState<number[]>([]);
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState<number | null>(null);
  const [cubeEnergy, setCubeEnergy] = useState(0);

  useEffect(() => {
    const runSequence = async () => {
      // Beginning: Idle rotation
      await new Promise(r => setTimeout(r, 1000));
      setAnimationStep('orbiting');

      // Main Animation: Start orbit
      await new Promise(r => setTimeout(r, 2000));

      // Upload Sequence: One by one
      setAnimationStep('uploading');
      for (let i = 0; i < DOCUMENTS.length; i++) {
        setCurrentUploadingIndex(i);
        await new Promise(r => setTimeout(r, 1200)); // Time to fly to center and dissolve
        setUploadedIndices(prev => [...prev, i]);
        setCubeEnergy(prev => prev + 1);
        setCurrentUploadingIndex(null);
        await new Promise(r => setTimeout(r, 400)); // Wait before next
      }

      setAnimationStep('final');
    };

    runSequence();
  }, []);

  return (
    <section className="pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center bg-[#FBFBFF]">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-headline font-bold leading-tight"
          >
            Chat With Your <span className="text-primary">Documents</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-body leading-relaxed"
          >
            Upload PDFs, DOCX, PPTs and instantly get accurate answers from your own knowledge base with citation-backed intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/20">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg gap-2 border-primary/20 text-primary hover:bg-primary/5">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            {['PDF', 'DOCX', 'PPTX', 'TXT'].map((type) => (
              <span key={type} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-muted-foreground border shadow-sm">
                {type}
              </span>
            ))}
          </motion.div>
        </div>

        {/* 3D Product Animation Scene */}
        <div className="relative flex justify-center items-center h-[600px] perspective-1000">
          
          {/* Central AI Cube */}
          <div className="relative z-20">
            <motion.div 
              className="relative w-48 h-48"
              animate={{
                rotateY: [0, 360],
                y: [0, -15, 0],
              }}
              transition={{
                rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Cube Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] shadow-[0_0_60px_rgba(99,102,241,0.4)] flex items-center justify-center border-4 border-white/20 backdrop-blur-sm overflow-hidden">
                 <Brain className="w-20 h-20 text-white z-10" />
                 
                 {/* Internal Glow Effects */}
                 <motion.div 
                   animate={{ 
                     opacity: isGlowing() ? [0.4, 1, 0.4] : 0.4,
                     scale: isGlowing() ? [1, 1.2, 1] : 1
                   }}
                   className="absolute inset-0 bg-white/20 blur-xl"
                 />
                 
                 {/* Energy Pulses */}
                 <AnimatePresence>
                   {cubeEnergy > 0 && (
                     <motion.div 
                       key={cubeEnergy}
                       initial={{ scale: 0.5, opacity: 0 }}
                       animate={{ scale: 1.5, opacity: 0 }}
                       transition={{ duration: 1 }}
                       className="absolute inset-0 border-4 border-white rounded-[2.5rem]"
                     />
                   )}
                 </AnimatePresence>
              </div>

              {/* Cube Top Opening (Glow Area) */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 blur-md rounded-full" />
              
              {/* Final State: Intelligent Radiance */}
              {animationStep === 'final' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                >
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </motion.div>
              )}
            </motion.div>

            {/* Subtle Chat Bubbles (End Effect) */}
            <AnimatePresence>
              {animationStep === 'final' && (
                <motion.div 
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -100 }}
                  transition={{ delay: 1, duration: 2 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                   <div className="bg-white p-2 rounded-2xl shadow-xl border flex items-center gap-2">
                     <MessageSquare className="w-3 h-3 text-primary" />
                     <span className="text-[10px] font-bold">Insight extracted!</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Orbiting / Uploading Documents */}
          {DOCUMENTS.map((doc, index) => {
            const isUploaded = uploadedIndices.includes(index);
            const isUploading = currentUploadingIndex === index;

            return (
              <AnimatePresence key={doc.id}>
                {!isUploaded && (
                  <motion.div
                    className="absolute z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isUploading 
                        ? { 
                            x: 0, 
                            y: -100, 
                            scale: [1, 0.5, 0], 
                            opacity: [1, 1, 0],
                            rotateY: 720
                          }
                        : animationStep === 'idle'
                        ? { opacity: 1, scale: 1, y: -200 + (index * 20) }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      isUploading 
                        ? { duration: 1.2, ease: "circIn" }
                        : { duration: 0.5 }
                    }
                  >
                    {/* The Orbit Motion */}
                    {!isUploading && animationStep !== 'idle' && (
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: doc.speed,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ 
                          width: doc.orbitRadius * 2, 
                          height: doc.orbitRadius * 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        <motion.div 
                          style={{ 
                            position: 'absolute', 
                            left: 0,
                            x: -20 // half of icon width
                          }}
                          animate={{ rotate: [0, -360] }} // Keep upright
                          transition={{ duration: doc.speed, repeat: Infinity, ease: "linear" }}
                          className={`p-4 rounded-2xl bg-white shadow-2xl border flex flex-col items-center gap-1 min-w-[70px]`}
                        >
                          <FileText className={`w-8 h-8 ${doc.iconColor}`} />
                          <span className="text-[10px] font-bold text-muted-foreground">{doc.type}</span>
                          
                          {/* Trail Effect */}
                          <div className={`absolute inset-0 ${doc.iconColor.replace('text', 'bg')}/10 blur-xl rounded-2xl -z-10`} />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Static Position for Idle */}
                    {animationStep === 'idle' && (
                       <div className="p-4 rounded-2xl bg-white shadow-2xl border flex flex-col items-center gap-1 min-w-[70px]">
                        <FileText className={`w-8 h-8 ${doc.iconColor}`} />
                        <span className="text-[10px] font-bold text-muted-foreground">{doc.type}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          {/* Background Ambient Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                animate={{
                  x: [Math.random() * 600 - 300, Math.random() * 600 - 300],
                  y: [Math.random() * 600 - 300, Math.random() * 600 - 300],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  function isGlowing() {
    return currentUploadingIndex !== null || animationStep === 'final';
  }
}
