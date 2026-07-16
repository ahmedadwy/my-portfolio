"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FiYoutube, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaVimeoV, FaBehance } from 'react-icons/fa';

export default function Navbar() {
  const [socials, setSocials] = useState({ 
    youtube: "", 
    instagram: "", 
    linkedin: "", 
    vimeo: "", 
    behance: "" 
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocials({
          youtube: data.youtubeUrl || "",
          instagram: data.instagramUrl || "",
          linkedin: data.linkedinUrl || "",
          vimeo: data.vimeoUrl || "",
          behance: data.behanceUrl || ""
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    // حاوية خارجية لتوسيط الـ Navbar وجعله طافي (Floating)
    <div className="fixed top-4 md:top-6 left-0 w-full z-[100] px-4 md:px-8 flex justify-center pointer-events-none">
      
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="w-full max-w-6xl bg-[#090a0f]/60 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-3.5 flex justify-between items-center pointer-events-auto"
      >
        
        {/* 🌟 اللوجو */}
        <a href="#home" className="text-xl md:text-2xl font-black tracking-widest text-white hover:text-indigo-400 transition-colors duration-300 drop-shadow-md">
          ADWY<span className="text-indigo-500">.</span>
        </a>

        {/* 🗺️ روابط التنقل (تظهر في الشاشات المتوسطة والكبيرة فقط) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#projects" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
            Work
          </a>
          <a href="#services" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
            Services
          </a>
          <a href="#about" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
            About
          </a>
        </nav>

        {/* 🔗 السوشيال ميديا وزرار التواصل */}
        <div className="flex items-center gap-4">
          
          {/* أيقونات الميديا */}
          <div className="flex items-center gap-3 text-zinc-400">
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-red-500 hover:-translate-y-1 transition-all duration-300" title="YouTube">
                <FiYoutube size={18} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:-translate-y-1 transition-all duration-300" title="Instagram">
                <FiInstagram size={17} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:-translate-y-1 transition-all duration-300" title="LinkedIn">
                <FiLinkedin size={17} />
              </a>
            )}
            {socials.vimeo && (
              <a href={socials.vimeo} target="_blank" rel="noreferrer" className="hover:text-cyan-400 hover:-translate-y-1 transition-all duration-300" title="Vimeo">
                <FaVimeoV size={16} />
              </a>
            )}
            {socials.behance && (
              <a href={socials.behance} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300" title="Behance">
                <FaBehance size={18} />
              </a>
            )}
          </div>

          {/* خط فاصل صغير يظهر في الشاشات الكبيرة */}
          <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>

          {/* زرار تواصل سريع (Call to Action) */}
          <a 
            href="#contact" 
            className="hidden sm:flex items-center justify-center px-5 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300"
          >
            Let's Talk
          </a>

        </div>
      </motion.header>
    </div>
  );
}