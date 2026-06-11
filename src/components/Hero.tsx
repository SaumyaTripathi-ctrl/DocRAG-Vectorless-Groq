'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

const DOCUMENTS = [
  { id: 'pdf', label: 'PDF', color: 'bg-[#FF4B4B]', iconColor: 'text-[#FF4B4B]', orbitRadius: 220, delay: 0 },
  { id: 'docx', label: 'DOCX', color: 'bg-[#2B579A]', iconColor: 'text-[#2B579A]', orbitRadius: 180, delay: 0.5 },
  { id: 'pptx', label: 'PPTX', color: 'bg-[#D24726]', iconColor: 'text-[#D24726]', orbitRadius: 200, delay: 1.0 },
  { id: 'txt', label: 'TXT', color: 'bg-[#7E7E7E]', iconColor: 'text-[#7E7E7E]', orbitRadius: 160, delay: 1.5 },
];

export function Hero() {
  const [uploadIndex, setUploadIndex] = useState(-1);
  const [isGlowing, setIsGlowing] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; duration: number; delay: number }[]>([]);

  // Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles only on client-side to avoid hydration mismatch
    const newParticles = [...Array(15)].map(() => ({
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 2000));
      for (let i = 0; i < DOCUMENTS.length; i++) {
        setUploadIndex(i);
        await new Promise(r => setTimeout(r, 1200));
        setIsGlowing(true);
        await new Promise(r => setTimeout(r, 400));
        setIsGlowing(false);
        await new Promise(r => setTimeout(r, 600));
      }
      await new Promise(r => setTimeout(r, 3000));
      setUploadIndex(-1);
      setIteration(prev => prev + 1);
    };
    runSequence();
  }, [iteration]);

  const cubeX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const cubeY = useTransform(springY, [-0.5, 0.5], [-15, 15]);
  const bgX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const bgY = useTransform(springY, [-0.5, 0.5], [20, -20]);

  return (
    <section className="pt-32 pb-20 overflow-hidden min-h-[95vh] flex items-center bg-[#F3F4F7] relative">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8 max-w-2xl"
        >
          <h1 className="text-6xl lg:text-7xl font-headline font-bold leading-[1.1]">
            Chat With Your <span className="text-primary">Documents</span>
          </h1>
          <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-lg">
            Upload PDFs, DOCX, and more to get accurate answers from your own knowledge base with citation-backed intelligence.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-16 text-lg shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg gap-3 border-primary/20 text-primary bg-white/50 backdrop-blur hover:bg-white/80 transition-all">
              <PlayCircle className="w-6 h-6" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Animation Scene */}
        <div className="relative flex justify-center items-center h-[600px]">
          
          {/* Animated Background Glow */}
          <motion.div 
            style={{ x: bgX, y: bgY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
          >
            <div className="w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 to-cyan-400/10 blur-[140px] rounded-full animated-gradient" />
          </motion.div>

          {/* AI Cube */}
          <motion.div 
            style={{ x: cubeX, y: cubeY }}
            className="relative z-20 w-64 h-56 perspective-1000"
            animate={{
              rotateY: [0, 15, -15, 0],
              y: [0, -15, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`relative w-full h-full bg-gradient-to-br from-[#2D2D8A] to-primary rounded-[2.5rem] shadow-[0_50px_120px_rgba(79,70,229,0.4)] border-b-[10px] border-r-[10px] border-black/30 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${isGlowing ? 'ring-8 ring-cyan-300 shadow-[0_0_80px_rgba(34,211,238,0.5)]' : ''}`}>
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-cyan-300/30 to-transparent" />
              <motion.div 
                className="relative z-10 p-8 bg-[#3B32C0]/40 rounded-3xl border border-white/10 shadow-inner"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="9" cy="10" r="1.5" fill="white"/>
                  <circle cx="15" cy="10" r="1.5" fill="white"/>
                </svg>
              </motion.div>
              <motion.div 
                animate={{ opacity: isGlowing ? [0, 1, 0] : 0, scale: isGlowing ? [1, 1.2, 1] : 1 }}
                className="absolute inset-0 bg-cyan-400 blur-[80px] pointer-events-none"
              />
            </div>
            {/* Dynamic Shadow */}
            <motion.div 
              style={{ scaleX: useTransform(cubeY, [-15, 15], [1, 1.1]) }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-12 bg-black/10 blur-3xl rounded-full" 
            />
          </motion.div>

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{ 
                  x: p.x, 
                  y: p.y, 
                  opacity: 0 
                }}
                animate={{ 
                  y: [null, -100], 
                  opacity: [0, 0.4, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: p.duration, 
                  repeat: Infinity, 
                  delay: p.delay 
                }}
              />
            ))}
          </div>

          {/* Orbiting Documents */}
          {DOCUMENTS.map((doc, index) => {
            const isUploading = uploadIndex === index;
            const hasBeenUploaded = uploadIndex > index;

            return (
              <AnimatePresence key={`${doc.id}-${iteration}`}>
                {!hasBeenUploaded && (
                  <motion.div
                    className="absolute z-30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isUploading 
                        ? { x: 0, y: 0, scale: 0, opacity: 0 }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      isUploading 
                        ? { duration: 0.8, ease: "backIn" }
                        : { duration: 0.8, delay: doc.delay }
                    }
                  >
                    {!isUploading && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 15 + index * 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ 
                          width: doc.orbitRadius * 2, 
                          height: doc.orbitRadius * 1.2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        <motion.div 
                          style={{ position: 'absolute', left: 0 }}
                          animate={{ rotate: [0, -360], y: [0, -10, 0] }}
                          transition={{ 
                            rotate: { duration: 15 + index * 3, repeat: Infinity, ease: "linear" },
                            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                          }}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="w-16 h-20 bg-white rounded-xl shadow-2xl border overflow-hidden flex flex-col group cursor-pointer"
                          >
                            <div className={`h-6 ${doc.color} flex items-center justify-center`}>
                              <span className="text-[10px] font-bold text-white">{doc.label}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center p-2">
                              <FileText className={`w-8 h-8 ${doc.iconColor}`} />
                            </div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </section>
  );
}
