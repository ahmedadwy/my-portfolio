"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FiPlay } from 'react-icons/fi';

export default function Hero() {
  // 📝 قيم افتراضية لحد ما الداتا تحمل من الفايربيز
  const [heroData, setHeroData] = useState({
    title: "CREATIVE VIDEO EDITOR & MOTION DESIGNER",
    desc: "Crafting cinematic stories through precise editing and dynamic visual effects.",
    videoUrl: ""
  });

  // ⚡ قراءة البيانات لحظياً من Firebase
  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    
    // onSnapshot بتخلي الموقع يتحدث في نفس اللحظة اللي بتدوس فيها Save في لوحة التحكم
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroData({
          title: data.heroTitle || "CREATIVE VIDEO EDITOR & MOTION DESIGNER",
          desc: data.heroDesc || "Crafting cinematic stories through precise editing and dynamic visual effects.",
          videoUrl: data.heroVideoUrl || ""
        });
      }
    });

    // تنظيف المراقبة لما نقفل الصفحة
    return () => unsubscribe();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* 🎬 تأثيرات الإضاءة في الخلفية */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* العنوان بيقرأ من Firebase */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6 leading-tight"
        >
          {heroData.title}
        </motion.h1>

        {/* الوصف بيقرأ من Firebase */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed mb-10"
        >
          {heroData.desc}
        </motion.p>

        {/* الأزرار */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a 
            href="#projects" 
            className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            View My Work
          </a>

          {/* زرار عرض الـ Showreel */}
          {heroData.videoUrl && (
            <a 
              href={heroData.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm font-bold tracking-wide hover:bg-zinc-800 transition-all flex items-center gap-2 group"
            >
              <FiPlay className="text-indigo-500 group-hover:scale-110 transition-transform" /> 
              Watch Showreel
            </a>
          )}
        </motion.div>

      </div>
    </section>
  );
}