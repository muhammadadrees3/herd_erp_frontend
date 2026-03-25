"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Play, Activity, TrendingUp, Droplets, Target,
  Shield, Dna, HeartPulse, BarChart3, ChevronRight, Star,
  Check, Menu, X, Zap, Globe, Clock, Users, Leaf
} from "lucide-react";

// ─── Utility: Animated Counter ──────────────────────────────────────────────

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Section Reveal Wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Modules", "Testimonials", "Pricing"];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#060D06]/80 backdrop-blur-2xl border-b border-white/[0.06]" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4B6B3F] to-[#C49A2A] rounded-lg rotate-6 opacity-60" />
            <div className="relative w-full h-full bg-[#0B120B] border border-[#4B6B3F]/60 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-[#C49A2A]" />
            </div>
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Herd<span className="text-[#C49A2A]">ERP</span>
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="text-sm text-white/50 hover:text-white transition-colors font-medium tracking-wide">
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Sign In</a>
          <a href="#" className="group relative text-sm font-bold text-[#0B120B] bg-[#C49A2A] px-5 py-2.5 rounded-xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(196,154,42,0.4)]">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </a>
        </div>

        {/* Mobile Menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/70 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#0B120B]/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="text-white/70 font-medium">
              {l}
            </a>
          ))}
          <a href="#" className="text-sm font-bold text-[#0B120B] bg-[#C49A2A] px-5 py-3 rounded-xl text-center">
            Get Started Free
          </a>
        </div>
      )}
    </motion.nav>
  );
}

// ─── Hero Dashboard Overlay ───────────────────────────────────────────────────
function DashboardOverlay() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-5 flex flex-col justify-between">
      {/* Corner brackets */}
      {[["top-3 left-3","border-t-2 border-l-2 rounded-tl-xl"],["top-3 right-3","border-t-2 border-r-2 rounded-tr-xl"],["bottom-3 left-3","border-b-2 border-l-2 rounded-bl-xl"],["bottom-3 right-3","border-b-2 border-r-2 rounded-br-xl"]].map(([pos, cls], i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6 ${cls} border-[#C49A2A]/40`} />
      ))}

      {/* Top row */}
      <div className="flex justify-between items-start gap-3">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.6 }}
          className="bg-[#060D06]/70 backdrop-blur-xl p-4 rounded-2xl border border-white/10 w-[55%]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Target size={11} className="text-[#C49A2A]" />
              <p className="text-[9px] text-white/70 uppercase tracking-widest font-semibold">Active Herd</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </div>
          <div className="flex items-end gap-1.5 mb-2">
            <p className="text-2xl font-black text-white tracking-tighter">2,049</p>
            <p className="text-[10px] text-green-400 font-semibold flex items-center mb-0.5"><TrendingUp size={9} className="mr-0.5" />+12%</p>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5, delay: 1 }}
              className="h-full bg-gradient-to-r from-[#4B6B3F] to-green-400 rounded-full" />
          </div>
        </motion.div>

        <motion.div animate={{ y: ["-4%", "4%"] }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="bg-[#060D06]/70 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 w-[40%]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Activity className="text-[#C49A2A] w-3 h-3" />
            <p className="text-[9px] text-white/60 uppercase tracking-widest">Feed Eff.</p>
          </div>
          <p className="text-xl font-black text-white mb-1.5">92<span className="text-[10px] text-[#C49A2A]">%</span></p>
          <svg className="w-full h-5 stroke-[#C49A2A] stroke-2 fill-none" viewBox="0 0 100 20">
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1 }}
              d="M0,20 C20,15 30,20 40,10 C50,0 70,15 80,5 L100,8" />
          </svg>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9 }}
        className="bg-[#060D06]/70 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Droplets size={11} className="text-blue-400" />
              <p className="text-[9px] text-white/60 uppercase tracking-widest font-semibold">Milk Yield Avg</p>
            </div>
            <p className="text-2xl font-black text-white tracking-tighter">8,430 <span className="text-xs font-normal text-white/40">L/day</span></p>
          </div>
          <span className="text-[10px] font-bold text-[#C49A2A] bg-[#C49A2A]/10 border border-[#C49A2A]/20 px-2.5 py-1 rounded-full">Optimal</span>
        </div>
        <div className="flex items-end justify-between gap-1 h-14">
          {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
            <div key={i} className="flex-1 relative">
              <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1.2, delay: 0.9 + i * 0.1, type: "spring" }}
                className={`absolute bottom-0 w-full rounded-t-sm ${i === 6 ? "bg-gradient-to-t from-[#C49A2A] to-[#f2cf72]" : "bg-gradient-to-t from-[#4B6B3F] to-green-400/70"}`} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-[#060D06] pt-24 pb-20 lg:pt-0">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-32 w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C49A2A]/8 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#060D06)]" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #C49A2A 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 xl:gap-20 relative z-20 items-center w-full">

        {/* LEFT */}
        <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#C49A2A]/8 border border-[#C49A2A]/20 mb-8 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C49A2A] shadow-[0_0_8px_rgba(196,154,42,1)] animate-pulse" />
            <span className="text-[11px] font-bold text-[#C49A2A] uppercase tracking-[0.15em]">HerdERP Platform v2.0</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.01em" }}>
            Every Animal<br />Counted.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d06b] via-[#C49A2A] to-[#8a6a16]">
              Every Farm&nbsp;Profitable.
            </span>
          </h1>

          <p className="text-lg text-white/55 mb-10 leading-relaxed max-w-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Monitor herd health, optimise breeding programmes, and track daily milk yields — all from one beautifully connected, intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group relative bg-[#C49A2A] text-[#060D06] px-7 py-4 rounded-xl font-black flex items-center justify-center gap-2.5 overflow-hidden shadow-[0_0_30px_rgba(196,154,42,0.25)] hover:shadow-[0_0_40px_rgba(196,154,42,0.45)] hover:-translate-y-0.5 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border border-white/15 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06] text-white px-7 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Play size={12} fill="white" className="ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/[0.06]">
            {[["2,000+", "Farms Active"], ["98%", "Uptime SLA"], ["50M+", "Animals Tracked"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-xl font-black text-white">{n}</p>
                <p className="text-xs text-white/40 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Dashboard Card */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, delay: 0.35, type: "spring", stiffness: 60 }}
          className="relative rounded-[2rem] overflow-hidden border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.9)] aspect-[4/3] lg:aspect-square bg-[#040804] group ring-1 ring-white/5">
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] z-10 pointer-events-none" />
          <img src="/Images/Herd Images/cow2.png" alt="Cow Monitoring"
            className="w-full h-full object-cover opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-1000 ease-out saturate-50 contrast-110" />
          <DashboardOverlay />
          {/* Scan line */}
          <motion.div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-green-500/8 to-green-400/20 border-b border-green-400/40 z-30 pointer-events-none"
            animate={{ top: ["-30%", "130%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C49A2A]/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C49A2A]/50" />
      </motion.div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: <Users size={18} />, value: 2000, suffix: "+", label: "Farms Worldwide" },
    { icon: <Globe size={18} />, value: 47, suffix: "", label: "Countries Served" },
    { icon: <Zap size={18} />, value: 50, suffix: "M+", label: "Animals Monitored" },
    { icon: <Clock size={18} />, value: 98, suffix: "%", label: "Platform Uptime" },
  ];
  return (
    <section className="relative bg-[#060D06] border-y border-white/[0.06] py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C49A2A]/3 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ icon, value, suffix, label }, i) => (
          <Reveal key={label} delay={i * 0.1} className="flex flex-col items-center text-center gap-2">
            <div className="text-[#C49A2A] mb-1">{icon}</div>
            <p className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <Counter to={value} suffix={suffix} />
            </p>
            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Target size={22} />,
      title: "Smart Animal Tagging",
      desc: "Auto-generate unique Animal Tag IDs based on species and breed — zero duplication, 100% traceability across all modules.",
      highlight: "Dynamic ID System",
    },
    {
      icon: <HeartPulse size={22} />,
      title: "Health & Vaccination Logs",
      desc: "Precise medical history tracking with status indicators: Administered, Overdue, or Partially Completed — never miss a vaccination window.",
      highlight: "Real-time Alerts",
    },
    {
      icon: <Dna size={22} />,
      title: "Breeding & Pregnancy AI",
      desc: "Advanced reproduction monitoring with automated milestone tracking, auto-calculated due dates, and fetal sexing support.",
      highlight: "Auto-calculated Dates",
    },
    {
      icon: <Droplets size={22} />,
      title: "Milk Yield Analytics",
      desc: "Daily yield tracking with beautiful charts, trend analysis, and per-animal performance benchmarking to maximise dairy profitability.",
      highlight: "Daily Benchmarking",
    },
    {
      icon: <Shield size={22} />,
      title: "Shed & Field Management",
      desc: "Complete lifecycle management of farm buildings, sheds, and pasture locations — know exactly where every animal is at all times.",
      highlight: "Full Location Tracking",
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Profitability Dashboard",
      desc: "One beautifully unified dashboard surfaces feed costs, yield margins, and herd KPIs — turning raw data into actionable profit intelligence.",
      highlight: "Unified Intelligence",
    },
  ];

  return (
    <section id="features" className="relative bg-[#060D06] py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4B6B3F]/10 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-[#C49A2A] uppercase tracking-[0.2em] bg-[#C49A2A]/10 border border-[#C49A2A]/20 px-4 py-1.5 rounded-full mb-4">
            Core Features
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Built for the Modern Farm
          </h2>
          <p className="text-lg text-white/45 max-w-xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Every feature engineered for precision livestock management — from pasture to profit report.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, desc, highlight }, i) => (
            <Reveal key={title} delay={i * 0.07}
              className="group relative bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.07] hover:border-[#C49A2A]/20 rounded-2xl p-7 transition-all duration-300 overflow-hidden">
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#C49A2A]/5 to-transparent transition-opacity duration-500 rounded-2xl" />
              <div className="w-11 h-11 rounded-xl bg-[#C49A2A]/10 border border-[#C49A2A]/20 flex items-center justify-center text-[#C49A2A] mb-5 group-hover:bg-[#C49A2A]/15 transition-colors">
                {icon}
              </div>
              <span className="inline-block text-[9px] font-black uppercase tracking-widest text-[#4B6B3F] bg-[#4B6B3F]/15 border border-[#4B6B3F]/30 px-2.5 py-1 rounded-full mb-3">
                {highlight}
              </span>
              <h3 className="text-lg font-black text-white mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C49A2A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Modules Showcase ─────────────────────────────────────────────────────────
function Modules() {
  const modules = [
    {
      num: "01",
      title: "Livestock Management",
      items: ["Dynamic Animal Tag ID generation", "Breed & species hierarchy", "Shed & field assignment", "Movement & transfer logs"],
    },
    {
      num: "02",
      title: "Health & Welfare",
      items: ["Full vaccination scheduling", "Vet consultation records", "Status: Administered / Overdue", "Medical history timelines"],
    },
    {
      num: "03",
      title: "Reproduction Suite",
      items: ["Breeding attempt tracking", "Pregnancy milestone alerts", "Auto-calculated due dates", "Dry-off period management"],
    },
  ];

  return (
    <section id="modules" className="relative bg-[#040804] py-28 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#C49A2A]/5 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <Reveal>
              <span className="inline-block text-[11px] font-bold text-[#C49A2A] uppercase tracking-[0.2em] bg-[#C49A2A]/10 border border-[#C49A2A]/20 px-4 py-1.5 rounded-full mb-5">
                Core Modules
              </span>
              <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Three Pillars.<br />One Platform.
              </h2>
              <p className="text-lg text-white/45 leading-relaxed mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                HerdERP is architected around the three core operations that define profitable livestock farming — seamlessly integrated so your data always stays in sync.
              </p>
            </Reveal>

            <div className="space-y-4">
              {modules.map(({ num, title, items }, i) => (
                <Reveal key={num} delay={i * 0.12}>
                  <details className="group bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-[#C49A2A]/30" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{num}</span>
                        <h3 className="font-black text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                      </div>
                      <ChevronRight size={16} className="text-white/30 group-open:rotate-90 transition-transform duration-300 shrink-0" />
                    </summary>
                    <div className="px-6 pb-5 border-t border-white/[0.05]">
                      <ul className="mt-4 space-y-2.5">
                        {items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-white/55" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <Check size={13} className="text-[#4B6B3F] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: Visual Card Stack */}
          <Reveal delay={0.3} className="relative h-96 lg:h-[520px]">
            {/* Card 3 (back) */}
            <div className="absolute top-0 right-0 w-[85%] h-64 bg-[#0B120B] border border-white/[0.06] rounded-3xl rotate-6 opacity-40" />
            {/* Card 2 */}
            <div className="absolute top-6 right-4 w-[88%] h-64 bg-[#0D160D] border border-white/[0.08] rounded-3xl rotate-2 opacity-70" />
            {/* Card 1 (front) */}
            <div className="absolute top-10 right-0 w-[90%] bg-gradient-to-br from-[#111D11] to-[#0B120B] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-xs text-white/50 font-medium uppercase tracking-widest">Live Dashboard</span>
              </div>

              {/* Herd Health Overview */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[["Healthy", "1,847", "text-green-400"], ["Treatment", "124", "text-amber-400"], ["Critical", "78", "text-red-400"]].map(([label, val, color]) => (
                  <div key={label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                    <p className={`text-xl font-black ${color}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{val}</p>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-white/50 uppercase tracking-widest">Weekly Yield</p>
                  <span className="text-xs font-bold text-[#C49A2A]">↑ 8.4% this week</span>
                </div>
                <div className="flex items-end gap-1.5 h-16">
                  {[55, 70, 48, 85, 72, 91, 100].map((h, i) => (
                    <motion.div key={i} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.07, type: "spring" }}
                      style={{ height: `${h}%`, originY: 1 }}
                      className={`flex-1 rounded-t-sm ${i === 6 ? "bg-gradient-to-t from-[#C49A2A] to-[#f2cf72]" : "bg-[#4B6B3F]/70"}`} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="flex-1 text-center text-[9px] text-white/25">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      name: "James Holloway",
      role: "Dairy Farm Owner, Yorkshire",
      avatar: "JH",
      text: "HerdERP transformed how we manage our 800-cow dairy operation. The pregnancy tracking module alone saved us countless hours — due dates are auto-calculated, alerts are sent automatically.",
      rating: 5,
    },
    {
      name: "Fatima Al-Rashid",
      role: "Livestock Manager, Abu Dhabi",
      avatar: "FA",
      text: "The dynamic tagging system is flawless. No duplicate IDs, no manual entry errors. Every animal from camel to cattle is uniquely identified and tracked in real time.",
      rating: 5,
    },
    {
      name: "David Nkosi",
      role: "Agribusiness Director, Pretoria",
      avatar: "DN",
      text: "The profitability dashboard is a game-changer. I can see feed costs versus milk revenue at a glance. Our margins improved by 23% in the first quarter after adopting HerdERP.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="relative bg-[#060D06] py-28 overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C49A2A]/4 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-[#C49A2A] uppercase tracking-[0.2em] bg-[#C49A2A]/10 border border-[#C49A2A]/20 px-4 py-1.5 rounded-full mb-4">
            Trusted Globally
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Farmers Love It.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map(({ name, role, avatar, text, rating }, i) => (
            <Reveal key={name} delay={i * 0.1}
              className="group bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.07] hover:border-[#C49A2A]/15 rounded-2xl p-7 transition-all duration-300">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-[#C49A2A] fill-[#C49A2A]" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-7" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                "{text}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B6B3F] to-[#C49A2A] flex items-center justify-center text-[11px] font-black text-[#060D06]">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{name}</p>
                  <p className="text-xs text-white/35">{role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "49",
      desc: "Perfect for small family farms getting started.",
      features: ["Up to 200 animals", "Livestock tagging", "Basic health records", "Email support", "1 farm location"],
      cta: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Professional",
      price: "149",
      desc: "The full power of HerdERP for growing operations.",
      features: ["Up to 2,000 animals", "All Starter features", "Breeding & pregnancy AI", "Milk yield analytics", "5 farm locations", "Priority support"],
      cta: "Get Professional",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Tailored solutions for large agribusiness groups.",
      features: ["Unlimited animals", "All Pro features", "Custom integrations", "Dedicated account manager", "On-premise option", "SLA guarantee"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative bg-[#040804] py-28 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#4B6B3F]/8 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold text-[#C49A2A] uppercase tracking-[0.2em] bg-[#C49A2A]/10 border border-[#C49A2A]/20 px-4 py-1.5 rounded-full mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Simple. Scalable. Fair.
          </h2>
          <p className="text-lg text-white/40" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No hidden fees. Cancel anytime. 14-day free trial on all plans.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(({ name, price, desc, features, cta, highlight }, i) => (
            <Reveal key={name} delay={i * 0.1}>
              <div className={`relative rounded-2xl p-8 h-full flex flex-col border transition-all duration-300 ${
                highlight
                  ? "bg-gradient-to-b from-[#C49A2A]/12 to-[#4B6B3F]/8 border-[#C49A2A]/30 shadow-[0_0_50px_rgba(196,154,42,0.12)]"
                  : "bg-white/[0.025] border-white/[0.07] hover:border-white/15"
              }`}>
                {highlight && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C49A2A] rounded-b-xl">
                    <span className="text-[10px] font-black text-[#060D06] uppercase tracking-widest">Most Popular</span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {name}
                  </h3>
                  <div className="flex items-end gap-1.5 mb-2">
                    {price !== "Custom" && <span className="text-lg text-white/40 mb-1">$</span>}
                    <p className="text-5xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{price}</p>
                    {price !== "Custom" && <span className="text-white/40 mb-1">/mo</span>}
                  </div>
                  <p className="text-sm text-white/40" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-[#C49A2A]/20" : "bg-white/5"}`}>
                        <Check size={10} className={highlight ? "text-[#C49A2A]" : "text-white/40"} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${
                  highlight
                    ? "bg-[#C49A2A] text-[#060D06] shadow-[0_0_25px_rgba(196,154,42,0.3)] hover:shadow-[0_0_35px_rgba(196,154,42,0.5)]"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                }`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative bg-[#060D06] py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4B6B3F]/10 via-transparent to-[#C49A2A]/8" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #C49A2A 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">14-Day Free Trial • No Card Required</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Your Farm.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d06b] to-[#C49A2A]">
              Fully Optimised.
            </span>
          </h2>
          <p className="text-xl text-white/45 mb-10 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Join thousands of farmers already using HerdERP to cut costs, boost yields, and gain complete visibility over their operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="group relative bg-[#C49A2A] text-[#060D06] px-8 py-4 rounded-xl font-black flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(196,154,42,0.3)] hover:shadow-[0_0_60px_rgba(196,154,42,0.5)] hover:-translate-y-0.5 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative z-10">Start Your Free Trial</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/15 hover:border-white/30 bg-transparent hover:bg-white/5 text-white/70 hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Schedule a Demo
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#040804] border-t border-white/[0.05] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#C49A2A]/10 border border-[#C49A2A]/30 rounded-lg flex items-center justify-center">
                <Leaf size={15} className="text-[#C49A2A]" />
              </div>
              <span className="text-white font-black text-lg">Herd<span className="text-[#C49A2A]">ERP</span></span>
            </div>
            <p className="text-sm text-white/35 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Agricultural intelligence for the modern livestock operation.
            </p>
          </div>

          {/* Links */}
          {[
            { label: "Product", links: ["Features", "Modules", "Pricing", "Changelog", "Roadmap"] },
            { label: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
            { label: "Support", links: ["Documentation", "API Reference", "Status", "Security", "Privacy"] },
          ].map(({ label, links }) => (
            <div key={label}>
              <h4 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {label}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            © 2026 HerdERP. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span>Built with</span>
            <span className="text-[#C49A2A]">♥</span>
            <span>for farmers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Google Fonts Loader ───────────────────────────────────────────────────────
function FontLoader() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes shimmer { 100% { transform: translateX(200%); } }
      details summary::-webkit-details-marker { display: none; }
    ` }} />
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <FontLoader />
      <main className="bg-[#060D06] text-white antialiased selection:bg-[#C49A2A]/30">
        {/* <Navbar /> */}
        <Hero />
        <StatsBar />
        <Features />
        <Modules />
        <Testimonials />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
// "use client";

// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { ArrowRight, Play, Activity } from "lucide-react";

// // ─── Refined HUD Components ──────────────────────────────────────────────────
// const DashboardOverlay = () => {
//   // Animation variants for floating effect
//   const floatingAnimation = {
//     y: ["-4%", "4%"],
//     transition: {
//       duration: 3,
//       repeat: Infinity,
//       repeatType: "reverse",
//       ease: "easeInOut",
//     },
//   };

//   return (
//     <div className="absolute inset-0 z-20 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
//       {/* Top Row */}
//       <div className="flex justify-between items-start gap-4">
//         {/* Card 1: Active Workforce */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//           className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl w-[55%] sm:w-64 relative overflow-hidden"
//         >
//           {/* Subtle gradient glow inside card */}
//           <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 blur-2xl rounded-full" />
          
//           <div className="flex items-center justify-between mb-3">
//             <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-semibold">
//               Active Herd
//             </p>
//             <span className="flex h-2 w-2 relative">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//             </span>
//           </div>
          
//           <div className="flex items-baseline gap-2 mb-2">
//             <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">2,049</p>
//             <p className="text-xs text-green-400 font-medium">+12 this week</p>
//           </div>
          
//           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
//             <motion.div 
//               initial={{ width: 0 }}
//               animate={{ width: "85%" }}
//               transition={{ duration: 1.5, delay: 1 }}
//               className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full" 
//             />
//           </div>
//         </motion.div>

//         {/* Card 2: Feed Management */}
//         <motion.div
//           animate={floatingAnimation}
//           className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl w-[40%] sm:w-48 flex flex-col items-center text-center"
//         >
//           <Activity className="text-[#C49A2A] w-5 h-5 mb-2" />
//           <p className="text-[10px] text-white/70 uppercase tracking-wider mb-1">Feed Effic.</p>
//           <p className="text-xl sm:text-2xl font-bold text-white">92<span className="text-sm opacity-60">%</span></p>
//         </motion.div>
//       </div>

//       {/* Bottom Row */}
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, delay: 0.7 }}
//         className="self-end bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl w-full sm:w-80 mt-auto relative overflow-hidden"
//       >
//         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C49A2A]/20 blur-3xl rounded-full" />
        
//         <div className="flex justify-between items-end mb-4">
//           <div>
//             <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">
//               Milk Yield Avg
//             </p>
//             <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
//               8,430 <span className="text-sm font-normal text-white/60">L/day</span>
//             </p>
//           </div>
//           <div className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
//             +5.2%
//           </div>
//         </div>

//         {/* Stylized Bar Chart */}
//         <div className="flex items-end justify-between gap-1 sm:gap-2 h-16">
//           {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
//             <div key={i} className="flex-1 w-full bg-white/5 rounded-t-sm relative group cursor-pointer hover:bg-white/10 transition-colors">
//               <motion.div
//                 initial={{ height: 0 }}
//                 animate={{ height: `${h}%` }}
//                 transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
//                 className={`absolute bottom-0 w-full rounded-t-sm ${
//                   i === 6 ? "bg-gradient-to-t from-[#C49A2A] to-[#e6bc48]" : "bg-gradient-to-t from-green-600/60 to-green-400/60 group-hover:from-green-500 group-hover:to-green-400"
//                 }`}
//               />
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default function Hero() {
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B120B] pt-20 pb-12 lg:pt-0">
//       {/* Background Section */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-[#0B120B]/90 to-[#0B120B] z-10" />
//         <img 
//           src="/Images/Herd Images/farm-field.jpg" 
//           alt="Farm Background" 
//           className="w-full h-full object-cover opacity-30 mix-blend-overlay"
//         />
//       </div>

//       <div className="container mx-auto px-6 lg:px-12 xl:px-20 grid lg:grid-cols-2 gap-12 lg:gap-16 relative z-20 items-center">
        
//         {/* LEFT COLUMN: Content */}
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="max-w-2xl"
//         >
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
//             <span className="flex h-2 w-2 relative">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C49A2A] opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C49A2A]"></span>
//             </span>
//             <span className="text-xs font-medium text-white/80 tracking-wide">HerdERP Platform v2.0 Live</span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
//             Every Animal Counted.<br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C49A2A] to-[#e6bc48]">
//               Every Farm Profitable.
//             </span>
//           </h1>

//           <p className="text-lg text-white/60 mb-10 leading-relaxed font-light max-w-lg">
//             Monitor herd health, optimise breeding programmes, track daily milk yields 
//             and run your entire farm operation from one connected, intelligent dashboard.
//           </p>

//           <div className="flex flex-col sm:flex-row flex-wrap gap-4">
//             <button className="group bg-[#4B6B3F] hover:bg-[#5a804b] text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(75,107,63,0.3)] hover:shadow-[0_0_30px_rgba(75,107,63,0.5)] hover:-translate-y-0.5">
//               Start Free Trial 
//               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//             <button className="group bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all backdrop-blur-sm hover:-translate-y-0.5">
//               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
//                 <Play size={12} fill="currentColor" className="ml-1" />
//               </div>
//               Watch a Demo
//             </button>
//           </div>
//         </motion.div>

//         {/* RIGHT COLUMN: Interactive Dashboard Visual */}
//         <motion.div 
//           className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-green-900/20 aspect-[4/3] lg:aspect-square bg-black group"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, delay: 0.2 }}
//         >
//           {/* Main Image */}
//           <img 
//             src="/Images/Herd Images/cow2.png" 
//             alt="Cow Monitoring" 
//             className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"
//           />
          
//           {/* Subtle vignette overlay to ensure text readability */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

//           {/* UI HUD Overlay */}
//           <DashboardOverlay />

//           {/* Upgraded Scanning Line Effect */}
//           <motion.div 
//             className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-green-400/10 to-green-400/30 border-b border-green-400/50 z-30 pointer-events-none"
//             animate={{ top: ["-20%", "120%"] }}
//             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//           />
//         </motion.div>

//       </div>
//     </section>
//   );
// }
