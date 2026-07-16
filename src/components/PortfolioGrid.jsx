"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import ProjectCard from './ProjectCard';
import { FiX } from 'react-icons/fi';

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsubscribeProjects = onSnapshot(q, (snapshot) => {
      let projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      projs.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(projs);
    });

    const docRef = doc(db, "portfolio", "settings");
    const unsubscribeSettings = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedCategories = data.categories || ["Commercials", "Motion Graphics", "Social Media"];
        setCategories(["All", ...savedCategories]);
      }
    });

    return () => {
      unsubscribeProjects();
      unsubscribeSettings();
    };
  }, []);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
    return url;
  };

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      
      {/* 📝 العناوين بتصميم فخم (Gradient Text) */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500"
        >
          Selected Work
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]"
        >
          A collection of my recent projects
        </motion.p>
      </div>

      {/* 🎛️ أزرار الفلتر (Glassmorphism Pills) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-14"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              activeFilter === category
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 backdrop-blur-md'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* 🎞️ شبكة عرض المشاريع */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <ProjectCard project={project} onClick={() => setSelectedVideo(project)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 🖥️ نافذة عرض الفيديو المنبثقة (Video Modal) */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 md:p-10"
          >
            {/* زر الإغلاق */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-6 md:top-12 md:right-12 text-white hover:text-red-400 transition-all cursor-pointer p-4 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 backdrop-blur-md z-[1000] shadow-2xl hover:rotate-90"
            >
              <FiX size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {selectedVideo.videoUrl ? (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-zinc-500 font-medium">
                  Video processing or URL is missing...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}