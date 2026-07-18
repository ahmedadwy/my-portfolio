"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function About() {
  const [title, setTitle] = useState("About Me");
  const [desc, setDesc] = useState("I am a passionate Visual Artist specializing in video post-production...");
  const [avatar, setAvatar] = useState("/avatar.jpg"); 
  const [tools, setTools] = useState([]);
  const [glowColor, setGlowColor] = useState("#4f46e5");

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.aboutTitle) setTitle(data.aboutTitle);
        if (data.aboutDesc) setDesc(data.aboutDesc);
        if (data.aboutImage) setAvatar(data.aboutImage);
        if (data.tools) setTools(data.tools);
        if (data.glowColor1) setGlowColor(data.glowColor1);
      }
    });
    return () => unsubscribe(); 
  }, []);

  // 🚀 3D Tilt للصورة
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* النصوص والأدوات */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8 order-2 lg:order-1">
          <div>
            <p style={{ color: glowColor }} className="text-xs font-bold uppercase tracking-[0.2em] mb-3">Behind the Edits</p>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 leading-tight">
              {title}
            </h2>
          </div>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light max-w-xl">{desc}</p>

          {tools.length > 0 && (
            <div className="pt-6 border-t border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-6">Software & Arsenal</h4>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05, y: -2 }} className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-3 backdrop-blur-md shadow-lg cursor-default ${tool.color}`}>
                    <span className="font-black px-1.5 py-0.5 rounded-md bg-white/10 shadow-inner">{tool.short}</span>
                    <span className="text-white/90 tracking-wide font-semibold">{tool.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* 📸 الصورة 3D */}
        <div className="justify-self-center lg:justify-self-end w-full max-w-[400px] aspect-square order-1 lg:order-2" style={{ perspective: "1500px" }}>
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              x.set((e.clientX - rect.left) / rect.width - 0.5);
              y.set((e.clientY - rect.top) / rect.height - 0.5);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="w-full h-full relative group"
          >
            {/* إضاءة خلفية ديناميكية */}
            <div className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" style={{ backgroundColor: glowColor, transform: "translateZ(-30px)" }} />
            
            <div className="w-full h-full rounded-[2.5rem] border border-white/10 bg-[#090a0f] p-3 shadow-2xl relative z-10 transition-all duration-500" style={{ transform: "translateZ(0px)" }}>
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-zinc-900 shadow-inner" style={{ transform: "translateZ(20px)" }}>
                <div className="absolute inset-0 mix-blend-overlay z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: glowColor }} />
                <img src={avatar} alt="Ahmed Adwy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}