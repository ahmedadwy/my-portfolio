"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import * as FiIcons from 'react-icons/fi';

function ServiceCard({ service, glowColor, isMobile }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  // إغلاق الدوران في الموبايل
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? [0, 0] : ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? [0, 0] : ["-10deg", "10deg"]);

  const renderIcon = (iconName) => {
    const IconComponent = FiIcons[iconName] || FiIcons.FiFilm;
    return <IconComponent className="text-[22px] md:text-3xl" />;
  };

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: isMobile ? "flat" : "preserve-3d" }}
      onMouseMove={(e) => {
        if(isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group relative bg-[#090a0f] border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 md:hover:-translate-y-2"
      whileHover={!isMobile ? { borderColor: `${glowColor}50`, boxShadow: `0 20px 40px -15px ${glowColor}40` } : {}}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
      
      <div style={{ transform: isMobile ? "none" : "translateZ(40px)" }} className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-zinc-900/80 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 mb-5 md:mb-6 text-zinc-400 group-hover:text-white transition-all duration-500 shadow-md">
        {/* إضاءة الأيقونة في الخلفية */}
        <div className="absolute inset-0 rounded-xl md:rounded-2xl opacity-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: glowColor, filter: 'blur(10px)' }} />
        <div className="relative z-10 drop-shadow-md" style={{ color: isMobile ? glowColor : undefined }}>{renderIcon(service.icon)}</div>
      </div>
      
      <h3 style={{ transform: isMobile ? "none" : "translateZ(30px)" }} className="relative z-10 text-lg md:text-xl font-bold text-white mb-2 md:mb-3 transition-colors duration-300">
        {service.title}
      </h3>
      <p style={{ transform: isMobile ? "none" : "translateZ(20px)" }} className="relative z-10 text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
        {service.desc}
      </p>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [glowColor, setGlowColor] = useState("#4f46e5");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    const unsubscribe = onSnapshot(doc(db, "portfolio", "settings"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setServices(data.services || []);
        if(data.glowColor1) setGlowColor(data.glowColor1);
      }
    });
    return () => { unsubscribe(); window.removeEventListener('resize', handleResize); };
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 md:py-24 px-5 md:px-6 max-w-7xl mx-auto relative z-10 overflow-hidden">
      <div className="text-center mb-10 md:mb-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
          My Services
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-500 text-[10px] md:text-sm font-medium uppercase tracking-[0.2em]">
          What I bring to your projects
        </motion.p>
      </div>

      <motion.div 
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        style={{ perspective: isMobile ? "none" : "1500px" }}
      >
        {services.map((service, index) => (
          <motion.div key={service.id || index} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <ServiceCard service={service} glowColor={glowColor} isMobile={isMobile} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}