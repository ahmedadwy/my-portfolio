"use client";
import { useState, useEffect } from 'react';
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
    // الاتصال بمستند settings في الفايربيز
    const docRef = doc(db, "portfolio", "settings");
    
    // مراقبة الروابط لحظياً
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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#090a0f]/60 backdrop-blur-md border-b border-zinc-900/80 px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold tracking-wider text-white">
        ADWY<span className="text-indigo-500">.</span>
      </div>

      {/* روابط الميديا الدايناميك من Firebase */}
      <div className="flex items-center gap-4 text-zinc-400 text-sm">
        {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><FiYoutube size={18} /></a>}
        {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors"><FiInstagram size={17} /></a>}
        {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><FiLinkedin size={17} /></a>}
        {socials.vimeo && <a href={socials.vimeo} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors"><FaVimeoV size={15} /></a>}
        {socials.behance && <a href={socials.behance} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors"><FaBehance size={18} /></a>}
      </div>
    </header>
  );
}