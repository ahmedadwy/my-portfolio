"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const docRef = doc(db, "portfolio", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSocials({
            behance: data.behanceUrl || "",
            linkedin: data.linkedinUrl || "",
            vimeo: data.vimeoUrl || "",
            instagram: data.instagramUrl || ""
          });
          if (data.whatsappNum) setWhatsappNumber(data.whatsappNum);
          if (data.cvFile) setCvFile(data.cvFile);
        }
      } catch (error) {
        console.error("Error fetching cloud data:", error);
      }
    };
    fetchCloudData();
  }, []);

  const whatsappMessage = encodeURIComponent("مرحباً! شاهدت معرض أعمالك وأود مناقشة مشروع جديد معك.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return alert("Please fill all fields!");

    setStatus("loading");

    const SERVICE_ID = "service_y05mi7d"; 
    const TEMPLATE_ID = "template_bix34cr"; 
    const PUBLIC_KEY = "sJYfmmA5-nNl5MWQE"; 

    const currentTime = new Date().toLocaleString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true 
    });

    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID, template_id: TEMPLATE_ID, user_id: PUBLIC_KEY,
          template_params: { from_name: name, from_email: email, message: message, time: currentTime }
        }),
      });

      await addDoc(collection(db, "messages"), {
        id: Date.now(),
        name: name,
        email: email,
        text: message,
        date: currentTime
      });

      setStatus("success");
      setName(""); setEmail(""); setMessage("");
      setTimeout(() => setStatus("idle"), 5000); // إخفاء رسالة النجاح بعد 5 ثواني
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  // إعدادات الأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      
      {/* تأثيرات الإضاءة الخلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* 📝 العناوين (نفس الستايل المتدرج) */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500"
        >
          Let's Create Something Together
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]"
        >
          Get in touch
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start max-w-5xl mx-auto">
        
        {/* 📱 العمود الأيسر: معلومات التواصل والشبكات الاجتماعية */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-10 lg:col-span-1 lg:pr-8"
        >
          <motion.div variants={fadeUp}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">Direct Contact</h4>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-lg font-medium text-white hover:text-indigo-400 transition-colors duration-300">
              <FaWhatsapp className="text-emerald-500 text-xl" />
              +{whatsappNumber}
            </a>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">Follow My Work</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null;
                const Icon = platform === 'behance' ? FaBehance : platform === 'vimeo' ? FaVimeoV : platform === 'linkedin' ? FaLinkedinIn : FaInstagram;
                return (
                  <a 
                    key={platform} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-2xl bg-[#090a0f] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                    title={platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {cvFile && (
            <motion.div variants={fadeUp} className="pt-4">
              <a 
                href={cvFile} 
                download="Ahmed_Adwy_Resume" 
                className="inline-flex items-center gap-3 text-sm font-semibold text-white bg-indigo-600/20 border border-indigo-500/30 px-6 py-3.5 rounded-2xl hover:bg-indigo-600 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                <FiFileText size={18} /> Download My CV
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* ✉️ العمود الأيمن: نموذج الإرسال (Glassmorphism Card) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="lg:col-span-2 w-full"
        >
          <form onSubmit={handleSendEmail} className="bg-[#090a0f] border border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            
            {/* انعكاس إضاءة على الفورم */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* رسائل التنبيه */}
            <AnimatePresence>
              {status === "success" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-2xl flex items-center justify-center gap-2">
                  Message Sent Successfully! We'll be in touch. ✨
                </motion.div>
              )}
              {status === "error" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl flex items-center justify-center gap-2">
                  Something went wrong. Please try again! ⚠️
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <FiUser size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={status === "loading"} 
                    className="w-full bg-[#13151a] border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none rounded-2xl pl-11 pr-5 py-4 text-sm text-white transition-all placeholder:text-zinc-600 shadow-inner"
                    required 
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <FiMail size={18} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={status === "loading"} 
                    className="w-full bg-[#13151a] border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none rounded-2xl pl-11 pr-5 py-4 text-sm text-white transition-all placeholder:text-zinc-600 shadow-inner"
                    required 
                  />
                </div>
              </div>
              
              <textarea 
                placeholder="Tell me about your project..." 
                rows="4" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                disabled={status === "loading"} 
                className="w-full bg-[#13151a] border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none rounded-2xl px-5 py-4 text-sm text-white transition-all placeholder:text-zinc-600 resize-none shadow-inner"
                required
              ></textarea>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={status === "loading"} 
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none"
                >
                  <FiSend size={16} />
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
                
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 hover:-translate-y-1"
                >
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