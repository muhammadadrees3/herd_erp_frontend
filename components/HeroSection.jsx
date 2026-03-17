"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sun, LayoutGrid, Activity, Zap } from "lucide-react";

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const THEME = {
  bg: "#060C06",
  forest: "#2D5A27",
  emerald: "#34D399",
  gold: "#D4AF37", // More refined metallic gold
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  textMain: "#F8FAFC",
  textMuted: "#94A3B8"
};

// ─── POLISHED HUD CARD ───────────────────────────────────────────────────────
const GlassHUD = ({ title, value, unit, icon: Icon, color, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`absolute backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl shadow-2xl z-20 ${className}`}
    style={{ boxShadow: `0 20px 50px -12px rgba(0,0,0,0.5), inset 0 0 20px ${color}10` }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-white/5">
        <Icon size={14} style={{ color }} />
      </div>
      <span className="text-[10px] font-bold tracking-[0.em] uppercase text-white/40">{title}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
      <span className="text-xs font-medium text-white/40">{unit}</span>
    </div>
    <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ duration: 1.5, delay: delay + 0.5 }}
        className="h-full rounded-full" 
        style={{ background: `linear-gradient(90deg, ${color}40, ${color})` }}
      />
    </div>
  </motion.div>
);

export default function HerdERP() {
  return (
    <main className="relative min-h-screen bg-[#060C06] text-white selection:bg-emerald-500/30 overflow-hidden font-sans">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-900/10 blur-[120px] rounded-full" />
      </div>

      {/* ── NAVIGATION ── */}
      {/* <nav className="relative z-50 flex items-center justify-between px-10 py-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
            <LayoutGrid size={18} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Herd<span className="text-[#D4AF37]">ERP</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">
          {["Home", "Solutions", "Hardware", "Pricing", "Support"].map((item, idx) => (
            <a key={item} href="#" className={`hover:text-white transition-colors ${idx === 0 ? "text-[#D4AF37]" : ""}`}>{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Sun size={18} className="text-white/30 cursor-pointer hover:text-white transition-colors" />
          <button className="text-[11px] font-bold tracking-widest uppercase hover:text-emerald-400 transition-colors">Login</button>
          <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-sm text-[11px] font-black tracking-widest uppercase hover:bg-white transition-all shadow-lg shadow-gold/20">
            Get Started
          </button>
        </div>
      </nav> */}

      {/* ── HERO GRID ── */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-100px)] items-center">
        
        {/* LEFT: CONTENT */}
        <div className="px-10 lg:pl-24 pb-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-[1px] w-12 bg-emerald-500/50" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-400/80">Next-Gen Agricultural Intelligence</span>
            </div>
            
            <h1 className="text-7xl lg:text-[4.5rem] font-black leading-[0.9] tracking-tighter mb-10 italic">
              Every Animal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">Counted.</span><br />
              Every Farm<br />
              <span className="text-[#D4AF37]">Profitable.</span>
            </h1>

            <p className="text-lg lg:text-xl text-white/40 font-medium leading-relaxed max-w-lg mb-12">
              The world’s most advanced livestock ERP. Monitor health, optimize breeding, 
              and track milk yields with military-grade precision.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <button className="group bg-[#2D5A27] hover:bg-emerald-600 text-white px-10 py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all">
                Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border border-white/10 hover:bg-white/5 text-white px-10 py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={12} fill="white" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* STATS OVERLAY */}
            <div className="mt-20 flex gap-12 border-t border-white/5 pt-10">
              <div>
                <p className="text-3xl font-black text-white tracking-tighter">12.4M</p>
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mt-1">Animals Managed</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white tracking-tighter">98%</p>
                <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mt-1">Accuracy Rate</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: THE VISUAL ENGINE */}
        <div className="relative h-full min-h-[600px] lg:min-h-screen">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Main Visual - Using image cow2.jpg from your assets */}
            <img 
              src="/Images/Herd Images/cow2.png" 
              className="w-full h-full object-cover saturate-[0.8] brightness-[0.7] contrast-[1.1]" 
              alt="Farm Visual"
            />
            {/* The Gradient Wash */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060C06] via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060C06] via-transparent to-transparent z-10" />
            
            {/* SCANNING OVERLAY */}
            <div className="absolute inset-0 z-10 opacity-20 pointer-events-none bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:32px_32px]" />
          </motion.div>

          {/* ── HUD ELEMENTS ── */}
          <GlassHUD 
            title="Workforce" 
            value="2,049" 
            unit="Staff Active" 
            icon={Activity} 
            color="#34D399" 
            delay={1}
            className="top-[15%] left-[10%]" 
          />
          
          <GlassHUD 
            title="Yield Analytics" 
            value="8.430" 
            unit="Ltrs / Day" 
            icon={Zap} 
            color="#D4AF37" 
            delay={1.2}
            className="bottom-[20%] right-[15%]" 
          />

          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/20 rounded-full z-10 pointer-events-none"
          />
        </div>
      </div>
    </main>
  );
}
// "use client";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { ArrowRight, Play } from "lucide-react";

