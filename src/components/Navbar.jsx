"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { FiYoutube, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaVimeoV, FaBehance } from 'react-icons/fa';

export default function Navbar() {
  const [socials, setSocials] = useState({ youtube: "", instagram: "", linkedin: "", vimeo: "", behance: "" });
  const [glow, setGlow] = useState("#4f46e5");

  useEffect(() => {
    // 1. تسجيل زيارة جديدة (Analytics)
    const trackVisit = async () => {
      if (!sessionStorage.getItem("adwy_visited")) {
        try {
          const statsRef = doc(db, "portfolio", "stats");
          await setDoc(statsRef, { pageViews: increment(1) }, { merge: true });
          sessionStorage.setItem("adwy_visited", "true");
        } catch (e) { console.error("Stats Error:", e); }
      }
    };
    trackVisit();

    // 2. جلب الألوان والروابط
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocials({
          youtube: data.youtubeUrl || "", instagram: data.instagramUrl || "",
          linkedin: data.linkedinUrl || "", vimeo: data.vimeoUrl || "", behance: data.behanceUrl || ""
        });
        if(data.glowColor1) setGlow(data.glowColor1);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed top-4 md:top-6 left-0 w-full z-[100] px-4 md:px-8 flex justify-center pointer-events-none">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ boxShadow: `0 10px 40px -10px ${glow}40` }} // إضاءة متغيرة
        className="w-full max-w-6xl bg-[#090a0f]/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3.5 flex justify-between items-center pointer-events-auto transition-shadow duration-1000"
      >
        <a href="#home" className="text-xl md:text-2xl font-black tracking-widest text-white transition-colors duration-300 drop-shadow-md">
          ADWY<span style={{ color: glow }}>.</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#projects" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Work</a>
          <a href="#services" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Services</a>
          <a href="#about" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-zinc-400">
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-red-500 hover:-translate-y-1 transition-all duration-300"><FiYoutube size={18} /></a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:-translate-y-1 transition-all duration-300"><FiInstagram size={17} /></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:-translate-y-1 transition-all duration-300"><FiLinkedin size={17} /></a>}
            {socials.vimeo && <a href={socials.vimeo} target="_blank" rel="noreferrer" className="hover:text-cyan-400 hover:-translate-y-1 transition-all duration-300"><FaVimeoV size={16} /></a>}
            {socials.behance && <a href={socials.behance} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"><FaBehance size={18} /></a>}
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>
          <a href="#contact" style={{ backgroundColor: `${glow}20`, color: glow, borderColor: `${glow}50` }} className="hidden sm:flex items-center justify-center px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border hover:bg-white hover:text-black transition-all duration-300">
            Let's Talk
          </a>
        </div>
      </motion.header>
    </div>
  );
}