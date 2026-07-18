"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import * as FiIcons from 'react-icons/fi';

// 🚀 كارت الخدمة الـ 3D المستقل
function ServiceCard({ service, glowColor }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const renderIcon = (iconName) => {
    const IconComponent = FiIcons[iconName] || FiIcons.FiFilm;
    return <IconComponent size={28} />;
  };

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group relative bg-[#090a0f] border border-white/5 p-8 rounded-3xl overflow-hidden transition-colors duration-500 cursor-default"
      whileHover={{ scale: 1.05, borderColor: `${glowColor}50`, boxShadow: `0 20px 40px -15px ${glowColor}40` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div 
        style={{ transform: "translateZ(40px)" }} 
        className="relative z-10 w-16 h-16 bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 mb-6 text-zinc-400 group-hover:text-white transition-all duration-500"
      >
        {/* لون الأيقونة يتغير للون الديناميكي */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: glowColor, filter: 'blur(10px)' }} />
        <div className="relative z-10 drop-shadow-md">{renderIcon(service.icon)}</div>
      </div>
      
      <h3 style={{ transform: "translateZ(30px)" }} className="relative z-10 text-xl font-bold text-white mb-3 transition-colors duration-300">
        {service.title}
      </h3>
      <p style={{ transform: "translateZ(20px)" }} className="relative z-10 text-zinc-400 text-sm font-light leading-relaxed">
        {service.desc}
      </p>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [glowColor, setGlowColor] = useState("#4f46e5");

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setServices(data.services || []);
        if(data.glowColor1) setGlowColor(data.glowColor1);
      }
    });
    return () => unsubscribe();
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
          My Services
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
          What I bring to your projects
        </motion.p>
      </div>

      <motion.div 
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: "1500px" }}
      >
        {services.map((service, index) => (
          <motion.div key={service.id || index} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
            <ServiceCard service={service} glowColor={glowColor} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}