// // ─── Brand Tokens (Updated to match UI Screenshot) ──────────────────────────
// const B = {
//   wheatGold: "#C49A2A",
//   cream: "#F5F0E8",
//   offWhite: "#DDD7CA",
//   darkBg: "#0B120B", // Deep forest black
//   glassBg: "rgba(15, 25, 15, 0.6)",
//   glassBorder: "rgba(255, 255, 255, 0.1)",
//   accentGreen: "#4B6B3F", // The "Start Trial" button green
// };

// // ─── Refined HUD Components ──────────────────────────────────────────────────
// const DashboardOverlay = () => (
//   <motion.div 
//     initial={{ opacity: 0, x: 20 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 1, delay: 0.5 }}
//     className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col gap-4"
//   >
//     {/* This mimics the floating glass panels in your screenshot */}
//     <div className="flex justify-between items-start">
//       <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-64">
//         <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Workforce Management</p>
//         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
//           <div className="h-full bg-green-500 w-[65%]" />
//         </div>
//         <p className="text-xl font-bold text-white mt-2">2,049 <span className="text-xs font-normal opacity-60">Active</span></p>
//       </div>
      
//       <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-48">
//         <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Feed Management</p>
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full border-2 border-green-500/50 flex items-center justify-center text-[10px] text-green-400">92%</div>
//           <p className="text-lg font-bold text-white">4,785 <span className="text-[10px] block opacity-50">kg/day</span></p>
//         </div>
//       </div>
//     </div>

//     <div className="mt-auto ml-auto bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72">
//       <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Milk Yield Analytics</p>
//       <div className="flex items-end gap-1 h-12">
//         {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
//           <div key={i} className="flex-1 bg-green-500/40 rounded-t-sm" style={{ height: `${h}%` }} />
//         ))}
//       </div>
//       <p className="text-2xl font-bold text-white mt-2">8.430 <span className="text-xs opacity-50">Ltrs</span></p>
//     </div>
//   </motion.div>
// );

// export default function Hero() {
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B120B]">
//       {/* Background Section (The Field Image) */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#0B120B] via-[#0B120B]/80 to-transparent z-10" />
//         <img 
//           src="/Images/Herd Images/farm-field.jpg" 
//           alt="Background" 
//           className="w-full h-full object-cover opacity-40 scale-105"
//         />
//       </div>

//       <div className="container mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-12 relative z-20 items-center">
        
//         {/* LEFT COLUMN: Content */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           {/* <div className="flex items-center gap-3 mb-6">
//             <span className="text-white text-2xl font-bold tracking-tighter">Herd<span className="text-[#C49A2A]">ERP</span></span>
//             <div className="h-[1px] w-12 bg-white/20" />
//           </div> */}

//           <h1 className="text-6xl lg:text-8xl font-bold text-white leading-[1.1] mb-6">
//             Every Animal Counted.<br />
//             <span className="text-white/90">Every Farm Profitable.</span>
//           </h1>

//           <p className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
//             Monitor herd health, optimise breeding programmes, track daily milk yields 
//             and run your entire farm operation from one connected dashboard.
//           </p>

//           <div className="flex flex-wrap gap-5">
//             <button className="bg-[#4B6B3F] hover:bg-[#5a804b] text-white px-8 py-4 rounded-md font-bold flex items-center gap-3 transition-all">
//               START FREE 30-DAY TRIAL <ArrowRight size={18} />
//             </button>
//             <button className="bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-md font-bold flex items-center gap-3 transition-all">
//               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
//                 <Play size={10} fill="currentColor" />
//               </div>
//               WATCH A DEMO
//             </button>
//           </div>
//         </motion.div>

//         {/* RIGHT COLUMN: The Interactive Dashboard Visual */}
//         <motion.div 
//           className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] lg:aspect-square"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1 }}
//         >
//           {/* Main Herd Image */}
//           <img 
//             src="/Images/Herd Images/cow2.png" 
//             alt="Cow Monitoring" 
//             className="w-full h-full object-cover saturate-50"
//           />
          
//           {/* UI HUD Overlay */}
//           <DashboardOverlay />

//           {/* Scanning Line Effect */}
//           <motion.div 
//             className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-[10%] w-full z-30 pointer-events-none"
//             animate={{ top: ["-10%", "100%"] }}
//             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//           />
//         </motion.div>

//       </div>
//     </section>
//   );
// }
// // "use client";
// // import { motion, useScroll, useTransform } from "framer-motion";
// // import { useEffect, useState } from "react";
// // import { ArrowRight, Play } from "lucide-react";
// // import { useTheme } from "@/context/ThemeContext";

// // // ─── Brand Tokens ─────────────────────────────────────────────────────────────
// // const B = {
// //   forestGreen: "#2E6B2E",
// //   lightGreen: "#3A8C3A",
// //   deepGreen: "#1D4A1D",
// //   wheatGold: "#C49A2A",
// //   burntOrange: "#C4601A",
// //   cream: "#F5F0E8",
// //   offWhite: "#DDD7CA",
// //   muted: "#7A8870",
// //   darkBg: "#0B120B",
// // };

// // const serif = "var(--font-display)";
// // const sans = "var(--font-body)";
// // const mono = "var(--font-mono)";

// // // ─── Wheat SVG ────────────────────────────────────────────────────────────────
// // const WheatSVG = ({ color = B.wheatGold, size = 16 }) => (
// //   <svg width={size} height={Math.round(size * 1.35)} viewBox="0 0 16 22" fill="none" aria-hidden>
// //     <path
// //       d="M8 21V2M5 5l3-3 3 3M4 8.5l4-3 4 3M4 12.5l4-3 4 3M5 16.5l3-3 3 3M5 20l3-2.5 3 2.5"
// //       stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
// //     />
// //   </svg>
// // );

