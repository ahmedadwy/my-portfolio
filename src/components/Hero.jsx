"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { db } from '../lib/firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: "CREATIVE VIDEO EDITOR & MOTION DESIGNER.", desc: "Crafting cinematic stories...", videoUrl: "", glow1: "#4f46e5", glow2: "#2563eb", bgImage: ""
  });

  // كشف الموبايل عشان نلغي حركة الـ 3D المبالغ فيها على اللمس
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroData({
          title: data.heroTitle || "CREATIVE VIDEO EDITOR & MOTION DESIGNER.",
          desc: data.heroDesc || "Crafting cinematic stories through precise editing and dynamic visual effects.",
          videoUrl: data.heroVideoUrl || "", glow1: data.glowColor1 || "#4f46e5", glow2: data.glowColor2 || "#2563eb", bgImage: data.bgImage || ""
        });
      }
    });
    return () => { unsubscribe(); window.removeEventListener('resize', handleResize); };
  }, []);

  const getVimeoId = (url) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    return match ? match[3] : null;
  };
  const vimeoId = getVimeoId(heroData.videoUrl);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  // تقليل تأثير الحركة على الموبايل
  const rotateX = useTransform(smoothY, [-0.5, 0.5], isMobile ? [0, 0] : [12, -12]); 
  const rotateY = useTransform(smoothX, [-0.5, 0.5], isMobile ? [0, 0] : [-12, 12]);
  const bgX = useTransform(smoothX, [-0.5, 0.5], isMobile ? [0, 0] : [-20, 20]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], isMobile ? [0, 0] : [-20, 20]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], [-100, 200]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [-100, 200]);

  const handleMouseMove = (e) => {
    if(isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } } };

  return (
    <section id="home" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative w-full pt-28 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-[#060814] flex items-center min-h-screen font-sans" style={{ perspective: isMobile ? "none" : "1500px" }}>
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-10%] pointer-events-none">
        {heroData.bgImage && <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen transition-opacity duration-1000" style={{ backgroundImage: `url(${heroData.bgImage})` }} />}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_110%)]" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] blur-[100px] md:blur-[150px] rounded-full opacity-20 mix-blend-screen" style={{ backgroundColor: heroData.glow1 }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] blur-[100px] md:blur-[150px] rounded-full opacity-20 mix-blend-screen" style={{ backgroundColor: heroData.glow2 }} />
      </motion.div>

      <motion.div style={{ rotateX, rotateY }} className="relative z-10 px-5 sm:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center [transform-style:preserve-3d]">
        
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ z: isMobile ? 0 : 40 }} className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-4 lg:mt-0 pointer-events-none">
          <motion.div variants={itemVariants} style={{ z: isMobile ? 0 : 20 }} className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] md:text-xs font-medium mb-6 md:mb-8 backdrop-blur-md pointer-events-auto shadow-lg">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            Available for new projects
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ z: isMobile ? 0 : 60 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] leading-[1.1] font-black uppercase tracking-tight mb-4 md:mb-6 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
            {heroData.title}
          </motion.h1>

          <motion.p variants={itemVariants} style={{ z: isMobile ? 0 : 30 }} className="text-zinc-400 text-sm md:text-lg max-w-lg font-light leading-relaxed mb-8 md:mb-10 px-4 lg:px-0">
            {heroData.desc}
          </motion.p>

          <motion.div variants={itemVariants} style={{ z: isMobile ? 0 : 80 }} className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center lg:justify-start gap-3 md:gap-4 pointer-events-auto px-4 sm:px-0">
            <a href="#projects" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 rounded-xl sm:rounded-full text-white text-sm font-semibold tracking-wide transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:scale-105" style={{ backgroundColor: heroData.glow1 }}>
              Explore My Work
            </a>
            <a href="#contact" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 md:px-8 md:py-4 rounded-xl sm:rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm font-semibold tracking-wide transition-all backdrop-blur-md hover:scale-105">
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ z: isMobile ? 0 : 60 }} className="w-full relative z-20 order-1 lg:order-2 flex justify-center lg:justify-end pointer-events-none">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] [transform-style:preserve-3d] group pointer-events-auto">
            
            <div style={{ transform: isMobile ? "none" : "translateZ(-60px)", backgroundColor: heroData.glow1 }} className="absolute inset-0 opacity-30 blur-[30px] md:blur-[40px] rounded-[3rem] transition-all duration-1000 group-hover:scale-95" />

            <div style={{ transform: isMobile ? "none" : "translateZ(0px)" }} className="relative p-2 md:p-3 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-zinc-700 via-[#111319] to-black border border-white/10 shadow-2xl [transform-style:preserve-3d]">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none rounded-[2rem] md:rounded-[3rem]" />
              <div style={{ transform: isMobile ? "none" : "translateZ(30px)" }} className="relative aspect-[3/4] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-black shadow-inner border border-black/50 [transform-style:preserve-3d]">
                
                {!isMobile && <motion.div style={{ top: glareY, left: glareX, transform: "translateZ(40px)" }} className="absolute w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay rounded-full blur-2xl pointer-events-none transition-opacity" />}

                {vimeoId ? (
                  <iframe src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&color=ffffff&title=0&byline=0&portrait=0&background=1`} className="absolute inset-0 w-full h-full object-cover scale-[1.05] pointer-events-none" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#090a0f] to-black">
                    <span className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-zinc-500 text-[10px] md:text-xs font-semibold tracking-widest uppercase">Loading</p>
                  </div>
                )}
              </div>
            </div>

            {/* الأيقونات الطايرة (تصغير وتعديل مواقع للموبايل) */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ transform: isMobile ? "none" : "translateZ(120px)" }} className="absolute -left-4 top-10 md:-left-12 md:top-24 z-30">
              <div className="bg-purple-900/60 md:bg-purple-900/40 border border-purple-400/40 text-purple-200 md:text-purple-300 text-[10px] md:text-sm font-black px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl shadow-xl backdrop-blur-xl">Pr</div>
            </motion.div>
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} style={{ transform: isMobile ? "none" : "translateZ(180px)" }} className="absolute -right-4 bottom-10 md:-right-14 md:bottom-32 z-30">
              <div className="bg-blue-900/60 md:bg-blue-900/40 border border-blue-400/40 text-blue-200 md:text-blue-300 text-[10px] md:text-sm font-black px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl shadow-xl backdrop-blur-xl">Ae</div>
            </motion.div>

          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}