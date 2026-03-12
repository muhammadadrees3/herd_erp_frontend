"use client";
import {
  BarChart3, Monitor, Play, X, AlertTriangle,
  ArrowUpRight, Milk, Stethoscope, Wheat, Users, TrendingUp,
} from "lucide-react";
import {
  motion, useMotionValue, useSpring, useTransform, AnimatePresence,
} from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

// ─── HerdERP Brand Tokens ─────────────────────────────────────────────────────
const B = {
  forestGreen:  "#2E6B2E",
  lightGreen:   "#3A8C3A",
  deepGreen:    "#1D4A1D",
  wheatGold:    "#C49A2A",
  burntOrange:  "#C4601A",
  cream:        "#F5F0E8",
  offWhite:     "#DDD7CA",
  muted:        "#7A8870",
  darkBg:       "#0B120B",
  cardBg:       "rgba(15,26,15,0.88)",
  cardBorder:   "rgba(196,154,42,0.22)",
};

const serif = "var(--font-display)";
const sans  = "var(--font-body)";
const mono  = "var(--font-mono)";

// ─── Stats strip data ─────────────────────────────────────────────────────────
const statsStrip = [
  { icon: BarChart3,    value: "2,847",   unit: "Head",    label: "Total Livestock",  color: B.forestGreen },
  { icon: Milk,         value: "14,280",  unit: "L",       label: "Today's Yield",    color: B.wheatGold   },
  { icon: Stethoscope,  value: "97.4",    unit: "%",       label: "Herd Health",      color: B.forestGreen },
  { icon: Wheat,        value: "On Track",unit: "",        label: "Feed Schedule",    color: B.wheatGold   },
  { icon: Users,        value: "12",      unit: "Due",     label: "Births This Week", color: B.burntOrange },
  { icon: TrendingUp,   value: "+6.2",    unit: "%",       label: "Yield vs Last Wk", color: B.forestGreen },
];

