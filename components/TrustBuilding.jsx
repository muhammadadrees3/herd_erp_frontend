"use client";
import { useState, useEffect, useRef } from "react";
import { Shield, Activity, Cpu, HeartPulse, TrendingUp, Leaf, Users, Award } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

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
  cardDark:     "#0F1A0F",
};

const serif = "var(--font-display)";
const sans  = "var(--font-body)";
const mono  = "var(--font-mono)";

// ─── Wheat SVG ────────────────────────────────────────────────────────────────
const WheatIcon = ({ color = B.wheatGold, size = 13 }) => (
  <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 13 20" fill="none" aria-hidden>
    <path
      d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
      stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", decimals = 0, duration = 1600 }) {
  const [count, setCount]   = useState(0);
  const ref                 = useRef(null);
  const observed            = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const steps        = 64;
        const increment    = target / steps;
        const stepDuration = duration / steps;
        const iv = setInterval(() => {
          start += increment;
          if (start >= target) { setCount(target); clearInterval(iv); }
          else setCount(parseFloat(start.toFixed(decimals)));
        }, stepDuration);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  const display =
    decimals > 0
      ? count.toFixed(decimals)
      : count >= 1000
        ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
        : count;

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  {
    id:     "FS-001",
    value:  50000,
    suffix: "+",
    label:  "Animals Tracked",
    detail: "Across all registered farms",
    icon:   Activity,
    accent: B.forestGreen,
  },
  {
    id:       "FS-002",
    value:    45,
    suffix:   "%",
    label:    "Milk Yield Increase",
    detail:   "Average uplift per farm",
    icon:     TrendingUp,
    accent:   B.wheatGold,
    decimals: 0,
  },
  {
    id:     "FS-003",
    value:  99.9,
    suffix: "%",
    label:  "Uptime Guaranteed",
    detail: "SLA-backed reliability",
    icon:   Shield,
    accent: B.forestGreen,
    decimals: 1,
  },
  {
    id:     "FS-004",
    value:  2100000,
    suffix: "",
    label:  "Data Points / Day",
    detail: "Real-time herd sync",
    icon:   Cpu,
    accent: B.burntOrange,
  },
];

// ─── Trust pillars (replaces the generic "Make Better Decisions" text) ────────
const pillars = [
  { icon: HeartPulse, label: "Animal-first design",  color: B.forestGreen  },
  { icon: Shield,     label: "Bank-grade security",  color: B.wheatGold    },
  { icon: Leaf,       label: "Sustainability tools", color: B.forestGreen  },
  { icon: Award,      label: "ISO 27001 certified",  color: B.burntOrange  },
];

