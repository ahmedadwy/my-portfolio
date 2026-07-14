import { FaPlay } from 'react-icons/fa';

export default function ProjectCard({ project, onClick }) {
  return (
    <div 
      onClick={() => onClick(project)} 
      className="block bg-[#13151a] border border-zinc-800/60 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 shadow-md cursor-pointer"
    >
      
      {/* منطقة الصورة المصغرة وزر التشغيل */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* طبقة الظل وزر الـ Play عند الـ Hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-base shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="ml-0.5" />
          </div>
        </div>
      </div>

      {/* تفاصيل المشروع تحت الصورة */}
      <div className="p-4 bg-[#111317]">
        <h3 className="text-white font-medium text-sm mb-3 truncate">{project.title}</h3>
        
        {/* أيقونات البرامج المستخدمة */}
        <div className="flex gap-2">
          {project.tools && project.tools.map((tool) => (
            <span 
              key={tool} 
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                tool === 'Ae' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' :
                tool === 'Pr' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 
                'bg-zinc-800 text-zinc-300'
              }`}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}