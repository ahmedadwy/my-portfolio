"use client";
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { FaBehance, FaLinkedinIn, FaVimeoV, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiFileText, FiSend, FiMail, FiUser } from 'react-icons/fi';

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [socials, setSocials] = useState({ behance: "", linkedin: "", vimeo: "", instagram: "" });
  const [whatsappNumber, setWhatsappNumber] = useState("201157266796");
  const [cvFile, setCvFile] = useState(""); 
  const [glowColor, setGlowColor] = useState("#4f46e5");

  useEffect(() => {
    const fetchCloudData = async () => {
      const docRef = doc(db, "portfolio", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocials({ behance: data.behanceUrl || "", linkedin: data.linkedinUrl || "", vimeo: data.vimeoUrl || "", instagram: data.instagramUrl || "" });
        if (data.whatsappNum) setWhatsappNumber(data.whatsappNum);
        if (data.cvFile) setCvFile(data.cvFile);
        if (data.glowColor1) setGlowColor(data.glowColor1);
      }
    };
    fetchCloudData();
  }, []);

  const whatsappMessage = encodeURIComponent("مرحباً! شاهدت معرض أعمالك وأود مناقشة مشروع جديد معك.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleSendEmail = async (e) => {
    // كود الإرسال زي ما هو مفيش تغيير
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return alert("Please fill all fields!");
    setStatus("loading");
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: "service_y05mi7d", template_id: "template_bix34cr", user_id: "sJYfmmA5-nNl5MWQE", template_params: { from_name: name, from_email: email, message: message, time: new Date().toLocaleString() } }),
      });
      await addDoc(collection(db, "messages"), { id: Date.now(), name, email, text: message, date: new Date().toLocaleString() });
      setStatus("success"); setName(""); setEmail(""); setMessage("");
      setTimeout(() => setStatus("idle"), 5000); 
    } catch (error) { setStatus("error"); setTimeout(() => setStatus("idle"), 5000); }
  };

  // 🚀 3D Form Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]); // حركة خفيفة عشان الكتابة تبقى مريحة
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto relative z-10" style={{ perspective: "1500px" }}>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[150px] rounded-full pointer-events-none -z-10 opacity-20" style={{ backgroundColor: glowColor }} />

      <div className="text-center mb-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">Let's Create Something Together</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">Get in touch</motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start max-w-5xl mx-auto">
        
        {/* معلومات التواصل */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10 lg:col-span-1 lg:pr-8">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">Direct Contact</h4>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-lg font-medium text-white hover:text-emerald-400 transition-colors duration-300">
              <FaWhatsapp className="text-emerald-500 text-xl" /> +{whatsappNumber}
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">Follow My Work</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null;
                const Icon = platform === 'behance' ? FaBehance : platform === 'vimeo' ? FaVimeoV : platform === 'linkedin' ? FaLinkedinIn : FaInstagram;
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={{ hover: { borderColor: glowColor, color: glowColor } }} className="w-12 h-12 rounded-2xl bg-[#090a0f] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-lg hover:-translate-y-1"><Icon size={18} /></a>
                );
              })}
            </div>
          </div>

          {cvFile && (
            <div className="pt-4">
              <a href={cvFile} download="Ahmed_Adwy_Resume" style={{ color: glowColor, borderColor: `${glowColor}50`, backgroundColor: `${glowColor}15` }} className="inline-flex items-center gap-3 text-sm font-semibold px-6 py-3.5 rounded-2xl hover:text-white transition-all duration-300 hover:-translate-y-1">
                <FiFileText size={18} /> Download My CV
              </a>
            </div>
          )}
        </motion.div>

        {/* ✉️ فورم الإرسال 3D */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set((e.clientX - rect.left) / rect.width - 0.5);
            y.set((e.clientY - rect.top) / rect.height - 0.5);
          }}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="lg:col-span-2 w-full"
        >
          <form onSubmit={handleSendEmail} className="bg-[#090a0f] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[80px] rounded-full pointer-events-none opacity-40 transition-colors duration-1000" style={{ backgroundColor: glowColor }} />

            <div className="space-y-5 relative z-10" style={{ transform: "translateZ(30px)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><FiUser size={18} /></div>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-2xl pl-11 pr-5 py-4 text-sm text-white transition-all shadow-inner" style={{ focus: { borderColor: glowColor } }} required />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><FiMail size={18} /></div>
                  <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-2xl pl-11 pr-5 py-4 text-sm text-white transition-all shadow-inner" required />
                </div>
              </div>
              
              <textarea placeholder="Tell me about your project..." rows="4" value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-2xl px-5 py-4 text-sm text-white transition-all resize-none shadow-inner" required></textarea>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button type="submit" disabled={status === "loading"} style={{ backgroundColor: glowColor, boxShadow: `0 0 30px ${glowColor}40` }} className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-110 hover:-translate-y-1 disabled:opacity-50">
                  <FiSend size={16} /> {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 hover:-translate-y-1">
                  <FaWhatsapp size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}