// // // ─── HUD Cards ────────────────────────────────────────────────────────────────
// // const HUDCard = ({ title, value, unit, trend, top, left, delay, color }) => (
// //   <motion.div
// //     initial={{ opacity: 0, scale: 0.8, y: 20 }}
// //     animate={{ opacity: 1, scale: 1, y: 0 }}
// //     transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
// //     className="absolute z-20"
// //     style={{ top: `${top}%`, left: `${left}%` }}
// //   >
// //     <div
// //       className="p-3 rounded-lg border backdrop-blur-md shadow-2xl flex flex-col gap-1 min-w-[140px]"
// //       style={{
// //         background: "rgba(10, 20, 10, 0.45)",
// //         borderColor: `${color}40`,
// //         boxShadow: `0 0 20px -5px ${color}30`,
// //       }}
// //     >
// //       <div className="flex items-center justify-between gap-4">
// //         <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: B.offWhite, fontFamily: mono }}>{title}</span>
// //         <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
// //       </div>
// //       <div className="flex items-baseline gap-1 mt-1">
// //         <span className="text-xl font-bold" style={{ color: B.cream, fontFamily: serif }}>{value}</span>
// //         <span className="text-[10px] opacity-70" style={{ color: B.cream }}>{unit}</span>
// //       </div>
// //       <div className="flex items-center gap-2 mt-1">
// //         <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
// //           <motion.div
// //             className="h-full"
// //             style={{ background: color }}
// //             initial={{ width: 0 }}
// //             animate={{ width: "70%" }}
// //             transition={{ duration: 1.5, delay: delay + 0.5 }}
// //           />
// //         </div>
// //         <span className="text-[8px] font-bold" style={{ color: color }}>{trend}</span>
// //       </div>
// //     </div>
// //   </motion.div>
// // );

// // // ─── Hero Component ───────────────────────────────────────────────────────────
// // export default function Hero() {
// //   const [mounted, setMounted] = useState(false);
// //   const { isDark } = useTheme();

// //   useEffect(() => setMounted(true), []);
// //   if (!mounted) return <div className="min-h-screen" style={{ background: B.darkBg }} />;

// //   return (
// //     <section
// //       id="hero"
// //       className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
// //       style={{ background: B.darkBg }}
// //     >
// //       {/* Cinematic Overlays */}
// //       <div className="absolute inset-0 z-0 overflow-hidden">
// //         <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0B120B] to-[#050805]" />

// //         {/* Grid lines */}
// //         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
// //           backgroundImage: `radial-gradient(${B.forestGreen} 1px, transparent 1px)`,
// //           backgroundSize: "40px 40px"
// //         }} />

// //         {/* Ambient Glows */}
// //         <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[140%] rotate-12 opacity-20 pointer-events-none" style={{
// //           background: `linear-gradient(90deg, transparent, ${B.forestGreen} 50%, transparent)`,
// //           filter: "blur(120px)"
// //         }} />

// //         {/* Film grain */}
// //         <div className="absolute inset-0 pointer-events-none" style={{
// //           backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
// //           backgroundRepeat: "repeat", backgroundSize: "180px", mixBlendMode: "overlay",
// //         }} />
// //       </div>

// //       <div className=" mx-auto w-full px-8 lg:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10 pt-28 pb-20">

// //         {/* ── LEFT COLUMN: BRANDING & COPY ── */}
// //         <motion.div
// //           initial={{ opacity: 0, x: -40 }}
// //           animate={{ opacity: 1, x: 0 }}
// //           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
// //           className="flex flex-col"
// //         >
// //           <div className="flex items-center gap-4 mb-8">
// //             <WheatSVG size={28} />
// //             <div className="h-px w-16 bg-white/10" />
// //             <span className="text-[11px] uppercase tracking-[0.45em] text-white/40 font-bold" style={{ fontFamily: mono }}>Agricultural ERP Platform</span>
// //           </div>

// //           <h1 className="text-7xl lg:text-[7.5rem] font-black leading-[0.85] mb-6" style={{ fontFamily: serif }}>
// //             <span style={{ color: B.cream }}>Herd</span>
// //             <span style={{ color: B.wheatGold }}>ERP</span>
// //           </h1>

// //           <div className="space-y-2 mb-10">
// //             <h2 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: serif, color: B.wheatGold }}>Every Animal Counted.</h2>
// //             <h2 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: serif, color: B.wheatGold }}>Every Farm Profitable.</h2>
// //           </div>

// //           <p className="text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-14" style={{ color: B.offWhite, fontFamily: sans }}>
// //             Monitor herd health, optimise breeding programmes, track daily milk yields
// //             and run your entire farm operation from one connected dashboard.
// //           </p>