export default function TrustBuilding() {
  const { isDark }        = useTheme();
  const [hovered, setHov] = useState(null);

  const pageBg    = isDark ? B.darkBg    : "#EEE9DF";
  const cardBg    = isDark ? B.cardDark  : "rgba(240,236,228,0.9)";
  const textMain  = isDark ? B.cream     : "#1A2A1A";
  const textSub   = isDark ? B.offWhite  : "#4A5A48";

  return (
    <section
      id="agri-trust"
      className="relative overflow-hidden"
      style={{ background: pageBg }}
    >
      {/* ══ BACKGROUND ══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Field-row grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(196,154,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(46,107,46,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(46,107,46,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Green left bloom */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 700px 500px at 18% 55%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat warmth top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
        }} />
        {/* Film grain */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "160px", mixBlendMode: "overlay",
        }} />
        {/* Left brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
        }} />
      </div>

      {/* ══ MAIN GRID ═══════════════════════════════════════════════════════ */}
      <div className="lg:grid lg:grid-cols-5 min-h-[85vh] relative z-10">

        {/* ── LEFT: Copy + Stats (3/5) ──────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col justify-center p-10 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-6 h-px" style={{ background: B.wheatGold }} />
              <WheatIcon />
              <span className="text-[10px] uppercase tracking-[0.26em]"
                style={{ color: B.wheatGold, fontFamily: mono }}>
                Why Farms Choose HerdERP
              </span>
            </div>

            {/* Headline */}
            <h2
              className="mb-4"
              style={{
                fontFamily: serif,
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
                color: textMain,
              }}
            >
              Helping Farmers<br />
              <span style={{ color: B.forestGreen }}>Make Better</span>{" "}
              <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Decisions.</span>
            </h2>

            {/* Gradient rule */}
            <div className="mb-6" style={{
              height: 2, width: 80,
              background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
            }} />

            {/* Sub-copy */}
            <p className="text-base font-light mb-8 max-w-lg leading-relaxed"
              style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
              Real-time livestock intelligence built for modern farming operations.
              Every decision is driven by live data from your herd, your fields, your farm.
            </p>

            {/* Trust pillars row */}
            <div className="flex flex-wrap gap-3 mb-10">
              {pillars.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    background:    isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                    border:        `1px solid ${color}30`,
                    borderLeft:    `3px solid ${color}`,
                    backdropFilter:"blur(8px)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  <span className="text-[10px] uppercase tracking-wider"
                    style={{ color: isDark ? B.offWhite : "#3A4A38", fontFamily: mono }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── STATS GRID ── */}
            <div
              className="grid grid-cols-2"
              style={{ border: `1px solid rgba(196,154,42,0.18)` }}
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                const isLast = i === stats.length - 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative group overflow-hidden p-6 transition-all duration-350 cursor-default"
                    style={{
                      background: cardBg,
                      borderRight:  (i % 2 === 0)  ? `1px solid rgba(196,154,42,0.14)` : "none",
                      borderBottom: (i < 2)         ? `1px solid rgba(196,154,42,0.14)` : "none",
                      borderTop:    `3px solid ${i === 0 ? stat.accent : "transparent"}`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderTopColor = stat.accent;
                      e.currentTarget.style.background = isDark
                        ? `rgba(20,34,20,0.97)`
                        : `rgba(235,230,220,0.97)`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderTopColor = i === 0 ? stat.accent : "transparent";
                      e.currentTarget.style.background = cardBg;
                    }}
                  >
                    {/* ID tag */}
                    <div className="text-[8px] uppercase tracking-widest mb-3 flex items-center gap-1.5"
                      style={{ color: B.muted, fontFamily: mono }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: stat.accent }} />
                      {stat.id}
                    </div>

                    {/* Number */}
                    <div
                      className="text-[3.2rem] font-bold leading-none mb-1.5 tracking-tight"
                      style={{ fontFamily: serif, color: textMain }}
                    >
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        decimals={stat.decimals || 0}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-[11px] uppercase tracking-widest font-semibold mb-0.5"
                      style={{ color: textMain, fontFamily: mono }}>
                      {stat.label}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider"
                      style={{ color: B.muted, fontFamily: mono }}>
                      {stat.detail}
                    </div>

                    {/* Icon — fades in on hover */}
                    <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity duration-350">
                      <Icon className="w-8 h-8" style={{ color: stat.accent }} />
                    </div>

                    {/* Bottom accent bar on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-350"
                      style={{ background: `linear-gradient(to right, ${stat.accent}, transparent)` }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Cinematic images (2/5) ─────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col min-h-[480px] lg:min-h-0">

          {/* Panel 1 — Herd on pasture */}
          <div
            className="flex-1 relative overflow-hidden cursor-pointer"
            onMouseEnter={() => setHov(1)}
            onMouseLeave={() => setHov(null)}
          >
            <img
              src="/Images/Herd Images/cow2.jpg"
              alt="Herd on Pasture"
              className="w-full h-full object-cover"
              style={{
                filter: hovered === 1
                  ? "grayscale(0%) brightness(0.82) saturate(1.15)"
                  : "grayscale(100%) brightness(0.28) contrast(1.1)",
                transition: "filter 750ms cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />

            {/* Warm gradient overlay */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(11,18,11,0.82) 0%, rgba(11,18,11,0.18) 55%, transparent 100%)" }} />

            {/* Green sweep line */}
            <div
              className="absolute left-0 right-0 h-[1.5px] pointer-events-none"
              style={{
                background: `linear-gradient(to right, transparent, ${B.forestGreen}70, transparent)`,
                animation: "scan 3.5s linear infinite",
                top: hovered === 1 ? undefined : "40%",
              }}
            />

            {/* Hover: top-right data readout */}
            <div
              className="absolute top-4 right-4 transition-all duration-400 px-3 py-2"
              style={{
                opacity: hovered === 1 ? 1 : 0,
                background: "rgba(11,18,11,0.82)",
                border: `1px solid rgba(46,107,46,0.4)`,
                borderLeft: `3px solid ${B.forestGreen}`,
                backdropFilter: "blur(10px)",
                transform: hovered === 1 ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.35s, transform 0.35s",
              }}
            >
              <div className="text-[8px] uppercase tracking-widest leading-relaxed"
                style={{ color: B.forestGreen, fontFamily: mono }}>
                Zone · North Field<br />
                Head Count · 312 active<br />
                Last Scan · 2 min ago
              </div>
            </div>

            {/* Bottom badge */}
            <div
              className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2"
              style={{
                background: "rgba(11,18,11,0.86)",
                border: `1px solid rgba(196,154,42,0.3)`,
                borderLeft: `3px solid ${B.forestGreen}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: B.forestGreen }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: B.forestGreen }} />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: B.cream, fontFamily: mono }}>
                Herd Monitoring
              </span>
            </div>
          </div>

          {/* Divider rule */}
          <div style={{ height: 2, background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})` }} />

          {/* Panel 2 — Farm field */}
          <div
            className="flex-1 relative overflow-hidden cursor-pointer"
            onMouseEnter={() => setHov(2)}
            onMouseLeave={() => setHov(null)}
          >
            <img
              src="/Images/Herd Images/farm-field.jpg"
              alt="Farm Field Operations"
              className="w-full h-full object-cover"
              style={{
                filter: hovered === 2
                  ? "grayscale(0%) brightness(0.82) saturate(1.1)"
                  : "grayscale(100%) brightness(0.28) contrast(1.1)",
                transition: "filter 750ms cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />

            {/* Warm gradient overlay */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(11,18,11,0.82) 0%, rgba(11,18,11,0.18) 55%, transparent 100%)" }} />

            {/* Wheat-gold sweep line */}
            <div
              className="absolute left-0 right-0 h-[1.5px] pointer-events-none"
              style={{
                background: `linear-gradient(to right, transparent, ${B.wheatGold}70, transparent)`,
                animation: "scan 4.5s linear infinite",
                animationDelay: "1.5s",
              }}
            />

            {/* Hover: top-right data readout */}
            <div
              className="absolute top-4 right-4 transition-all duration-400 px-3 py-2"
              style={{
                opacity: hovered === 2 ? 1 : 0,
                background: "rgba(11,18,11,0.82)",
                border: `1px solid rgba(196,154,42,0.4)`,
                borderLeft: `3px solid ${B.wheatGold}`,
                backdropFilter: "blur(10px)",
                transform: hovered === 2 ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.35s, transform 0.35s",
              }}
            >
              <div className="text-[8px] uppercase tracking-widest leading-relaxed"
                style={{ color: B.wheatGold, fontFamily: mono }}>
                Zone · South Paddock<br />
                Acreage · 320 acres active<br />
                Feed Status · On schedule
              </div>
            </div>

            {/* Bottom badge */}
            <div
              className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2"
              style={{
                background: "rgba(11,18,11,0.86)",
                border: `1px solid rgba(196,154,42,0.3)`,
                borderLeft: `3px solid ${B.wheatGold}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: B.wheatGold }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: B.wheatGold }} />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: B.cream, fontFamily: mono }}>
                Farm Operations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// "use client";
// import { useState, useEffect, useRef } from "react";
// import { Shield, Activity, Server, Headphones } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";
// import { motion } from "framer-motion";

// const monoStyle = { fontFamily: "var(--font-mono)" };
// const displayStyle = { fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase" };

// function AnimatedCounter({ target, suffix = "", duration = 1500 }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   const observed = useRef(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !observed.current) {
//         observed.current = true;
//         let start = 0;
//         const steps = 60;
//         const increment = target / steps;
//         const stepDuration = duration / steps;
//         const iv = setInterval(() => {
//           start += increment;
//           if (start >= target) { setCount(target); clearInterval(iv); }
//           else setCount(Math.floor(start));
//         }, stepDuration);
//       }
//     }, { threshold: 0.3 });
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [target, duration]);

//   const display = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count;
//   return <span ref={ref}>{display}{suffix}</span>;
// }

// const stats = [
//   { id: "LOG-001", value: 50000, suffix: "+", label: "Animals Tracked", detail: "Across All Farms", icon: Activity },
//   { id: "LOG-002", value: 45, suffix: "%", label: "Milk Yield Increase", detail: "avg. per farm", icon: Server },
//   { id: "LOG-003", value: 99.9, suffix: "%", label: "Uptime Guaranteed", detail: "SLA Backed", icon: Shield },
//   { id: "LOG-004", value: 2.1, suffix: "M", label: "Data Points / Day", detail: "Real-time sync", icon: Headphones },
// ];

// export default function TrustBuilding() {
//   const { isDark } = useTheme();
//   const [hoveredPanel, setHoveredPanel] = useState(null);

//   return (
//     <section id="agri-trust" className={`relative overflow-hidden ${isDark ? "bg-[#070708]" : "bg-[#f5f3ef]"}`}>

//       {/* BACKGROUND */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "" : "opacity-40"}`} />
//         <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 800px 400px at 20% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
//       </div>

//       <div className="lg:grid lg:grid-cols-5 min-h-[80vh] relative z-10">

//         {/* LEFT — Data Hub (3/5) */}
//         <div className="lg:col-span-3 flex flex-col justify-center p-10 lg:p-16">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className={`mb-5 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ ...displayStyle, fontSize: "clamp(3rem, 6vw, 5rem)" }}>
//               Helping Farmers <br />
//               <span
//                 className="text-green-500"
//                 style={{ color: isDark ? "#22c55e" : "#15803d", textShadow: "0 0 40px rgba(34,197,94,0.38)" }}
//               >
//                 Make Better Decisions
//               </span>
//             </h2>

//             <p className={`text-lg font-light mb-10 max-w-lg ${isDark ? "text-neutral-400" : "text-neutral-600"}`} style={{ ...{ fontFamily: "var(--font-dm-sans, sans-serif)" }, fontWeight: 300 }}>
//               Real-time livestock intelligence built for modern farming operations. Every decision driven by data.
//             </p>

//             {/* 2×2 BRUTALIST STATS GRID */}
//             <div className="grid grid-cols-2 gap-px bg-green-500/10">
//               {stats.map((stat, i) => {
//                 const Icon = stat.icon;
//                 return (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0 }}
//                     whileInView={{ opacity: 1 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: i * 0.1, duration: 0.5 }}
//                     className={`relative group p-6 overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0a0a0a] hover:bg-[#0d0d0f]" : "bg-white hover:bg-neutral-50"
//                       }`}
//                   >
//                     {/* Log ID */}
//                     <div className="text-[9px] text-neutral-500 mb-3" style={monoStyle}>{stat.id}</div>

//                     {/* Count */}
//                     <div className={`text-5xl font-bold tracking-tighter mb-1 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800 }}>
//                       {stat.value >= 1000 || stat.value < 100 ? (
//                         <AnimatedCounter target={stat.value} suffix={stat.suffix} />
//                       ) : (
//                         <><AnimatedCounter target={stat.value} />{stat.suffix}</>
//                       )}
//                       {stat.value >= 100 && stat.value < 1000 && (
//                         <span className="text-green-500 text-2xl ml-0.5">{stat.suffix}</span>
//                       )}
//                     </div>

//                     {/* Label */}
//                     <div className={`text-xs uppercase tracking-widest font-semibold mb-1 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}>
//                       {stat.label}
//                     </div>
//                     <div className="text-[10px] uppercase text-neutral-500" style={monoStyle}>{stat.detail}</div>

//                     {/* Icon */}
//                     <div className="absolute bottom-4 right-4">
//                       <Icon className="w-8 h-8 text-neutral-800 group-hover:text-green-500 transition-all duration-300 opacity-20 group-hover:opacity-100" />
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </motion.div>
//         </div>

//         {/* RIGHT — Cinematic Images (2/5) */}
//         <div className="lg:col-span-2 flex flex-col min-h-[480px] lg:min-h-0">
//           {/* Panel 1 — Herd Telemetry — GREEN scan */}
//           <div
//             className="flex-1 relative overflow-hidden group/panel cursor-pointer"
//             onMouseEnter={() => setHoveredPanel(1)}
//             onMouseLeave={() => setHoveredPanel(null)}
//           >
//             <img
//               src="/Images/Herd Images/cow2.jpg"
//               alt="Herd Telemetry"
//               className="w-full h-full object-cover"
//               style={{
//                 filter: hoveredPanel === 1
//                   ? "grayscale(0%) brightness(0.88) contrast(1.05) saturate(1.2)"
//                   : "grayscale(100%) brightness(0.32) contrast(1.1)",
//                 transition: "filter 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//               }}
//             />
//             <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }} />

//             {/* Green scan line */}
//             <div className="animate-scan" />

//             {/* Badge */}
//             <div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/70 border border-white/10 px-3 py-2 flex items-center gap-2">
//               <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
//               <span className="text-white text-xs font-bold uppercase tracking-wider" style={monoStyle}>Herd Telemetry</span>
//             </div>

//             {/* Data readout overlay */}
//             <div className={`absolute top-4 right-4 transition-all duration-300 ${hoveredPanel === 1 ? "opacity-100" : "opacity-0"}`}>
//               <div className="text-[9px] text-green-400/70" style={monoStyle}>
//                 SYS_ONLINE // STREAM_ACTIVE<br />
//                 FPS: 30 | LAT: 12ms | ZONE: NORTH
//               </div>
//             </div>
//           </div>

//           {/* Panel 2 — Farm Operations — AMBER scan */}
//           <div
//             className="flex-1 relative overflow-hidden group/panel cursor-pointer"
//             onMouseEnter={() => setHoveredPanel(2)}
//             onMouseLeave={() => setHoveredPanel(null)}
//           >
//             <img
//               src="/Images/Herd Images/farm-field.jpg"
//               alt="Farm Operations"
//               className="w-full h-full object-cover"
//               style={{
//                 filter: hoveredPanel === 2
//                   ? "grayscale(0%) brightness(0.88) contrast(1.05) saturate(1.2)"
//                   : "grayscale(100%) brightness(0.32) contrast(1.1)",
//                 transition: "filter 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//               }}
//             />
//             <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }} />

//             {/* Amber scan line */}
//             <div className="animate-scan-amber" />

//             {/* Badge */}
//             <div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/70 border border-white/10 px-3 py-2 flex items-center gap-2">
//               <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
//               <span className="text-white text-xs font-bold uppercase tracking-wider" style={monoStyle}>Farm Operations</span>
//             </div>

//             {/* Data readout overlay */}
//             <div className={`absolute top-4 right-4 transition-all duration-300 ${hoveredPanel === 2 ? "opacity-100" : "opacity-0"}`}>
//               <div className="text-[9px] text-amber-400/70" style={monoStyle}>
//                 SYS_ONLINE // STREAM_ACTIVE<br />
//                 FPS: 30 | LAT: 12ms | ZONE: SOUTH
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }