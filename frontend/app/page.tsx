"use client";

import Chatbot from "@/components/chatbot";
import { Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const auraX = useSpring(mouseX, springConfig);
  const auraY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 relative overflow-hidden font-sans">
      {/* GOD Level Mouse Tracking Aura */}
      <motion.div
        style={{
          x: auraX,
          y: auraY,
        }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-200/40 to-indigo-200/40 blur-[120px] rounded-full pointer-events-none z-0"
      />

      {/* Animated Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/30 blur-[100px] rounded-full pointer-events-none animate-pulse" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated Icon with Spring Hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="inline-flex items-center justify-center p-5 mb-10 rounded-3xl bg-white shadow-[0_20px_50px_rgba(37,99,235,0.1)] border border-slate-100 text-blue-600 cursor-default"
        >
          <Sparkles className="h-10 w-10 animate-[spin_8s_linear_infinite]" />
        </motion.div>

        {/* Staggered Text Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-slate-900 leading-[1.1]"
        >
          How can we help <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-blue-600 relative inline-block"
          >
            you today?
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-2 left-0 h-3 bg-blue-100 -z-10"
            />
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-slate-600 mb-16 font-medium leading-relaxed max-w-2xl"
        >
          Welcome to Pratinik Infotech support. Experience the next generation
          of AI-powered assistance with fluid, natural interactions.
        </motion.p>
      </div>

      {/* Floating Chatbot */}
      <Chatbot />
    </main>
  );
}
