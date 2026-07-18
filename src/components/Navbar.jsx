"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { FiYoutube, FiInstagram, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';
import { FaVimeoV, FaBehance } from 'react-icons/fa';

export default function Navbar() {
  const [socials, setSocials] = useState({ youtube: "", instagram: "", linkedin: "", vimeo: "", behance: "" });
  const [glow, setGlow] = useState("#4f46e5");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Analytics Tracker
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
    <>
      {/* 🚀 Floating Navbar */}
      <div className="fixed top-4 left-0 w-full z-[100] px-4 flex justify-center pointer-events-none">
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ boxShadow: `0 10px 40px -10px ${glow}50` }}
          className="w-full max-w-6xl bg-[#090a0f]/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 md:px-8 md:py-4 flex justify-between items-center pointer-events-auto transition-shadow duration-1000"
        >
          {/* Logo */}
          <a href="#home" className="text-xl md:text-2xl font-black tracking-widest text-white drop-shadow-md">
            ADWY<span style={{ color: glow }}>.</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#projects" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Work</a>
            <a href="#services" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Services</a>
            <a href="#about" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">About</a>
          </nav>

          {/* Socials & CTA (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3 text-zinc-400">
              {socials.vimeo && <a href={socials.vimeo} target="_blank" rel="noreferrer" className="hover:text-cyan-400 hover:-translate-y-1 transition-all"><FaVimeoV size={16} /></a>}
              {socials.behance && <a href={socials.behance} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:-translate-y-1 transition-all"><FaBehance size={18} /></a>}
              {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:-translate-y-1 transition-all"><FiInstagram size={17} /></a>}
            </div>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <a href="#contact" style={{ backgroundColor: `${glow}20`, color: glow, borderColor: `${glow}50` }} className="flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border hover:bg-white hover:text-black hover:border-white transition-all duration-300">
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="sm:hidden text-white p-2 outline-none"
          >
            <FiMenu size={24} />
          </button>
        </motion.header>
      </div>

      {/* 📱 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(15px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[200] bg-[#060814]/90 flex flex-col items-center justify-center px-6"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full border border-white/20"
            >
              <FiX size={24} />
            </button>

            <nav className="flex flex-col items-center gap-8 text-2xl font-black mb-12">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-indigo-400">Home</a>
              <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-indigo-400">Work</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-indigo-400">Services</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-indigo-400">About</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: glow }}>Contact Me</a>
            </nav>

            <div className="flex items-center gap-6 text-zinc-400">
              {socials.vimeo && <a href={socials.vimeo} target="_blank" rel="noreferrer" className="hover:text-white"><FaVimeoV size={24} /></a>}
              {socials.behance && <a href={socials.behance} target="_blank" rel="noreferrer" className="hover:text-white"><FaBehance size={24} /></a>}
              {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white"><FiInstagram size={24} /></a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}