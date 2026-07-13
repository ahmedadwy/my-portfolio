"use client";
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiMail, FiVideo, FiLogOut, FiUpload, FiFolder, FiUser, FiCpu, FiImage, FiHome, FiBriefcase, FiLink, FiShield, FiLock, FiUnlock, FiFileText, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { FaVimeoV, FaBehance, FaWhatsapp } from 'react-icons/fa';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("hero"); 

  // 🛡️ States تغيير الباسورد
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  // ⚡ States الأقسام
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState(""); 
  const [heroThumbnail, setHeroThumbnail] = useState(""); 

  const [services, setServices] = useState([]);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceIcon, setNewServiceIcon] = useState("FiFilm");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [behanceUrl, setBehanceUrl] = useState("");
  const [whatsappNum, setWhatsappNum] = useState("");
  const [cvFile, setCvFile] = useState(""); 

  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDesc, setAboutDesc] = useState("");
  const [aboutImage, setAboutImage] = useState(""); 
  const [tools, setTools] = useState([]);
  const [newToolName, setNewToolName] = useState("");
  const [newToolShort, setNewToolShort] = useState("");
  const [newToolColor, setNewToolColor] = useState("purple");

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["Commercials", "Motion Graphics", "Social Media"]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Commercials");
  const [newThumbnail, setNewThumbnail] = useState(""); 
  const [newVideoUrl, setNewVideoUrl] = useState(""); 

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("adwy_admin_auth") === "true") setIsAuthenticated(true);
    setIsCheckingAuth(false);

    const fetchSettings = async () => {
      const docRef = doc(db, "portfolio", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroTitle(data.heroTitle || "");
        setHeroDesc(data.heroDesc || "");
        setHeroVideoUrl(data.heroVideoUrl || "");
        setHeroThumbnail(data.heroThumbnail || "");
        setServices(data.services || []);
        setYoutubeUrl(data.youtubeUrl || "");
        setInstagramUrl(data.instagramUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
        setVimeoUrl(data.vimeoUrl || "");
        setBehanceUrl(data.behanceUrl || "");
        setWhatsappNum(data.whatsappNum || "");
        setCvFile(data.cvFile || "");
        setAboutTitle(data.aboutTitle || "");
        setAboutDesc(data.aboutDesc || "");
        setAboutImage(data.aboutImage || "");
        setTools(data.tools || []);
        setCategories(data.categories || ["Commercials", "Motion Graphics", "Social Media"]);
      }
    };
    fetchSettings();

    const qProjects = query(collection(db, "projects"), orderBy("id", "desc"));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    const qMessages = query(collection(db, "messages"), orderBy("id", "desc"));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    });

    return () => { unsubscribeProjects(); unsubscribeMessages(); };
  }, []);

  const updateFirebaseSettings = async (updatedFields) => {
    try {
      const docRef = doc(db, "portfolio", "settings");
      await setDoc(docRef, updatedFields, { merge: true });
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const ADMIN_USER = "admin";
    const savedPassword = localStorage.getItem("adwy_admin_password") || "123456";
    if (username === ADMIN_USER && password === savedPassword) {
      setIsAuthenticated(true); localStorage.setItem("adwy_admin_auth", "true"); setLoginError("");
    } else { setLoginError("Invalid Credentials!"); }
  };

  const handleLogout = () => { setIsAuthenticated(false); localStorage.removeItem("adwy_admin_auth"); setUsername(""); setPassword(""); };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem("adwy_admin_password") || "123456";
    if (oldPassword !== savedPassword) { setPasswordMessage({ text: "Incorrect password!", type: "error" }); return; }
    if (newPassword !== confirmPassword) { setPasswordMessage({ text: "Passwords do not match!", type: "error" }); return; }
    localStorage.setItem("adwy_admin_password", newPassword);
    setPasswordMessage({ text: "Password updated! ✓", type: "success" });
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    await updateFirebaseSettings({ heroTitle, heroDesc, heroVideoUrl });
    alert("Hero updated securely in the cloud! ✓");
  };

  const handleHeroThumbUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => { 
      setHeroThumbnail(reader.result); 
      await updateFirebaseSettings({ heroThumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddService = async (e) => {
    e.preventDefault(); if (!newServiceTitle.trim() || !newServiceDesc.trim()) return;
    const updated = [...services, { id: Date.now(), title: newServiceTitle, desc: newServiceDesc, icon: newServiceIcon }];
    setServices(updated);
    await updateFirebaseSettings({ services: updated });
    setNewServiceTitle(""); setNewServiceDesc("");
  };

  const handleDeleteService = async (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    await updateFirebaseSettings({ services: updated });
  };

  const handleSaveAboutText = async (e) => {
    e.preventDefault();
    await updateFirebaseSettings({ aboutTitle, aboutDesc });
    alert("About info saved to Cloud! ✓");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => { 
      setAboutImage(reader.result); 
      await updateFirebaseSettings({ aboutImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddTool = async (e) => {
    e.preventDefault(); if (!newToolName || !newToolShort) return;
    let cls = `border-${newToolColor}-800 text-${newToolColor}-400 bg-${newToolColor}-950/20`;
    const updated = [...tools, { name: newToolName, short: newToolShort, color: cls }];
    setTools(updated);
    await updateFirebaseSettings({ tools: updated });
    setNewToolName(""); setNewToolShort("");
  };

  const handleDeleteTool = async (name) => {
    const updated = tools.filter(t => t.name !== name);
    setTools(updated);
    await updateFirebaseSettings({ tools: updated });
  };

  const handleSaveSocials = async (e) => {
    e.preventDefault();
    await updateFirebaseSettings({ youtubeUrl, instagramUrl, linkedinUrl, vimeoUrl, behanceUrl, whatsappNum });
    alert("Social links updated on all devices! ✓");
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setCvFile(reader.result);
      await updateFirebaseSettings({ cvFile: reader.result });
      alert("CV synced dynamically! ✓");
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault(); if (!newCategoryName.trim()) return;
    const updated = [...categories, newCategoryName.trim()];
    setCategories(updated);
    await updateFirebaseSettings({ categories: updated });
    setNewCategoryName("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.onloadend = () => setNewThumbnail(reader.result); reader.readAsDataURL(file);
  };

  const handleAddProject = async (e) => {
    e.preventDefault(); if (!newTitle || !newThumbnail) return alert("Fill fields!");
    const newProj = { id: Date.now(), title: newTitle, category: newCategory, thumbnail: newThumbnail, videoUrl: newVideoUrl || "#" };
    await addDoc(collection(db, "projects"), newProj);
    setNewTitle(""); setNewThumbnail(""); setNewVideoUrl("");
  };

  const handleDeleteProject = async (docId) => {
    await deleteDoc(doc(db, "projects", docId));
  };

  const handleDeleteMessage = async (docId) => {
    await deleteDoc(doc(db, "messages", docId));
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-indigo-500 font-bold animate-pulse">LOADING SECURE CLOUD AREA...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-6 relative overflow-hidden">
        <form onSubmit={handleLogin} className="bg-[#111319] border border-zinc-800 rounded-3xl p-10 w-full max-w-md shadow-2xl relative z-10 space-y-8">
          <div className="text-center space-y-2"><div className="w-16 h-16 bg-indigo-950/50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-900/50"><FiLock className="text-2xl" /></div><h1 className="text-2xl font-bold text-white">Admin Portal</h1></div>
          {loginError && <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm p-3 rounded-xl text-center font-medium">{loginError}</div>}
          <div className="space-y-4">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none" placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none" placeholder="Password" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold tracking-wide">Login <FiUnlock /></button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex">
      <aside className="w-64 bg-[#111319] border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="text-xl font-bold tracking-wider"><span>ADWY</span><span className="text-indigo-500">.Admin</span></div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab("hero")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "hero" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiHome /> Manage Hero</button>
            <button onClick={() => setActiveTab("services")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "services" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiBriefcase /> Manage Services</button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "projects" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiVideo /> Manage Projects</button>
            <button onClick={() => setActiveTab("about")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "about" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiUser /> Manage About</button>
            <button onClick={() => setActiveTab("social")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "social" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiLink /> Social Links</button>
            <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === "security" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}><FiShield /> Security Settings</button>
            <button onClick={() => setActiveTab("messages")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between ${activeTab === "messages" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"}`}>
              <div className="flex items-center gap-3"><FiMail /> Messages Inbox</div>
              {messages.length > 0 && <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">{messages.length}</span>}
            </button>
          </nav>
        </div>
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <a href="/" target="_blank" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 transition-colors">View Website</a>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "hero" && (
          <div className="space-y-10">
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={handleSaveHero} className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><FiHome className="text-indigo-500" /> Edit Hero Section</h2>
                <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <textarea rows="3" value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
                <input type="url" value={heroVideoUrl} onChange={(e) => setHeroVideoUrl(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Save Hero Changes</button>
              </form>
              <div className="space-y-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-800/60 pt-6 lg:pt-0 lg:pl-8">
                <h2 className="text-lg font-bold flex items-center gap-2"><FiImage className="text-indigo-500" /> Showreel Thumbnail</h2>
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-1 flex items-center justify-center">{heroThumbnail ? <img src={heroThumbnail} className="w-full h-full object-cover rounded-lg" /> : <span className="text-xs text-zinc-600">No Image</span>}</div>
                <label className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-medium flex items-center justify-center gap-2 text-zinc-400 cursor-pointer"><FiUpload /><input type="file" accept="image/*" onChange={handleHeroThumbUpload} className="hidden" /></label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-8">
            <form onSubmit={handleAddService} className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 space-y-4 max-w-xl">
              <h2 className="text-lg font-bold flex items-center gap-2"><FiBriefcase className="text-indigo-500" /> Add New Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <select value={newServiceIcon} onChange={(e) => setNewServiceIcon(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300">
                  <option value="FiFilm">Film / Video</option> <option value="FiScissors">Scissors / Cutting</option> <option value="FiLayers">Layers / Motion</option>
                </select>
              </div>
              <textarea rows="3" placeholder="Description..." value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium"><FiPlus /> Add Service</button>
            </form>
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm"><tbody className="divide-y divide-zinc-800/65">{services.map((s) => (<tr key={s.id} className="hover:bg-zinc-800/10"><td className="px-6 py-4 font-semibold text-white">{s.title}</td><td className="px-6 py-4 text-zinc-400 truncate max-w-md">{s.desc}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-400 cursor-pointer"><FiTrash2 /></button></td></tr>))}</tbody></table>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-10">
            <div className="space-y-6 bg-[#111319] border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><FiFolder /> Manage Categories</h2>
              <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2 text-sm" /><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm"><FiPlus /></button></form>
            </div>
            <form onSubmit={handleAddProject} className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 xl:grid-cols-5 gap-4 items-end">
              <input type="text" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              <input type="url" placeholder="Video URL" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
              <label className="bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm flex items-center justify-between text-zinc-400 cursor-pointer"><span className="truncate">{newThumbnail ? "Loaded ✓" : "Cover..."}</span><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium"><FiPlus /> Add Project</button>
            </form>
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm"><tbody className="divide-y divide-zinc-800/65">{projects.map((p) => (<tr key={p.id} className="hover:bg-zinc-800/20"><td className="px-6 py-4 flex items-center gap-4"><img src={p.thumbnail} className="w-16 aspect-video object-cover rounded-md" /><span className="font-medium">{p.title}</span></td><td className="px-6 py-4 text-zinc-400">{p.category}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteProject(p.docId)} className="p-2 text-red-400 cursor-pointer"><FiTrash2 /></button></td></tr>))}</tbody></table>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-10">
            {/* الجزء الخاص بتعديل النصوص والصورة */}
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={handleSaveAboutText} className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><FiUser className="text-indigo-500" /> Edit About Information</h2>
                <input type="text" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <textarea rows="4" value={aboutDesc} onChange={(e) => setAboutDesc(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm resize-none" />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Save Text Changes</button>
              </form>
              <div className="space-y-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-800/60 pt-6 lg:pt-0 lg:pl-8">
                <h2 className="text-lg font-bold flex items-center gap-2"><FiImage className="text-indigo-500" /> Profile Image</h2>
                <div className="w-32 aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 mx-auto p-1.5 shadow-xl"><img src={aboutImage || "/avatar.jpg"} className="w-full h-full object-cover rounded-xl" /></div>
                <label className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-medium flex items-center justify-center gap-2 text-zinc-400 cursor-pointer"><FiUpload /><input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" /></label>
              </div>
            </div>

            {/* ⚡ الجزء الجديد اللي كان ناقص: إدارة البرامج والأدوات (Software & Tools) */}
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><FiCpu className="text-purple-500" /> Manage Software & Tools</h2>
              
              <form onSubmit={handleAddTool} className="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="Tool Name (e.g. Premiere Pro)" value={newToolName} onChange={(e) => setNewToolName(e.target.value)} className="flex-1 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <input type="text" placeholder="Short (e.g. Pr)" value={newToolShort} onChange={(e) => setNewToolShort(e.target.value)} className="w-full sm:w-32 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm" />
                <select value={newToolColor} onChange={(e) => setNewToolColor(e.target.value)} className="w-full sm:w-40 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300">
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="sky">Sky Blue</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Pink</option>
                  <option value="red">Red</option>
                  <option value="emerald">Emerald</option>
                </select>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap"><FiPlus className="inline mr-1" /> Add Tool</button>
              </form>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800/60">
                {tools.length === 0 ? <p className="text-sm text-zinc-500">No tools added yet.</p> : tools.map((tool) => (
                  <div key={tool.name} className={`px-4 py-2 rounded-xl border flex items-center gap-3 text-sm ${tool.color}`}>
                    <span className="font-bold">{tool.short}</span>
                    <span>{tool.name}</span>
                    <button onClick={() => handleDeleteTool(tool.name)} className="text-zinc-400 hover:text-red-400 ml-2 cursor-pointer"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-8 max-w-xl">
            <form onSubmit={handleSaveSocials} className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><FiLink className="text-indigo-500" /> Manage Contact Links</h2>
              <div className="flex items-center gap-3 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-1"><FaWhatsapp className="text-emerald-500 text-lg shrink-0" /><input type="text" placeholder="WhatsApp Number" value={whatsappNum} onChange={(e) => setWhatsappNum(e.target.value)} className="w-full bg-transparent border-0 py-2.5 text-sm text-white focus:outline-none" /></div>
              <div className="flex items-center gap-3 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-1"><FiInstagram className="text-pink-500 text-lg shrink-0" /><input type="url" placeholder="Instagram URL" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full bg-transparent border-0 py-2.5 text-sm text-white focus:outline-none" /></div>
              <div className="flex items-center gap-3 bg-[#171923] border border-zinc-800 rounded-xl px-4 py-1"><FiLinkedin className="text-blue-500 text-lg shrink-0" /><input type="url" placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full bg-transparent border-0 py-2.5 text-sm text-white focus:outline-none" /></div>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Save Links</button>
            </form>
            <div className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><FiFileText className="text-indigo-500" /> Dynamic CV Downloader</h2>
              <label className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3.5 text-xs font-medium flex items-center justify-center gap-2 text-zinc-400 cursor-pointer"><FiUpload /> {cvFile ? "CV Loaded" : "Choose CV File"}<input type="file" accept=".pdf,image/*" onChange={handleCvUpload} className="hidden" /></label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 max-w-xl bg-[#111319] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><FiShield className="text-emerald-500" /> Security Settings</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
              <input type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#171923] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" />
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium">Update Password</button>
            </form>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-bold flex items-center gap-3"><FiMail className="text-indigo-500" /> Messages Inbox</h1>
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="bg-[#111319] border border-zinc-800 rounded-2xl p-6 relative group">
                  <button onClick={() => handleDeleteMessage(m.docId)} className="absolute top-6 right-6 text-zinc-600 hover:text-red-400 p-2"><FiTrash2 /></button>
                  <h4 className="font-bold text-white text-lg">{m.name} ({m.email})</h4>
                  <span className="text-xs text-zinc-500">{m.date}</span>
                  <p className="text-zinc-300 text-sm mt-3 bg-[#171923] p-4 rounded-xl">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}