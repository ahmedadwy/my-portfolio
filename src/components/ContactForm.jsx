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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    const fetchCloudData = async () => {
      const docSnap = await getDoc(doc(db, "portfolio", "settings"));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocials({ behance: data.behanceUrl || "", linkedin: data.linkedinUrl || "", vimeo: data.vimeoUrl || "", instagram: data.instagramUrl || "" });
        if (data.whatsappNum) setWhatsappNumber(data.whatsappNum);
        if (data.cvFile) setCvFile(data.cvFile);
        if (data.glowColor1) setGlowColor(data.glowColor1);
      }
    };
    fetchCloudData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const whatsappMessage = encodeURIComponent("مرحباً! شاهدت معرض أعمالك وأود مناقشة مشروع جديد معك.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleSendEmail = async (e) => {
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isMobile ? [0,0] : ["5deg", "-5deg"]); 
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isMobile ? [0,0] : ["-5deg", "5deg"]);

  return (
    <section id="contact" className="py-20 md:py-24 px-5 md:px-6 max-w-6xl mx-auto relative z-10 overflow-hidden" style={{ perspective: isMobile ? "none" : "1500px" }}>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] blur-[100px] md:blur-[150px] rounded-full pointer-events-none -z-10 opacity-30" style={{ backgroundColor: glowColor }} />

      <div className="text-center mb-12 md:mb-16">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">Let's Create Something Together</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-zinc-500 text-[10px] md:text-sm font-medium uppercase tracking-[0.2em]">Get in touch</motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-8 items-start max-w-5xl mx-auto">
        
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8 md:space-y-10 lg:col-span-1 lg:pr-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div>
            <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3 md:mb-4">Direct Contact</h4>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center lg:justify-start gap-2 md:gap-3 text-base md:text-lg font-medium text-white hover:text-emerald-400 transition-colors duration-300">
              <FaWhatsapp className="text-emerald-500 text-lg md:text-xl" /> +{whatsappNumber}
            </a>
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3 md:mb-4">Follow My Work</h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null;
                const Icon = platform === 'behance' ? FaBehance : platform === 'vimeo' ? FaVimeoV : platform === 'linkedin' ? FaLinkedinIn : FaInstagram;
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#090a0f] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-lg hover:-translate-y-1"><Icon className="text-sm md:text-base" /></a>
                );
              })}
            </div>
          </div>

          {cvFile && (
            <div className="pt-2 md:pt-4 w-full sm:w-auto">
              <a href={cvFile} download="Ahmed_Adwy_Resume" style={{ color: glowColor, borderColor: `${glowColor}50`, backgroundColor: `${glowColor}15` }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-semibold px-5 py-3 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl hover:text-white transition-all hover:-translate-y-1">
                <FiFileText className="text-base md:text-lg" /> Download My CV
              </a>
            </div>
          )}
        </motion.div>

        <motion.div 
          style={{ rotateX, rotateY, transformStyle: isMobile ? "flat" : "preserve-3d" }}
          onMouseMove={(e) => {
            if(isMobile) return;
            const rect = e.currentTarget.getBoundingClientRect();
            x.set((e.clientX - rect.left) / rect.width - 0.5);
            y.set((e.clientY - rect.top) / rect.height - 0.5);
          }}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="lg:col-span-2 w-full px-2 sm:px-0"
        >
          <form onSubmit={handleSendEmail} className="bg-[#090a0f] border border-white/5 p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] md:blur-[80px] rounded-full pointer-events-none opacity-30 md:opacity-40 transition-colors" style={{ backgroundColor: glowColor }} />

            <div className="space-y-4 md:space-y-5 relative z-10" style={{ transform: isMobile ? "none" : "translateZ(30px)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-500"><FiUser size={16} /></div>
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-xl md:rounded-2xl pl-10 md:pl-11 pr-4 md:pr-5 py-3.5 md:py-4 text-xs md:text-sm text-white transition-all shadow-inner" style={{ focus: { borderColor: glowColor } }} required />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none text-zinc-500"><FiMail size={16} /></div>
                  <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-xl md:rounded-2xl pl-10 md:pl-11 pr-4 md:pr-5 py-3.5 md:py-4 text-xs md:text-sm text-white transition-all shadow-inner" required />
                </div>
              </div>
              
              <textarea placeholder="Tell me about your project..." rows="4" value={message} onChange={(e) => setMessage(e.target.value)} disabled={status === "loading"} className="w-full bg-[#13151a] border border-white/5 focus:ring-1 outline-none rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-xs md:text-sm text-white transition-all resize-none shadow-inner" required></textarea>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
                <button type="submit" disabled={status === "loading"} style={{ backgroundColor: glowColor, boxShadow: `0 0 30px ${glowColor}40` }} className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl text-white font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-2 hover:brightness-110 md:hover:-translate-y-1 disabled:opacity-50">
                  <FiSend size={14} /> {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 font-semibold text-xs md:text-sm transition-all md:hover:-translate-y-1">
                  <FaWhatsapp size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}