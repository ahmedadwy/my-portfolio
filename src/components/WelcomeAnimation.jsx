"use client";
import { motion } from 'framer-motion';

export default function WelcomeAnimation({ onComplete }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }} // الأنيميشن هيقعد 2.5 ثانية وبعدين يختفي
      onAnimationComplete={onComplete} // لما الأنيميشن يخلص، الموقع يظهر
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060814]"
    >
      <motion.h1 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-white text-4xl font-bold tracking-[0.2em] uppercase"
      >
        WELCOME
      </motion.h1>
    </motion.div>
  );
}