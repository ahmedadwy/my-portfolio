import { FaPlay } from 'react-icons/fa';

export default function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={() => onClick(project)} 
      className="group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#090a0f] border border-white/5 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:border-indigo-500/30"
    >
      {/* 🖼️ الصورة الخلفية مع تأثير الزووم */}
      <img 
        src={project.thumbnail} 
        alt={project.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* 🌑 التدرج اللوني (Gradient Overlay) عشان الكلام يبان بوضوح */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-[#060814]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* ▶️ زر التشغيل الزجاجي (بيظهر في النص عند الـ Hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
        <div className="w-16 h-16 rounded-full bg-indigo-600/80 backdrop-blur-md flex items-center justify-center text-white pl-1 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
          <FaPlay size={20} />
        </div>
      </div>

      {/* 📝 تفاصيل المشروع (بتتحرك لفوق حركة خفيفة مع الـ Hover) */}
      <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {project.category}
        </p>
        <h3 className="text-white font-bold text-xl md:text-2xl truncate drop-shadow-md">
          {project.title}
        </h3>
        
        {/* أيقونات البرامج (لو بتستخدمها مستقبلاً) */}
        {project.tools && project.tools.length > 0 && (
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {project.tools.map((tool) => (
              <span 
                key={tool} 
                className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 backdrop-blur-sm text-white border border-white/10"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}