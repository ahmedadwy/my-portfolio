import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PortfolioGrid from "../components/PortfolioGrid";
import Services from "../components/Services";
import About from "../components/About";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0f12] text-white relative overflow-hidden">
      <div className="ambient-glow top-[-10%] left-[-10%]" />
      <div className="ambient-glow top-[40%] right-[-10%]" />
      <div className="ambient-glow bottom-[-5%] left-[20%]" />
      
      <Navbar />
      <Hero />
      <PortfolioGrid />
      <Services />
      <About />
      <ContactForm />
    </main>
  );
}