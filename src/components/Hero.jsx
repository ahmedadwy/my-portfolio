"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: "CREATIVE VIDEO EDITOR & MOTION DESIGNER.",
    desc: "Crafting cinematic stories through precise editing and dynamic visual effects.",
    videoUrl: "" 
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroData({
          title: data.heroTitle || "CREATIVE VIDEO EDITOR & MOTION DESIGNER.",
          desc: data.heroDesc || "Crafting cinematic stories through precise editing and dynamic visual effects.",
          videoUrl: data.heroVideoUrl || "" 
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

  return (
    <section id="home" className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#060814] flex items-center min-h-screen font-sans">
      
      {/* 🌐 1. خلفية الشبكة (Grid Background) لإعطاء طابع تقني واحترافي */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* 🎬 2. تأثيرات الإضاءة (Glows) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Container */}
      <div className="relative z-10 px-6 sm:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* 📝 العمود الأيسر: النصوص والأزرار */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-8 lg:mt-0">
          
          {/* 🏷️ 3. Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-700/30 text-blue-300 text-xs font-semibold mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Available for new projects
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg"
          >
            {/* فصل الكلمات لعمل تأثير لوني على جزء منها (اختياري، لو عايز العنوان كله أبيض امسح التنسيق ده) */}
            {heroData.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-zinc-400 text-sm sm:text-base lg:text-xl max-w-lg font-light leading-relaxed mb-10"
          >
            {heroData.desc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <a 
              href="#projects" 
              className="inline-block px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1"
            >
              Explore My Work
            </a>
            
            {/* 🔗 4. Secondary Button */}
            <a 
              href="#contact" 
              className="inline-block px-8 py-3.5 rounded-full bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-1"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* 🖥️ العمود الأيمن: فيديو الـ Showreel (Device Mockup) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="w-full relative z-20 order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          
          {/* ✨ 5. Floating Software Icons */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-4 top-10 sm:-left-8 sm:top-20 z-30 bg-[#00005e] border border-[#9999ff]/30 text-[#9999ff] text-xs font-bold px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md rotate-[-12deg]"
          >
            Pr
          </motion.div>
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -right-4 bottom-10 sm:-right-8 sm:bottom-20 z-30 bg-[#00005e] border border-[#d3aaff]/30 text-[#d3aaff] text-xs font-bold px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md rotate-[12deg]"
          >
            Ae
          </motion.div>

          {/* الإطار الخارجي (التابلت / الموبايل) */}
          <div className="w-full max-w-[340px] sm:max-w-[420px] p-3 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#1e2030] to-[#12131c] border-2 sm:border-4 border-[#2a2c3d]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-[2rem]" />
            
            <div className="relative aspect-[3/4] w-full rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden bg-[#090a0f] shadow-inner flex items-center justify-center">
              
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>

              {vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&color=3b82f6&title=0&byline=0&portrait=0&background=1`}
                  className="absolute top-0 left-0 w-full h-full object-cover scale-[1.02]"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                /* 🛡️ 6. Smart Fallback (لو مفيش رابط فيديو) */
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-zinc-900 to-black">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 animate-pulse">
                     <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-t-transparent border-b-transparent border-l-blue-400 ml-1"></div>
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">Showreel Coming Soon</p>
                </div>
              )}

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}