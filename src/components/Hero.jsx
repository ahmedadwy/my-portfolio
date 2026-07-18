"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { db } from '../lib/firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: "CREATIVE VIDEO EDITOR & MOTION DESIGNER.",
    desc: "Crafting cinematic stories through precise editing and dynamic visual effects.",
    videoUrl: "",
    glow1: "#4f46e5", // أزرق/نيلي افتراضي
    glow2: "#2563eb", // أزرق فاتح افتراضي
    bgImage: ""       // مفيش صورة افتراضياً
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroData({
          title: data.heroTitle || "CREATIVE VIDEO EDITOR & MOTION DESIGNER.",
          desc: data.heroDesc || "Crafting cinematic stories through precise editing and dynamic visual effects.",
          videoUrl: data.heroVideoUrl || "",
          glow1: data.glowColor1 || "#4f46e5",
          glow2: data.glowColor2 || "#2563eb",
          bgImage: data.bgImage || ""
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const getVimeoId = (url) => {
    if (!url) return null;
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[3] : null;
  };

  const vimeoId = getVimeoId(heroData.videoUrl);

  // ==========================================
  // 🚀 Full Section 3D Tracking Logic
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]); 
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const bgX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], [-100, 200]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [-100, 200]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
  };

  return (
    <section 
      id="home" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#060814] flex items-center min-h-screen font-sans"
      style={{ perspective: "1500px" }} 
    >
      
      {/* 🌌 الخلفية المتغيرة (Parallax) اللي بتستقبل الإعدادات من الداشبورد */}
      <motion.div 
        style={{ x: bgX, y: bgY }} 
        className="absolute inset-[-10%] pointer-events-none"
      >
        {/* الصورة الديناميكية (لو موجودة بتتعرض مع دمج ناعم جداً) */}
        {heroData.bgImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen transition-opacity duration-1000" 
            style={{ backgroundImage: `url(${heroData.bgImage})` }} 
          />
        )}
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_110%)]" />
        
        {/* إضاءات الداشبورد الديناميكية */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] blur-[150px] rounded-full opacity-20 mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: heroData.glow1 }} />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] blur-[150px] rounded-full opacity-20 mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: heroData.glow2 }} />
      </motion.div>

      {/* 🎭 مسرح الـ 3D الحقيقي */}
      <motion.div 
        style={{ rotateX, rotateY }} 
        className="relative z-10 px-6 sm:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center [transform-style:preserve-3d]"
      >
        
        {/* العمود الأيسر: النصوص */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ z: 40 }} 
          className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-8 lg:mt-0 [transform-style:preserve-3d] pointer-events-none"
        >
          <motion.div variants={itemVariants} style={{ z: 20 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            Available for new projects
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ z: 60 }} className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-black uppercase tracking-tight mb-6 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
            {heroData.title}
          </motion.h1>

          <motion.p variants={itemVariants} style={{ z: 30 }} className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-lg font-light leading-relaxed mb-10">
            {heroData.desc}
          </motion.p>

          <motion.div variants={itemVariants} style={{ z: 80 }} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pointer-events-auto">
            <a href="#projects" className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105" style={{ backgroundColor: heroData.glow1 }}>
              Explore My Work
            </a>
            <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm font-semibold tracking-wide transition-all duration-300 backdrop-blur-md hover:scale-105">
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        {/* العمود الأيمن: الجهاز الطائر 3D */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ z: 60 }} 
          className="w-full relative z-20 order-1 lg:order-2 flex justify-center lg:justify-end [transform-style:preserve-3d] pointer-events-none"
        >
          
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] [transform-style:preserve-3d] group pointer-events-auto">
            
            {/* الظل الطائر للموبايل متأثر بالإضاءة اللي مختارها */}
            <div 
              style={{ transform: "translateZ(-60px)", backgroundColor: heroData.glow1 }}
              className="absolute inset-0 opacity-30 blur-[40px] rounded-[3rem] transition-all duration-1000 group-hover:scale-95"
            />

            <div 
              style={{ transform: "translateZ(0px)" }}
              className="relative p-2 sm:p-3 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-zinc-700 via-[#111319] to-black border border-white/10 [transform-style:preserve-3d] shadow-[20px_30px_60px_rgba(0,0,0,0.8)]"
            >
              
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none rounded-[2.5rem] sm:rounded-[3rem]" />
              
              <div 
                style={{ transform: "translateZ(30px)" }} 
                className="relative aspect-[3/4] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black shadow-inner [transform-style:preserve-3d] border border-black/50"
              >
                
                <motion.div 
                  style={{ top: glareY, left: glareX, transform: "translateZ(40px)" }} 
                  className="absolute w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
                />

                <div className="absolute inset-0 z-10 bg-indigo-900/10 mix-blend-overlay pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

                {vimeoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&color=ffffff&title=0&byline=0&portrait=0&background=1`}
                    className="absolute inset-0 w-full h-full object-cover scale-[1.05] pointer-events-none"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#090a0f] to-black">
                    <span className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-zinc-500 text-xs font-semibold tracking-widest uppercase">Video Loading</p>
                  </div>
                )}
              </div>
            </div>

            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ transform: "translateZ(120px)" }} 
              className="absolute -left-6 top-16 sm:-left-12 sm:top-24 z-30"
            >
              <div className="bg-purple-900/40 border border-purple-400/40 text-purple-300 text-xs sm:text-sm font-black px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(168,85,247,0.4)] backdrop-blur-xl flex items-center justify-center">
                Pr
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              style={{ transform: "translateZ(180px)" }} 
              className="absolute -right-6 bottom-16 sm:-right-14 sm:bottom-32 z-30"
            >
              <div className="bg-blue-900/40 border border-blue-400/40 text-blue-300 text-xs sm:text-sm font-black px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(59,130,246,0.4)] backdrop-blur-xl flex items-center justify-center">
                Ae
              </div>
            </motion.div>

          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}