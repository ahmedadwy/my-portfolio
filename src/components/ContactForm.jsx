"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { FaBehance, FaLinkedinIn, FaVimeoV, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiFileText, FiSend } from 'react-icons/fi';

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
      // 1. الإرسال لإيميلك
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID, template_id: TEMPLATE_ID, user_id: PUBLIC_KEY,
          template_params: { from_name: name, from_email: email, message: message, time: currentTime }
        }),
      });

      // 2. الحفظ السحابي في Firebase
      await addDoc(collection(db, "messages"), {
        id: Date.now(),
        name: name,
        email: email,
        text: message,
        date: currentTime
      });

      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto text-center relative">
      {/* تأثير إضاءة خلفي خفيف */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-3">
        Let's Create Something Together
      </h2>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-16">Get in touch</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left items-start">
        
        {/* العمود الأيسر: معلومات التواصل والشبكات الاجتماعية */}
        <div className="space-y-8 md:col-span-1">
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-2">Direct Contact</h4>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors duration-200 block mb-1">
              + {whatsappNumber}
            </a>
          </div>

          {/* عرض السوشيال ميديا الحية */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Follow My Work</h4>
            <div className="flex flex-wrap gap-3">
              {socials.behance && (
                <a href={socials.behance} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200" title="Behance">
                  <FaBehance size={16} />
                </a>
              )}
              {socials.vimeo && (
                <a href={socials.vimeo} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200" title="Vimeo">
                  <FaVimeoV size={14} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200" title="LinkedIn">
                  <FaLinkedinIn size={15} />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200" title="Instagram">
                  <FaInstagram size={15} />
                </a>
              )}
            </div>
          </div>

          {/* زر تحميل الـ CV */}
          {cvFile && (
            <div className="pt-2">
              <a href={cvFile} download="ADWY_Resume" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/30 border border-indigo-500/20 px-5 py-3 rounded-xl hover:bg-indigo-950/50 hover:border-indigo-500/40 transition-all duration-200">
                <FiFileText size={14} /> Download My CV
              </a>
            </div>
          )}
        </div>

        {/* العمود الأيمن: نموذج الإرسال */}
        <form onSubmit={handleSendEmail} className="space-y-4 md:col-span-2 w-full">
          {status === "success" && (
            <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl text-center backdrop-blur-sm">
              Message Sent & Synced to Cloud! ✓
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl text-center backdrop-blur-sm">
              Error sending. Try again!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={status === "loading"} 
              className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 focus:border-indigo-500/50 focus:outline-none rounded-xl px-5 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600"
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={status === "loading"} 
              className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 focus:border-indigo-500/50 focus:outline-none rounded-xl px-5 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600"
              required 
            />
          </div>
          
          <textarea 
            placeholder="Message" 
            rows="5" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            disabled={status === "loading"} 
            className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 focus:border-indigo-500/50 focus:outline-none rounded-xl px-5 py-3.5 text-sm text-white transition-colors placeholder:text-zinc-600 resize-none"
            required
          ></textarea>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button 
              type="submit" 
              disabled={status === "loading"} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10"
            >
              <FiSend size={14} />
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200"
            >
              <FaWhatsapp size={16} /> Chat on WhatsApp
            </a>
          </div>
        </form>

      </div>
    </section>
  );
}