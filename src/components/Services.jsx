"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FiFilm, FiScissors, FiLayers } from 'react-icons/fi';

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

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FiScissors": return <FiScissors className="text-2xl text-indigo-500" />;
      case "FiLayers": return <FiLayers className="text-2xl text-purple-500" />;
      default: return <FiFilm className="text-2xl text-blue-500" />;
    }
  };

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-2">My Services</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-wider">What I bring to your projects</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-[#111319] border border-zinc-800/80 p-8 rounded-2xl transition-colors hover:border-zinc-700">
            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 mb-6">
              {renderIcon(service.icon)}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}