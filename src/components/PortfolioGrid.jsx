"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import ProjectCard from './ProjectCard';

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    // 1. جلب المشاريع الحية (Real-time) من كولكشن projects
    const q = query(collection(db, "projects"), orderBy("id", "desc"));
    const unsubscribeProjects = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projs);
    });

    // 2. جلب الأقسام (Categories) من مستند settings
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

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Selected Work</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-wider">A collection of my recent video editing & motion design projects</p>
      </div>

      {/* أزرار الفلترة الحية */}
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

      {/* الـ Grid */}
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
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}