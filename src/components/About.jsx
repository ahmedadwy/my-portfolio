"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function About() {
  const [title, setTitle] = useState("About Me");
  const [desc, setDesc] = useState("I am a passionate Visual Artist specializing in video post-production...");
  const [avatar, setAvatar] = useState("/avatar.jpg"); 
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.aboutTitle) setTitle(data.aboutTitle);
        if (data.aboutDesc) setDesc(data.aboutDesc);
        if (data.aboutImage) setAvatar(data.aboutImage);
        if (data.tools) setTools(data.tools);
      }
    });

    return () => unsubscribe(); 
  }, []);

  // إعدادات حركة الأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* 📝 الجزء الأيسر: النصوص والبرامج */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8 order-2 lg:order-1"
        >
          {/* العنوان المتدرج */}
          <div>
            <motion.p variants={fadeUp} className="text-indigo-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Behind the Edits
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 leading-tight">
              {title}
            </motion.h2>
          </div>

          <motion.p variants={fadeUp} className="text-zinc-400 text-base md:text-lg leading-relaxed font-light max-w-xl">
            {desc}
          </motion.p>

          {/* 🧰 قسم البرامج والأدوات */}
          {tools.length > 0 && (
            <motion.div variants={fadeUp} className="pt-6 border-t border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-6">
                Software & Arsenal
              </h4>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-3 backdrop-blur-md shadow-lg transition-colors cursor-default ${tool.color}`}
                  >
                    <span className="font-black px-1.5 py-0.5 rounded-md bg-white/10 shadow-inner">
                      {tool.short}
                    </span>
                    <span className="text-white/90 tracking-wide font-semibold">
                      {tool.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 📸 الجزء الأيمن: الصورة بالإطار السينمائي */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="justify-self-center lg:justify-self-end w-full max-w-[400px] aspect-square relative group order-1 lg:order-2"
        >
          {/* إضاءة خلفية (Glow) بتكبر مع الـ Hover */}
          <div className="absolute inset-0 bg-indigo-600/20 rounded-[2.5rem] blur-2xl group-hover:bg-indigo-600/40 group-hover:blur-3xl transition-all duration-700" />
          
          {/* الإطار الزجاجي الخارجي */}
          <div className="w-full h-full rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#12141d] to-[#090a0f] p-3 shadow-2xl relative z-10 group-hover:border-indigo-500/30 transition-all duration-500 group-hover:-translate-y-2">
            
            {/* انعكاس إضاءة زجاجي (Glass highlight) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem]" />
            
            {/* حاوية الصورة الداخلية */}
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-zinc-900 shadow-inner">
              <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={avatar} 
                alt="Ahmed Adwy" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
              />
            </div>
            
          </div>
        </motion.div>

      </div>
    </section>
  );
}