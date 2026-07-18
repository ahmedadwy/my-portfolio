import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ProjectCard({ project, onClick, glowColor }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? [0,0] : ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? [0,0] : ["-15deg", "15deg"]);

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
      onClick={() => onClick(project)} 
      className="group relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-[#090a0f] border border-white/5 shadow-lg transition-colors duration-500"
      whileHover={!isMobile ? { scale: 1.02, boxShadow: `0 20px 40px -15px ${glowColor}60`, borderColor: `${glowColor}50` } : {}}
    >
      <motion.img 
        style={{ transform: isMobile ? "none" : "translateZ(20px)" }}
        src={project.thumbnail} 
        alt={project.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
      />
      
      {/* التدرج اللوني يظهر دايماً على الموبايل عشان الكلام يبان */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-[#060814]/60 md:via-[#060814]/40 to-transparent opacity-100 md:opacity-80 md:group-hover:opacity-90 transition-opacity duration-500" style={{ transform: isMobile ? "none" : "translateZ(30px)" }} />

      <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500" style={{ transform: isMobile ? "none" : "translateZ(60px)" }}>
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full backdrop-blur-md flex items-center justify-center text-white pl-1" style={{ backgroundColor: `${glowColor}B3`, boxShadow: `0 0 30px ${glowColor}80` }}>
          <FaPlay className="text-sm md:text-xl" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500" style={{ transform: isMobile ? "none" : "translateZ(50px)" }}>
        <p style={{ color: glowColor }} className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
          {project.category}
        </p>
        <h3 className="text-white font-bold text-base md:text-2xl truncate drop-shadow-md">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}