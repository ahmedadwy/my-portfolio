"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function About() {
  const [title, setTitle] = useState("About Me");
  const [desc, setDesc] = useState("I am a passionate Visual Artist specializing in video post-production...");
  const [avatar, setAvatar] = useState("/avatar.jpg"); // 👈 قيمة افتراضية للصورة
  const [tools, setTools] = useState([
    { name: "After Effects", short: "Ae", color: "border-purple-800 text-purple-400 bg-purple-950/20" }
  ]);

  useEffect(() => {
    // الاتصال بـ Firebase لسحب البيانات لحظياً وتحديث الـ Tools بشكل ديناميكي كامل
    const docRef = doc(db, "portfolio", "settings");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.aboutTitle) setTitle(data.aboutTitle);
        if (data.aboutDesc) setDesc(data.aboutDesc);
        if (data.aboutImage) setAvatar(data.aboutImage);
        
        // ⚡ التحديث الذكي: بيقرأ المصفوفة من اللوحة مباشرة سواء زادت، نقصت، أو اتصفرت
        if (data.tools) {
          setTools(data.tools);
        }
      }
    });

    return () => unsubscribe(); // تنظيف المراقب عند غلق الصفحة
  }, []);

  return (
    <section id="about" className="py-20 px-6 max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* النصوص والبرامج */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light max-w-xl">{desc}</p>
        <div className="space-y-3 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Software & Tools</h4>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool) => (
              <div key={tool.name} className={`px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 ${tool.color}`}>
                <span className="font-bold">{tool.short}</span>
                <span className="text-zinc-300 font-normal">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الصورة بالإطار المتوهج */}
      <div className="justify-self-center lg:justify-self-end w-full max-w-[360px] aspect-square relative group">
        <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl blur-xl group-hover:bg-indigo-600/30 transition-all duration-500" />
        <div className="w-full h-full rounded-2xl border border-zinc-800 bg-[#13151a] p-3 shadow-2xl relative z-10">
          <img 
            src={avatar} // 👈 هنا بنعرض الصورة الدايناميك المحدثة
            alt="My Avatar" 
            className="w-full h-full rounded-xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>

    </section>
  );
}