// //           <div className="flex flex-wrap gap-6">
// //             <button
// //               className="px-10 py-5 bg-[#4B6B3F] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-[4px] flex items-center gap-4 transition-all hover:bg-[#5C824D] hover:scale-[1.02] shadow-2xl shadow-green-950/40"
// //               style={{ fontFamily: serif }}
// //             >
// //               Start Free 30-Day Trial
// //               <ArrowRight size={18} />
// //             </button>
// //             <button
// //               className="px-10 py-5 border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-[4px] flex items-center gap-4 transition-all hover:bg-white/5"
// //               style={{ fontFamily: serif }}
// //             >
// //               <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
// //                 <Play size={12} fill="white" className="ml-1" />
// //               </div>
// //               Watch a Demo
// //             </button>
// //           </div>
// //         </motion.div>

// //         {/* ── RIGHT COLUMN: AR HUD VISUALIZATION ── */}
// //         <motion.div
// //           initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
// //           animate={{ opacity: 1, scale: 1, rotateY: 0 }}
// //           transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
// //           className="relative aspect-square lg:aspect-auto h-[620px] group perspective-1000"
// //         >
// //           {/* Main Background Image */}
// //           <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:border-white/20">
// //             <img
// //               src="/Images/Herd Images/cow2.jpg"
// //               alt="Dairy Farm Automation"
// //               className="w-full h-full object-cover saturate-[0.82] brightness-[0.75] transition-all duration-1000 group-hover:scale-105"
// //             />
// //             {/* Overlay Grid/Vignette */}
// //             <div className="absolute inset-0 bg-gradient-to-t from-[#0B120B] via-transparent to-transparent opacity-75" />
// //             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,18,11,0.5)_100%)]" />
// //           </div>

// //           {/* AR / HUD Overlay Cards */}
// //           <HUDCard
// //             title="Workforce Management"
// //             value="24"
// //             unit="Staff Active"
// //             trend="+2.4%"
// //             color={B.forestGreen}
// //             top={12}
// //             left={-10}
// //             delay={0.5}
// //           />
// //           <HUDCard
// //             title="Feed Level"
// //             value="4,785"
// //             unit="kg / day"
// //             trend="Stable"
// //             color={B.wheatGold}
// //             top={8}
// //             left={40}
// //             delay={0.7}
// //           />
// //           <HUDCard
// //             title="Yield Analytics"
// //             value="8.335"
// //             unit="Litres"
// //             trend="+12%"
// //             color={B.forestGreen}
// //             top={32}
// //             left={46}
// //             delay={0.9}
// //           />
// //           <HUDCard
// //             title="Farm Financials"
// //             value="98"
// //             unit="KPI %"
// //             trend="Ideal"
// //             color={B.burntOrange}
// //             top={68}
// //             left={76}
// //             delay={1.1}
// //           />

// //           {/* Floating UI Elements / Scanning Lines */}
// //           <motion.div
// //             className="absolute z-10 w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
// //             animate={{ top: ["15%", "85%", "15%"] }}
// //             transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
// //           />

// //           {/* Scanning Pulsars */}
// //           <div className="absolute top-[48%] left-[32%] z-20">
// //             <motion.div
// //               className="w-4 h-4 rounded-full bg-green-500/30 relative"
// //               animate={{ scale: [1, 1.8, 1] }}
// //               transition={{ duration: 2.4, repeat: Infinity }}
// //             >
// //               <div className="absolute inset-0 rounded-full bg-green-400/60 animate-ping" />
// //               <div className="absolute inset-[3px] rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
// //             </motion.div>
// //           </div>
// //         </motion.div>

// //       </div>

// //       {/* ── FOOTER FADE ── */}
// //       <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B120B] to-transparent z-[5]" />
// //     </section>
// //   );
// // }