export default function HeroScroll() {
  const { isDark } = useTheme();
  const containerRef  = useRef(null);
  const videoRef      = useRef(null);
  const [isHovering,      setIsHovering]      = useState(false);
  const [isVideoPlaying,  setIsVideoPlaying]  = useState(false);

  // 3-D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { damping: 18, stiffness: 55, restDelta: 0.001 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3.5, -3.5]), spring);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4.5, 4.5]), spring);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width  / 2) / (r.width  / 2));
    mouseY.set((e.clientY - r.top  - r.height / 2) / (r.height / 2));
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setIsHovering(false); };

  const safePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  };
  const openVideo  = () => { setIsVideoPlaying(true);  setTimeout(safePlay, 120); };
  const closeVideo = () => {
    setIsVideoPlaying(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && isVideoPlaying) closeVideo(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isVideoPlaying]);

  return (
    <div
      className="relative flex flex-col overflow-hidden py-28"
      style={{ background: isDark ? B.darkBg : "#EEE9DF" }}
    >
      {/* ══ BACKGROUND LAYERS ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle field-row grid — earthy, not techy */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(196,154,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,42,0.04) 1px, transparent 1px)"
              : "linear-gradient(rgba(46,107,46,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,107,46,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Warm green atmospheric bloom */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 900px 500px at 60% 60%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat gold corner warmth */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
        }} />
        {/* Film grain */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "180px", mixBlendMode: "overlay",
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full">

        {/* ══ SECTION HEADING ════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="flex flex-col items-center text-center gap-6 mb-16"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: B.wheatGold }} />
            <span className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: B.wheatGold, fontFamily: mono }}>
              Farm Intelligence Dashboard
            </span>
            <div className="w-8 h-px" style={{ background: B.wheatGold }} />
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: serif,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontSize: "clamp(2.8rem, 8vw, 5.8rem)",
            }}
          >
            <span style={{ color: isDark ? B.cream : "#1A2A1A" }}>Your Entire Farm,</span>
            <br />
            <span style={{ color: B.forestGreen }}>One Clear</span>{" "}
            <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Dashboard.</span>
          </h2>

          {/* Branded divider */}
          <div className="w-20 h-[2px]" style={{
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
          }} />

          {/* Sub-copy */}
          <p
            className="text-sm md:text-base leading-relaxed max-w-2xl"
            style={{ color: isDark ? B.offWhite : "#3A4A38", fontFamily: sans, fontWeight: 300 }}
          >
            Monitor livestock performance, track health records, analyse milk yield
            and manage breeding cycles all from a single centralised platform
            built for working farms.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href="/dashboard">
              <button
                className="group relative overflow-hidden px-10 py-4 font-semibold text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2"
                style={{ background: B.forestGreen, color: "#fff", fontFamily: mono,
                  boxShadow: `0 4px 24px rgba(46,107,46,0.35)` }}
                onMouseEnter={e => (e.currentTarget.style.background = B.lightGreen)}
                onMouseLeave={e => (e.currentTarget.style.background = B.forestGreen)}
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
                <span className="relative z-10">Explore Dashboard</span>
              </button>
            </Link>
            <button
              className="px-10 py-4 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300"
              style={{
                border: `1.5px solid rgba(196,154,42,0.4)`,
                color: isDark ? B.cream : "#1A2A1A",
                fontFamily: mono,
                background: "rgba(196,154,42,0.05)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(196,154,42,0.12)"; e.currentTarget.style.borderColor = "rgba(196,154,42,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(196,154,42,0.05)"; e.currentTarget.style.borderColor = "rgba(196,154,42,0.4)"; }}
            >
              View Features
            </button>
          </div>
        </motion.div>

        {/* ══ LIVE STATS STRIP ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
        >
          {statsStrip.map(({ icon: Icon, value, unit, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="flex flex-col gap-1.5 px-4 py-3"
              style={{
                background: isDark ? "rgba(15,26,15,0.7)" : "rgba(240,236,228,0.8)",
                border: `1px solid ${color}28`,
                borderTop: `3px solid ${color}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                <span className="text-[8px] uppercase tracking-widest"
                  style={{ color: B.muted, fontFamily: mono }}>{label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold leading-none"
                  style={{ color: isDark ? B.cream : "#1A2A1A", fontFamily: serif }}>{value}</span>
                {unit && <span className="text-[9px]" style={{ color, fontFamily: mono }}>{unit}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ══ 3-D DASHBOARD FRAME ════════════════════════════════════════════ */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovering(true)}
          className="relative w-full max-w-6xl mx-auto"
          style={{ perspective: "2200px" }}
        >
          <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">

            {/* ── Outer frame ── */}
            <div
              className="relative overflow-hidden transition-all duration-500"
              style={{
                border: `1px solid ${isHovering ? "rgba(196,154,42,0.45)" : "rgba(196,154,42,0.22)"}`,
                background: isDark ? "rgba(11,18,11,0.85)" : "rgba(230,226,218,0.9)",
                backdropFilter: "blur(12px)",
                boxShadow: isHovering
                  ? `0 40px 120px rgba(46,107,46,0.3), 0 0 0 1px rgba(196,154,42,0.3)`
                  : `0 20px 80px rgba(0,0,0,0.45)`,
                borderRadius: 4,
              }}
            >

              {/* Top brand bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] z-30"
                style={{ background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})` }}
              />

              {/* Browser chrome */}
              <div
                className="flex items-center justify-between px-5 py-3.5 mt-[3px]"
                style={{
                  borderBottom: `1px solid rgba(196,154,42,0.15)`,
                  background: isDark ? "rgba(8,14,8,0.7)" : "rgba(220,216,208,0.8)",
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Traffic lights — warm-tinted */}
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C4601A" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: B.wheatGold }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: B.forestGreen }} />
                  </div>
                  {/* URL bar */}
                  <div
                    className="px-4 py-1 text-[10px]"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
                      border: `1px solid rgba(196,154,42,0.2)`,
                      color: isDark ? B.muted : "#5A6A58",
                      fontFamily: mono,
                    }}
                  >
                    https://app.herderp.io/dashboard
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Monitor className="w-3.5 h-3.5" style={{ color: B.muted }} />
                  {/* Live badge */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-widest"
                    style={{
                      background: "rgba(46,107,46,0.15)",
                      border: `1px solid rgba(46,107,46,0.35)`,
                      color: B.forestGreen,
                      fontFamily: mono,
                    }}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: B.forestGreen }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ background: B.forestGreen }} />
                    </span>
                    Live Feed
                  </div>
                </div>
              </div>

              {/* ── Dashboard image ── */}
              <div className="relative overflow-hidden group/img">
                <img
                  src="/overview.png"
                  alt="HerdERP Dashboard"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-[1.015]"
                  style={{ opacity: isDark ? 0.92 : 0.88 }}
                  draggable={false}
                />

                {/* Warm green scan line */}
                <div
                  className="absolute left-0 right-0 h-[2px] pointer-events-none animate-scan"
                  style={{ background: `linear-gradient(to right, transparent, ${B.forestGreen}55, transparent)` }}
                />

                {/* Play overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(11,18,11,0.35)", backdropFilter: "blur(2px)" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openVideo}
                    className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      background: B.forestGreen,
                      boxShadow: `0 0 0 8px rgba(46,107,46,0.2), 0 12px 40px rgba(46,107,46,0.5)`,
                    }}
                  >
                    <Play className="w-9 h-9 text-white ml-1" fill="white" />
                  </motion.button>
                </motion.div>

                {/* ── DATA OVERLAY BADGES ── */}

                {/* TOP-LEFT: Herd count */}
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.55 }}
                  className="absolute top-4 left-4 z-20 px-3 py-2.5"
                  style={{ background: B.cardBg, border: `1px solid ${B.cardBorder}`,
                    backdropFilter: "blur(12px)", borderLeft: `3px solid ${B.forestGreen}` }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: B.forestGreen }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ background: B.forestGreen }} />
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.2em]"
                      style={{ color: B.forestGreen, fontFamily: mono }}>Herd — Active</span>
                  </div>
                  <div className="text-[1.35rem] font-bold leading-none"
                    style={{ color: B.cream, fontFamily: serif }}>2,847 Head</div>
                </motion.div>

                {/* TOP-RIGHT: Milk yield */}
                <motion.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.55 }}
                  className="absolute top-4 right-4 z-20 px-3 py-2.5"
                  style={{ background: B.cardBg, border: `1px solid ${B.cardBorder}`,
                    backdropFilter: "blur(12px)", borderLeft: `3px solid ${B.wheatGold}` }}
                >
                  <div className="text-[8px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: B.wheatGold, fontFamily: mono }}>Milk Today</div>
                  <div className="text-[1.35rem] font-bold leading-none"
                    style={{ color: B.cream, fontFamily: serif }}>14,280 L</div>
                  <div className="flex items-center gap-1 mt-1 text-[9px]"
                    style={{ color: B.forestGreen, fontFamily: mono }}>
                    <ArrowUpRight className="w-3 h-3" /> +6.2% vs last week
                  </div>
                </motion.div>

                {/* BOTTOM-CENTRE: Zone alert */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72, duration: 0.55 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-2"
                  style={{ background: "rgba(11,18,11,0.9)",
                    border: `1px solid rgba(196,96,26,0.4)`,
                    borderLeft: `3px solid ${B.burntOrange}`,
                    backdropFilter: "blur(12px)" }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: B.burntOrange }} />
                    <span className="text-[8px] uppercase tracking-[0.2em]"
                      style={{ color: B.burntOrange, fontFamily: mono }}>Zone A-3 — Health Alert</span>
                  </div>
                </motion.div>

                {/* BOTTOM-RIGHT: GPS */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.55 }}
                  className="absolute bottom-4 right-4 z-20 px-3 py-2 flex items-center gap-2"
                  style={{ background: B.cardBg, border: `1px solid ${B.cardBorder}`,
                    backdropFilter: "blur(12px)" }}
                >
                  {/* Wheat icon */}
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="flex-shrink-0">
                    <path d="M7 17V2M4.5 4.5l2.5-2.5 2.5 2.5M3.5 8l3.5-2.5L10.5 8M3.5 11.5l3.5-2.5 3.5 2.5M4.5 15l2.5-2 2.5 2"
                      stroke={B.wheatGold} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.18em]"
                      style={{ color: B.muted, fontFamily: mono }}>Farm Location</div>
                    <div className="text-[10px] font-bold leading-none mt-0.5"
                      style={{ color: B.cream, fontFamily: mono }}>33.6844° N, 73.0479° E</div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom status bar */}
              <div
                className="flex items-center justify-between px-5 py-2.5"
                style={{
                  borderTop: `1px solid rgba(196,154,42,0.12)`,
                  background: isDark ? "rgba(8,14,8,0.8)" : "rgba(215,210,200,0.8)",
                }}
              >
                <div className="flex items-center gap-5">
                  {[
                    { dot: B.forestGreen, label: "All systems operational" },
                    { dot: B.wheatGold,   label: "Auto-sync every 30 sec" },
                  ].map(({ dot, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dot }} />
                      <span className="text-[9px] uppercase tracking-wider"
                        style={{ color: B.muted, fontFamily: mono }}>{label}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-wider hidden sm:block"
                  style={{ color: B.muted, fontFamily: mono }}>HerdERP v4.2</span>
              </div>
            </div>

            {/* Corner glows — warm agricultural */}
            <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full blur-3xl pointer-events-none"
              style={{ background: `rgba(46,107,46,0.22)` }} />
            <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full blur-3xl pointer-events-none"
              style={{ background: `rgba(196,154,42,0.14)` }} />
          </motion.div>
        </div>

        {/* ══ BOTTOM TAGLINE ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-5 mt-14"
        >
          <div className="h-px w-14" style={{ background: `rgba(196,154,42,0.35)` }} />
          <p className="text-[10px] uppercase tracking-[0.26em]"
            style={{ color: B.muted, fontFamily: mono }}>
            Real-time monitoring across every corner of your farm
          </p>
          <div className="h-px w-14" style={{ background: `rgba(196,154,42,0.35)` }} />
        </motion.div>
      </div>

      {/* ══ VIDEO MODAL ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "rgba(8,13,8,0.94)", backdropFilter: "blur(8px)" }}
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{    scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative w-full max-w-6xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Brand bar on modal */}
              <div className="w-full h-[2px] mb-1"
                style={{ background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})` }} />

              <button
                onClick={closeVideo}
                className="absolute -top-11 right-0 w-9 h-9 flex items-center justify-center transition-all duration-200"
                style={{ border: `1px solid rgba(196,154,42,0.35)`, background: "rgba(15,26,15,0.8)", color: B.cream }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(196,154,42,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(196,154,42,0.35)")}
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-hidden shadow-2xl"
                style={{ border: `1px solid rgba(196,154,42,0.25)` }}>
                <video
                  ref={videoRef}
                  src="/Videos/herd-dashboard.mp4"
                  controls
                  className="w-full h-auto"
                  controlsList="nodownload"
                  onCanPlay={safePlay}
                />
              </div>

              <div className="text-center mt-6">
                <p className="text-[10px] uppercase tracking-widest"
                  style={{ color: B.muted, fontFamily: mono }}>
                  Press <kbd className="px-2 py-0.5 mx-1"
                    style={{ border: `1px solid rgba(196,154,42,0.3)`, color: B.cream, fontFamily: mono }}>ESC</kbd>
                  to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// "use client";
// import { Crosshair, BarChart3, Monitor, Play, X, AlertTriangle, ArrowUpRight } from "lucide-react";
// import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext";
// import { useRef, useState, useEffect } from "react";
// import Link from "next/link";

// export default function HeroScroll() {
//   const { isDark } = useTheme();
//   const containerRef = useRef(null);
//   const videoRef = useRef(null);
//   const [isHovering, setIsHovering] = useState(false);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [showWidget, setShowWidget] = useState(true);
//   const [widgetExpanded, setWidgetExpanded] = useState(false);

//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const springConfig = { damping: 15, stiffness: 50, restDelta: 0.001 };
//   const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
//   const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

//   const handleMouseMove = (e) => {
//     if (!containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
//     mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
//   };

//   const handleMouseLeave = () => {
//     mouseX.set(0);
//     mouseY.set(0);
//     setIsHovering(false);
//   };

//   // Safe video play — always catches the AbortError from play/pause races
//   const safePlay = () => {
//     const vid = videoRef.current;
//     if (!vid) return;
//     const promise = vid.play();
//     if (promise !== undefined) {
//       promise.catch(() => {
//         // Ignore AbortError (play interrupted by pause or unmount)
//       });
//     }
//   };

//   const openVideo = () => {
//     setIsVideoPlaying(true);
//     // Small delay so AnimatePresence fully mounts the <video> node before play()
//     setTimeout(() => safePlay(), 120);
//   };

//   const closeVideo = () => {
//     setIsVideoPlaying(false);
//     const vid = videoRef.current;
//     if (vid) {
//       vid.pause();
//       vid.currentTime = 0;
//     }
//   };

//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isVideoPlaying) closeVideo();
//     };
//     window.addEventListener("keydown", handleEscape);
//     return () => window.removeEventListener("keydown", handleEscape);
//   }, [isVideoPlaying]);

//   const monoStyle = { fontFamily: "var(--font-jetbrains-mono, monospace)" };
//   const displayStyle = { fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.82, textTransform: "uppercase" };

//   const cardBase = isDark
//     ? "backdrop-blur-md bg-black/75 border border-white/10"
//     : "backdrop-blur-md bg-white/90 border border-neutral-200 shadow-lg";

//   return (
//     <div className={`flex flex-col overflow-hidden relative py-32 ${isDark ? "bg-[#070708]" : "bg-[#f5f3ef]"}`}>

//       {/* BACKGROUND LAYERS */}
//       <div className="absolute inset-0 pointer-events-none z-0">
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-100" : "opacity-40"}`} />
//         <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 800px 400px at 70% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
//         <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(15deg, transparent, transparent 60px, rgba(34,197,94,0.025) 60px, rgba(34,197,94,0.025) 61px)" }} />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">

//         {/* SECTION HEADING */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="flex flex-col items-center text-center space-y-6 mb-20"
//         >
//           <h2 className={`${isDark ? "text-white" : "text-neutral-900"}`} style={{ ...displayStyle, fontSize: "clamp(3.5rem, 10vw, 7rem)" }}>
//             Dashboard{" "}
//             <span
//               className="text-transparent bg-clip-text bg-gradient-to-b from-green-400 via-green-600 to-emerald-900"
//               style={{ textShadow: "0 0 40px rgba(34,197,94,0.35)" }}
//             >
//               For Your Herd
//             </span>
//           </h2>

//           <div className="flex items-center gap-6 max-w-3xl">
//             <div className="h-px w-12 bg-green-500/50 hidden md:block" />
//             <p className={`text-sm md:text-base leading-relaxed tracking-wide text-center ${isDark ? "text-neutral-400" : "text-neutral-600"}`} style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontWeight: 300 }}>
//               Monitor livestock performance, track health records, analyze milk yield, and manage breeding cycles from one centralized platform
//             </p>
//             <div className="h-px w-12 bg-green-500/50 hidden md:block" />
//           </div>

//           <div className="flex flex-wrap gap-4 justify-center pt-2">
//             <Link href="/dashboard" className="group">
//               <button className="shimmer-on-hover relative overflow-hidden px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-[11px] tracking-widest uppercase transition-colors duration-200">
//                 <span className="relative z-10">Explore Dashboard</span>
//               </button>
//             </Link>
//             <button className={`px-10 py-4 text-[11px] font-bold uppercase tracking-widest border transition-all backdrop-blur-sm ${isDark ? "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600" : "border-neutral-400 text-neutral-600 bg-white/50 hover:text-black hover:border-neutral-900 shadow-sm"}`}>
//               View Features
//             </button>
//           </div>
//         </motion.div>

//         {/* 3D TILTING DASHBOARD FRAME */}
//         <div
//           ref={containerRef}
//           onMouseMove={handleMouseMove}
//           onMouseLeave={handleMouseLeave}
//           onMouseEnter={() => setIsHovering(true)}
//           className="relative w-full max-w-6xl mx-auto"
//           style={{ perspective: "2000px" }}
//         >
//           <motion.div
//             style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
//             className="relative"
//           >
//             {/* Main frame */}
//             <div
//               className={`relative rounded-2xl border backdrop-blur-sm overflow-hidden transition-all duration-500 ${isDark ? "bg-neutral-900/50 border-white/10" : "bg-white/80 border-neutral-200"}`}
//               style={{
//                 boxShadow: isHovering
//                   ? "0 40px 120px rgba(34,197,94,0.28)"
//                   : isDark
//                     ? "0 20px 80px rgba(0,0,0,0.6)"
//                     : "0 20px 80px rgba(0,0,0,0.15)",
//               }}
//             >
//               {/* Browser chrome bar */}
//               <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/5 bg-black/20" : "border-neutral-200 bg-neutral-50"}`}>
//                 <div className="flex items-center gap-3">
//                   <div className="flex gap-2">
//                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
//                     <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
//                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
//                   </div>
//                   <div className={`ml-4 px-4 py-1.5 rounded text-xs ${isDark ? "bg-black/40 text-neutral-500" : "bg-white text-neutral-400"}`} style={monoStyle}>
//                     https://dashboard.agriherd.io
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Monitor className={`w-4 h-4 ${isDark ? "text-neutral-600" : "text-neutral-400"}`} />
//                   <div className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"}`} style={monoStyle}>
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot inline-block" />
//                     Live
//                   </div>
//                 </div>
//               </div>

//               {/* Dashboard image */}
//               <div className="relative overflow-hidden group/image">
//                 <img
//                   src="/overview.png"
//                   alt="AgriHerd Dashboard"
//                   className={`w-full h-auto object-cover transition-all duration-700 ${isDark ? "opacity-95" : "opacity-90"} group-hover/image:scale-[1.02]`}
//                   draggable={false}
//                 />

//                 {/* Semi-transparent overlay on hover with play button */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   whileHover={{ opacity: 1 }}
//                   className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center"
//                 >

//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={openVideo}
//                     className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/50 cursor-pointer"
//                   >
//                     <Play className="w-10 h-10 text-white ml-1" fill="white" />
//                   </motion.div>
//                 </motion.div>

//                 {/* Animated scan line */}
//                 <div className="animate-scan" />

//                 {/* ── DATA OVERLAY BADGES ── */}

//                 {/* TOP-LEFT: HERD status */}
//                 <motion.div
//                   initial={{ opacity: 0, y: -15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4, duration: 0.6 }}
//                   className={`absolute top-4 left-4 z-20 ${cardBase} px-3 py-2`}
//                 >
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
//                     <span className="text-[8px] text-green-400 uppercase tracking-widest" style={monoStyle}>HERD-204 // ACTIVE</span>
//                   </div>
//                   <div className={`text-lg font-bold leading-none ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}>
//                     2,847 HEAD
//                   </div>
//                 </motion.div>

//                 {/* TOP-RIGHT: Milk today */}
//                 <motion.div
//                   initial={{ opacity: 0, y: -15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.6, duration: 0.6 }}
//                   className={`absolute top-4 right-4 z-20 ${cardBase} px-3 py-2`}
//                 >
//                   <div className="text-[8px] text-neutral-400 uppercase tracking-widest mb-1" style={monoStyle}>MILK-TODAY</div>
//                   <div className={`text-lg font-bold leading-none ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}>
//                     14,280 L
//                   </div>
//                   <div className="flex items-center gap-1 mt-1 text-green-400 text-[9px]" style={monoStyle}>
//                     <ArrowUpRight className="w-3 h-3" /> 6.2%
//                   </div>
//                 </motion.div>

//                 {/* BOTTOM-CENTER: Zone alert */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8, duration: 0.6 }}
//                   className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 ${isDark ? "backdrop-blur-md bg-black/75 border border-amber-500/30" : "backdrop-blur-md bg-white/90 border border-amber-400 shadow-lg"} px-3 py-2`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <AlertTriangle className="w-3 h-3 text-amber-400" />
//                     <span className="text-[8px] text-amber-400 uppercase tracking-widest" style={monoStyle}>ZONE-A3 // ALERT</span>
//                   </div>
//                 </motion.div>

//                 {/* COORDINATE BADGE bottom-right */}
//                 <motion.div
//                   initial={{ x: 50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className={`absolute bottom-4 right-4 z-20 ${cardBase} px-3 py-2 flex items-center gap-2`}
//                 >
//                   <Crosshair className="w-4 h-4 text-green-500 animate-rotate-slow flex-shrink-0" />
//                   <div className="flex flex-col">
//                     <span className="text-[8px] text-neutral-500 uppercase tracking-widest" style={monoStyle}>Global_Pos</span>
//                     <span className={`text-[10px] font-bold leading-none ${isDark ? "text-white" : "text-neutral-900"}`} style={monoStyle}>33.6844° N, 73.0479° E</span>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>

//             {/* Corner glow blobs */}
//             <div className={`absolute -bottom-3 -left-3 w-24 h-24 rounded-full blur-3xl ${isDark ? "bg-green-500/20" : "bg-green-500/10"}`} />
//             <div className={`absolute -top-3 -right-3 w-24 h-24 rounded-full blur-3xl ${isDark ? "bg-blue-500/20" : "bg-blue-500/10"}`} />
//           </motion.div>
//         </div>

//         {/* Bottom tagline */}
//         <div className="text-center mt-16">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             className="flex items-center justify-center gap-4"
//           >
//             <div className="h-px w-12 bg-green-500/30" />
//             <p className={`text-xs uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-neutral-400"}`} style={monoStyle}>
//               // Real-time monitoring across all your operations
//             </p>
//             <div className="h-px w-12 bg-green-500/30" />
//           </motion.div>
//         </div>
//       </div>

//       {/* ── FLOATING SYSTEM STATUS WIDGET ── */}
   

//       {/* VIDEO MODAL */}
//       <AnimatePresence>
//         {isVideoPlaying && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
//             onClick={closeVideo}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="relative w-full max-w-6xl mx-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={closeVideo}
//                 className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center group z-50"
//                 aria-label="Close video"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
//               </button>
//               <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
//                 <video
//                   ref={videoRef}
//                   src="/Videos/herd-dashboard.mp4"
//                   controls
//                   className="w-full h-auto"
//                   controlsList="nodownload"
//                   onCanPlay={safePlay}
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               <div className="absolute -bottom-10 left-0 right-0 text-center">
//                 <p className="text-white/50 text-sm" style={monoStyle}>Press <kbd className="px-2 py-1 bg-white/10 rounded text-white/70">ESC</kbd> to close</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }