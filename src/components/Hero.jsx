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
    <section id="home" className="relative w-full pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#060814] flex items-center min-h-screen font-sans">
      
      {/* 🎬 تأثيرات الإضاءة في الخلفية (Background Glows) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Container */}
      <div className="relative z-10 px-6 sm:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* 📝 العمود الأيسر: النصوص والأزرار */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-8 lg:mt-0">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg"
          >
            {heroData.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-lg font-light leading-relaxed mb-10"
          >
            {heroData.desc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <a 
              href="#projects" 
              className="inline-block px-10 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)]"
            >
              Explore My Work
            </a>
          </motion.div>
        </div>

        {/* 🖥️ العمود الأيمن: فيديو الـ Showreel (Device Mockup) */}
        {vimeoId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="w-full relative z-20 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            {/* الإطار الخارجي (التابلت / الموبايل) */}
            <div className="w-full max-w-[340px] sm:max-w-[400px] p-3 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#1e2030] to-[#12131c] border-2 sm:border-4 border-[#2a2c3d]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              
              {/* انعكاس إضاءة خفيف على حافة الإطار */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
              
              {/* حاوية الفيديو (بنسبة طولية 3:4 أو 4:5 لتعطي شكل التابلت/الموبايل) */}
              <div className="relative aspect-[3/4] w-full rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden bg-[#090a0f] shadow-inner">
                
                {/* طبقة حماية شفافة عشان تمنع العميل يدوس على الفيديو ويوقفه لو حابب */}
                <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>

                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&color=3b82f6&title=0&byline=0&portrait=0&background=1`}
                  className="absolute top-0 left-0 w-full h-full object-cover scale-[1.02]"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}