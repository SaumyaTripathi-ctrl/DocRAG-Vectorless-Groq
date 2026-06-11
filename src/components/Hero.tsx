'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DOCUMENTS = [
  { id: 'pdf', label: 'PDF', color: 'bg-[#FF4B4B]', iconColor: 'text-[#FF4B4B]', orbitRadius: 180, delay: 0 },
  { id: 'docx', label: 'DOCX', color: 'bg-[#2B579A]', iconColor: 'text-[#2B579A]', orbitRadius: 160, delay: 0.5 },
  { id: 'pptx', label: 'PPTX', color: 'bg-[#D24726]', iconColor: 'text-[#D24726]', orbitRadius: 170, delay: 1.0 },
  { id: 'txt', label: 'TXT', color: 'bg-[#7E7E7E]', iconColor: 'text-[#7E7E7E]', orbitRadius: 150, delay: 1.5 },
];

export function Hero() {
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [isGlowing, setIsGlowing] = useState(false);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const runSequence = async () => {
      // 1. Initial rotation & orbiting happens via Framer Motion constants
      await new Promise(r => setTimeout(r, 2000));

      // 2. Upload one by one
      for (let i = 0; i < DOCUMENTS.length; i++) {
        setUploadIndex(i);
        await new Promise(r => setTimeout(r, 1000)); // Time to fly into cube
        setIsGlowing(true);
        await new Promise(r => setTimeout(r, 300));
        setIsGlowing(false);
        await new Promise(r => setTimeout(r, 500));
      }

      // 3. Reset loop
      await new Promise(r => setTimeout(r, 2000));
      setUploadIndex(-1);
      setIteration(prev => prev + 1);
    };

    runSequence();
  }, [iteration]);

  return (
    <section className="pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center bg-[#F3F4F7]">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-headline font-bold leading-tight"
          >
            Chat With Your <span className="text-[#6366F1]">Documents</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-body leading-relaxed"
          >
            Upload PDFs, DOCX, PPTX, and TXT files and get accurate answers from your own knowledge base with citation-backed intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white rounded-full px-8 h-14 text-lg shadow-lg shadow-[#6366F1]/20">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg gap-2 border-[#6366F1]/20 text-[#6366F1] hover:bg-[#6366F1]/5">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Animation Scene */}
        <div className="relative flex justify-center items-end h-[600px] pb-20">
          
          {/* AI Cube - Recreated from Image */}
          <motion.div 
            className="relative z-20 w-56 h-48 perspective-1000"
            animate={{
              rotateY: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Cube Outer Shell */}
            <div className={`relative w-full h-full bg-gradient-to-br from-[#2D2D8A] to-[#4F46E5] rounded-[2rem] shadow-[0_40px_100px_rgba(79,70,229,0.3)] border-b-8 border-r-8 border-black/20 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${isGlowing ? 'ring-8 ring-cyan-400/30' : ''}`}>
              
              {/* Top Opening Glow */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-300/50 to-transparent" />
              
              {/* Front Panel Icon */}
              <div className="relative z-10 p-6 bg-[#3B32C0]/50 rounded-2xl border border-white/10 shadow-inner">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="9" cy="10" r="1.5" fill="white"/>
                  <circle cx="15" cy="10" r="1.5" fill="white"/>
                </svg>
              </div>

              {/* Internal Cyan Glow Pulse */}
              <motion.div 
                animate={{ opacity: isGlowing ? [0, 1, 0] : 0 }}
                className="absolute inset-0 bg-cyan-400 blur-3xl pointer-events-none"
              />
            </div>

            {/* Base Glow (Reflected on floor) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-20 bg-[#4F46E5]/20 blur-2xl rounded-full" />
          </motion.div>

          {/* Files Orbiting & Uploading */}
          {DOCUMENTS.map((doc, index) => {
            const isActive = uploadIndex === -1 || index >= uploadIndex;
            const isUploading = uploadIndex === index;
            const hasBeenUploaded = uploadIndex > index;

            return (
              <AnimatePresence key={`${doc.id}-${iteration}`}>
                {!hasBeenUploaded && (
                  <motion.div
                    className="absolute z-30"
                    style={{ bottom: 200 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isUploading 
                        ? { 
                            x: 0, 
                            y: 80, 
                            scale: 0.4, 
                            opacity: 0,
                            rotateX: 45
                          }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      isUploading 
                        ? { duration: 0.8, ease: "circIn" }
                        : { duration: 0.5, delay: doc.delay }
                    }
                  >
                    {!isUploading && (
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 12 + index * 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ 
                          width: doc.orbitRadius * 2, 
                          height: doc.orbitRadius * 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        <motion.div 
                          style={{ position: 'absolute', left: 0 }}
                          animate={{ rotate: [0, -360] }}
                          transition={{ duration: 12 + index * 2, repeat: Infinity, ease: "linear" }}
                          className="flex flex-col items-center"
                        >
                          {/* File Icon Card */}
                          <div className="w-16 h-20 bg-white rounded-xl shadow-2xl border overflow-hidden flex flex-col group transition-transform hover:scale-110">
                            <div className={`h-6 ${doc.color} flex items-center justify-center`}>
                              <span className="text-[10px] font-bold text-white tracking-wider">{doc.label}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-2 gap-1">
                              {doc.id === 'pdf' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={doc.iconColor}>
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              )}
                              {doc.id === 'docx' && <span className={`text-2xl font-black ${doc.iconColor}`}>W</span>}
                              {doc.id === 'pptx' && <span className={`text-2xl font-black ${doc.iconColor}`}>P</span>}
                              {doc.id === 'txt' && (
                                <div className="space-y-1">
                                  <div className="w-8 h-1 bg-slate-200" />
                                  <div className="w-8 h-1 bg-slate-200" />
                                  <div className="w-6 h-1 bg-slate-200" />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          {/* Background Ambient Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-[500px] h-[500px] bg-white/40 blur-[120px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
