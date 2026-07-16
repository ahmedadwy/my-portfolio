"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import * as FiIcons from 'react-icons/fi'; // ⚡ تم استدعاء كل الأيقونات عشان تقرأ اختيارات الداشبورد كلها

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "portfolio", "settings");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setServices(docSnap.data().services || []);
      }
    });
    return () => unsubscribe();
  }, []);

  // ⚡ دالة ذكية بتقرأ اسم الأيقونة من الداتابيز وتجيبها من المكتبة فوراً
  const renderIcon = (iconName) => {
    const IconComponent = FiIcons[iconName] || FiIcons.FiFilm; // FiFilm كبديل افتراضي
    return <IconComponent size={24} />;
  };

  if (services.length === 0) return null;

  // إعدادات الـ Animations للكروت (عشان يظهروا ورا بعض)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      
      {/* 📝 العناوين (نفس ستايل قسم المشاريع عشان التناسق) */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500"
        >
          My Services
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]"
        >
          What I bring to your projects
        </motion.p>
      </div>

      {/* 🗂️ شبكة الكروت */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {services.map((service, index) => (
          <motion.div 
            key={service.id || index} 
            variants={cardVariants}
            className="group relative bg-[#090a0f] border border-white/5 p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)] cursor-default"
          >
            {/* ✨ إضاءة خلفية ناعمة بتظهر مع الـ Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 🎯 الأيقونة (مربعة وفيها حركة ناعمة) */}
            <div className="relative z-10 w-14 h-14 bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 mb-6 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-500">
              {renderIcon(service.icon)}
            </div>
            
            {/* 📄 النصوص */}
            <h3 className="relative z-10 text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">
              {service.title}
            </h3>
            <p className="relative z-10 text-zinc-400 text-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}