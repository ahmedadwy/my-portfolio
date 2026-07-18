import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

export default function ProjectCard({ project, onClick, glowColor }) {
  // 🚀 إعدادات الـ 3D الخاصة بالكارت ده فقط
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)} 
      className="group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#090a0f] border border-white/5 shadow-lg transition-colors duration-500"
      whileHover={{ scale: 1.02, boxShadow: `0 20px 40px -15px ${glowColor}60`, borderColor: `${glowColor}50` }}
    >
      {/* 🖼️ الصورة (بارزة لبرة شوية) */}
      <motion.img 
        style={{ transform: "translateZ(20px)" }}
        src={project.thumbnail} 
        alt={project.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* 🌑 التدرج اللوني */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-[#060814]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" style={{ transform: "translateZ(30px)" }} />

      {/* ▶️ زر التشغيل الزجاجي (بيأخد اللون الديناميكي) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ transform: "translateZ(60px)" }}>
        <div className="w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center text-white pl-1" style={{ backgroundColor: `${glowColor}B3`, boxShadow: `0 0 30px ${glowColor}80` }}>
          <FaPlay size={20} />
        </div>
      </div>

      {/* 📝 تفاصيل المشروع */}
      <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ transform: "translateZ(50px)" }}>
        <p style={{ color: glowColor }} className="text-xs font-bold uppercase tracking-widest mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {project.category}
        </p>
        <h3 className="text-white font-bold text-xl md:text-2xl truncate drop-shadow-md">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}