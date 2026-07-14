"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import ProjectCard from './ProjectCard';
import { FiX } from 'react-icons/fi';

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // 1. جلب المشاريع الحية
    const q = query(collection(db, "projects"), orderBy("id", "desc"));
    const unsubscribeProjects = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projs);
    });

    // 2. جلب الأقسام
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

  // دالة تحويل الروابط
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
    }

    return url;
  };

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Selected Work</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-wider">A collection of my recent video editing & motion design projects</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeFilter === category
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-[#13151a] text-zinc-400 border border-zinc-800/60 hover:text-white hover:border-zinc-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 md:p-10"
          >
            {/* ⚡ تم تنزيل الزرار لتحت باستخدام top-20 للموبايل و top-24 للشاشات الكبيرة */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-20 right-4 md:top-24 md:right-10 text-white hover:text-red-400 transition cursor-pointer p-3 bg-zinc-800/80 hover:bg-zinc-800 rounded-full border border-zinc-600 z-[1000] shadow-xl"
            >
              <FiX size={26} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-2xl"
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
                <div className="flex items-center justify-center w-full h-full text-zinc-500">
                  No video URL provided.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}