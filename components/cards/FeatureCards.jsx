"use client";
import React, { useState, useEffect } from "react";
import {
  Heart, BarChart3, Users, ChevronLeft, ChevronRight,
  Activity, Leaf, DollarSign, Stethoscope, ArrowRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── HerdERP Brand Tokens ─────────────────────────────────────────────────────
const B = {
  forestGreen: "#2E6B2E",
  lightGreen: "#3A8C3A",
  deepGreen: "#1D4A1D",
  wheatGold: "#C49A2A",
  burntOrange: "#C4601A",
  cream: "#F5F0E8",
  offWhite: "#DDD7CA",
  muted: "#7A8870",
  darkBg: "#0B120B",
  cardDark: "#0F1A0F",
  cardBorder: "rgba(196,154,42,0.2)",
};

const serif = "var(--font-display)";
const sans = "var(--font-body)";
const mono = "var(--font-mono)";

// ─── Feature data ─────────────────────────────────────────────────────────────
const features = [
  {
    icon: Stethoscope,
    tag: "MOD-01",
    label: "Animal Welfare",
    title: "Herd Health Tracking",
    description:
      "Complete health record management with vaccination schedules, vet appointment logging and automated disease-pattern alerts.",
    benefits: [
      "Full health record per animal",
      "Vaccination & treatment schedules",
      "Veterinary appointment calendar",
      "Early disease-pattern detection",
    ],
    accent: B.forestGreen,
    stat: { value: "97.4%", note: "Average herd health score" },
  },
  {
    icon: Heart,
    tag: "MOD-02",
    label: "Reproduction",
    title: "Breeding Intelligence",
    description:
      "Data-driven breeding cycle management — track pregnancies, predict calving dates and make informed genetic-selection decisions.",
    benefits: [
      "Breeding cycle monitoring",
      "Pregnancy & calving tracker",
      "Due-date prediction engine",
      "Genetic & sire selection tools",
    ],
    accent: B.burntOrange,
    stat: { value: "92%", note: "Calving prediction accuracy" },
  },
  {
    icon: BarChart3,
    tag: "MOD-03",
    label: "Dairy Performance",
    title: "Milk Yield Analytics",
    description:
      "Real-time yield monitoring with per-animal performance metrics, trend forecasting and benchmarking against industry averages.",
    benefits: [
      "Per-animal daily yield logging",
      "Production trend forecasting",
      "Herd-level efficiency reports",
      "Benchmark against farm targets",
    ],
    accent: B.wheatGold,
    stat: { value: "14,280L", note: "Average daily yield tracked" },
  },
  {
    icon: Leaf,
    tag: "MOD-04",
    label: "Nutrition",
    title: "Feed Management",
    description:
      "Optimise feed allocation across your entire herd — track inventory, monitor nutritional status and automate reorder workflows.",
    benefits: [
      "Feed inventory & stock tracking",
      "Per-herd nutritional monitoring",
      "Automated low-stock alerts",
      "Feed-cost-per-litre analytics",
    ],
    accent: B.forestGreen,
    stat: { value: "18%", note: "Average feed cost reduction" },
  },
  {
    icon: Users,
    tag: "MOD-05",
    label: "Operations",
    title: "Workforce Management",
    description:
      "Streamline daily farm operations — assign tasks, track attendance, monitor team performance and integrate payroll.",
    benefits: [
      "Daily task assignment & tracking",
      "Staff attendance & timesheets",
      "Performance monitoring reports",
      "Payroll & HR integration",
    ],
    accent: B.wheatGold,
    stat: { value: "3.2h", note: "Admin time saved per day" },
  },
  {
    icon: DollarSign,
    tag: "MOD-06",
    label: "Finance",
    title: "Farm Financials",
    description:
      "End-to-end financial visibility — track profits and losses, categorise expenses, forecast revenue and generate auditable reports.",
    benefits: [
      "Profit & loss statements",
      "Expense categorisation engine",
      "Revenue & cash-flow forecasting",
      "Tax-ready financial exports",
    ],
    accent: B.burntOrange,
    stat: { value: "+24%", note: "Average profitability uplift" },
  },
];

// ─── Wheat SVG icon ───────────────────────────────────────────────────────────
const WheatIcon = ({ color = B.wheatGold, size = 14 }) => (
  <svg width={size} height={Math.round(size * 1.4)} viewBox="0 0 14 20" fill="none" aria-hidden>
    <path
      d="M7 19V2M4.5 4.5l2.5-2.5 2.5 2.5M3.5 8l3.5-2.5L10.5 8M3.5 11.5l3.5-2.5 3.5 2.5M4.5 15.5l2.5-2 2.5 2M5 19l2-1.5 2 1.5"
      stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeatureCards() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);   // +1 forward / -1 backward
  const { isDark } = useTheme();

  useEffect(() => {
    if (!autoPlay) return;
    const iv = setInterval(() => {
      setDirection(1);
      setCurrent(p => (p + 1) % features.length);
    }, 5500);
    return () => clearInterval(iv);
  }, [autoPlay]);

  const navigate = (dir) => {
    setAutoPlay(false);
    setDirection(dir === "prev" ? -1 : 1);
    setCurrent(p =>
      dir === "prev"
        ? (p - 1 + features.length) % features.length
        : (p + 1) % features.length
    );
    setTimeout(() => setAutoPlay(true), 12000);
  };

  const getPos = (idx) => {
    const diff = (idx - current + features.length) % features.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === features.length - 1) return "left";
    return "hidden";
  };

  const bg = isDark ? B.darkBg : "#EEE9DF";

  return (
    <div
      id="feature-cards"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden py-24"
      style={{ background: bg }}
    >
      {/* ══ BACKGROUND ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Field-row grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(196,154,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(46,107,46,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(46,107,46,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Green bloom — left */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 700px 500px at 20% 55%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat warmth — right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
        }} />
        {/* Grain */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "160px", mixBlendMode: "overlay",
        }} />
        {/* Left brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 35%, ${B.wheatGold} 65%, transparent)`
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* ══ SECTION HEADER ════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16 space-y-5"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: B.wheatGold }} />
            <WheatIcon />
            <span className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: B.wheatGold, fontFamily: mono }}>
              Complete Farm Management Platform
            </span>
            <WheatIcon />
            <div className="w-6 h-px" style={{ background: B.wheatGold }} />
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: serif,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontSize: "clamp(2.4rem, 7vw, 5rem)",
              color: isDark ? B.cream : "#1A2A1A",
            }}
          >
            Every Tool Your{" "}
            <span style={{ color: B.forestGreen }}>Farm</span>
            <br />
            <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Needs</span>{" "}
            <span style={{ color: isDark ? B.cream : "#1A2A1A" }}>to Thrive.</span>
          </h2>

          {/* Gradient rule */}
          <div className="mx-auto w-24 h-[2px]" style={{
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
          }} />

          <p className="text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: isDark ? B.muted : "#4A5A48", fontFamily: sans, fontWeight: 300 }}>
            Six deeply integrated modules covering every aspect of livestock and
            farm management — built by farmers, for farmers.
          </p>
        </motion.div>

        {/* ══ CAROUSEL ══════════════════════════════════════════════════════ */}
        <div
          className="relative max-w-5xl mx-auto flex items-center justify-center"
          style={{ height: 500, perspective: "1400px" }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const pos = getPos(idx);
            const isCenter = pos === "center";

            const transforms = {
              center: "translateX(0)    scale(1)     rotateY(0deg)",
              right: "translateX(58%)  scale(0.85)  rotateY(-10deg)",
              left: "translateX(-58%) scale(0.85)  rotateY(10deg)",
              hidden: "translateX(0)    scale(0.5)   rotateY(0deg)",
            };

            return (
              <div
                key={idx}
                className="absolute transition-all duration-700"
                style={{
                  width: "100%",
                  maxWidth: 430,
                  zIndex: isCenter ? 30 : pos !== "hidden" ? 20 : 0,
                  opacity: isCenter ? 1 : pos !== "hidden" ? 0.28 : 0,
                  filter: isCenter ? "none" : pos !== "hidden" ? "blur(1.5px)" : "none",
                  transform: transforms[pos] || transforms.hidden,
                  pointerEvents: isCenter ? "auto" : "none",
                  transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                {/* ── CARD ─────────────────────────────────────────────── */}
                <div
                  className="relative overflow-hidden group"
                  style={{
                    background: isDark
                      ? `linear-gradient(160deg, rgba(20,32,20,0.97) 0%, rgba(11,18,11,0.99) 100%)`
                      : `linear-gradient(160deg, rgba(245,240,232,0.97) 0%, rgba(230,224,212,0.99) 100%)`,
                    // Avoid shorthand `border` + `borderTop` conflict — use explicit sides
                    borderTop: `3px solid ${feature.accent}`,
                    borderRight: `1px solid ${isCenter ? feature.accent + "55" : B.cardBorder}`,
                    borderBottom: `1px solid ${isCenter ? feature.accent + "55" : B.cardBorder}`,
                    borderLeft: `1px solid ${isCenter ? feature.accent + "55" : B.cardBorder}`,
                    boxShadow: isCenter
                      ? `0 -2px 30px ${feature.accent}28, 0 30px 80px rgba(0,0,0,0.45)`
                      : "none",
                    transition: "border-color 0.4s, box-shadow 0.4s",
                  }}
                >
                  {/* Accent glow wash at top */}
                  <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none" style={{
                    background: `linear-gradient(180deg, ${feature.accent}10 0%, transparent 100%)`
                  }} />

                  {/* Corner tick marks */}
                  {[
                    "top-0 left-0 border-l border-t",
                    "top-0 right-0 border-r border-t",
                    "bottom-0 left-0 border-l border-b",
                    "bottom-0 right-0 border-r border-b",
                  ].map((cls, ci) => (
                    <div key={ci}
                      className={`absolute ${cls} transition-all duration-300 group-hover:w-4 group-hover:h-4`}
                      style={{ width: 7, height: 7, borderColor: feature.accent + "55" }}
                    />
                  ))}

                  <div className="relative p-7 space-y-5">

                    {/* Header: icon + tag + label */}
                    <div className="flex items-start justify-between pb-4"
                      style={{ borderBottom: `1px solid rgba(196,154,42,0.14)` }}>
                      <div className="flex items-center gap-3">
                        {/* Icon box */}
                        <div className="p-3 flex-shrink-0"
                          style={{
                            background: `${feature.accent}15`,
                            border: `1px solid ${feature.accent}35`,
                          }}>
                          <Icon className="w-5 h-5" style={{ color: feature.accent }} />
                        </div>
                        {/* Label pill */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] uppercase tracking-[0.22em]"
                            style={{ color: feature.accent, fontFamily: mono }}>{feature.label}</span>
                          <span className="text-[8px] uppercase tracking-widest"
                            style={{ color: B.muted, fontFamily: mono }}>{feature.tag}</span>
                        </div>
                      </div>
                      {/* Live stat badge */}
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-base font-bold leading-none"
                          style={{ color: feature.accent, fontFamily: serif }}>{feature.stat.value}</span>
                        <span className="text-[8px] text-right leading-tight max-w-[100px]"
                          style={{ color: B.muted, fontFamily: mono }}>{feature.stat.note}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="leading-tight"
                      style={{
                        fontFamily: serif,
                        fontWeight: 700,
                        fontSize: "1.45rem",
                        letterSpacing: "-0.02em",
                        color: isDark ? B.cream : "#1A2A1A",
                      }}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[12px] leading-relaxed"
                      style={{ color: isDark ? B.offWhite : "#4A5A48", fontFamily: sans, fontWeight: 300 }}>
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2 pt-1">
                      {feature.benefits.map((b, bi) => (
                        <div key={bi} className="flex items-center gap-2.5">
                          {/* Wheat pip */}
                          <svg width="8" height="11" viewBox="0 0 8 11" fill="none" className="flex-shrink-0">
                            <path d="M4 10.5V1.5M2.5 3l1.5-1.5L5.5 3M2 5.5l2-1.5 2 1.5M2 8l2-1.5 2 1.5"
                              stroke={feature.accent} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-[11px] leading-snug"
                            style={{ color: isDark ? B.offWhite : "#3A4A38", fontFamily: sans }}>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full py-3 flex items-center justify-center gap-2 font-semibold text-[10px] uppercase tracking-[0.22em] transition-all duration-300 group/btn"
                      style={
                        isCenter
                          ? {
                            background: feature.accent, color: "#fff", fontFamily: mono,
                            boxShadow: `0 4px 20px ${feature.accent}45`
                          }
                          : {
                            border: `1.5px solid ${feature.accent}45`, color: feature.accent,
                            background: "transparent", fontFamily: mono
                          }
                      }
                      onMouseEnter={e => {
                        if (isCenter) { e.currentTarget.style.opacity = "0.88"; }
                        else { e.currentTarget.style.background = feature.accent + "18"; }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = "1";
                        if (!isCenter) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Explore Module
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Nav arrows ───────────────────────────────────────────────── */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-40 px-1 md:-mx-12">
            {(["prev", "next"]).map((dir) => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                className="pointer-events-auto p-3 transition-all duration-250 flex items-center justify-center"
                style={{
                  border: `1.5px solid rgba(196,154,42,0.35)`,
                  background: isDark ? "rgba(11,18,11,0.85)" : "rgba(230,224,212,0.9)",
                  color: B.wheatGold,
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = B.forestGreen;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = B.forestGreen;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDark ? "rgba(11,18,11,0.85)" : "rgba(230,224,212,0.9)";
                  e.currentTarget.style.color = B.wheatGold;
                  e.currentTarget.style.borderColor = "rgba(196,154,42,0.35)";
                }}
              >
                {dir === "prev"
                  ? <ChevronLeft className="w-5 h-5" />
                  : <ChevronRight className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>

        {/* ══ PAGINATION DOTS ═══════════════════════════════════════════════ */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {features.map((f, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrent(idx); setAutoPlay(false); }}
              className="transition-all duration-350"
              style={{
                height: 3,
                width: current === idx ? 32 : 8,
                background: current === idx
                  ? `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
                  : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
                boxShadow: current === idx ? `0 0 10px ${B.wheatGold}50` : "none",
              }}
              aria-label={`Go to ${f.title}`}
            />
          ))}
        </div>

        {/* ══ MODULE GRID STRIP (below carousel) ════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-12"
        >
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isActive = idx === current;
            return (
              <button
                key={idx}
                onClick={() => { setCurrent(idx); setAutoPlay(false); }}
                className="flex flex-col items-center gap-2 py-3 px-2 transition-all duration-300"
                style={{
                  background: isActive
                    ? `${f.accent}18`
                    : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                  // Avoid shorthand `border` + `borderTop` conflict — use explicit sides
                  borderTop: `2px solid ${isActive ? f.accent : "transparent"}`,
                  borderRight: `1px solid ${isActive ? f.accent + "45" : "rgba(196,154,42,0.12)"}`,
                  borderBottom: `1px solid ${isActive ? f.accent + "45" : "rgba(196,154,42,0.12)"}`,
                  borderLeft: `1px solid ${isActive ? f.accent + "45" : "rgba(196,154,42,0.12)"}`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? f.accent : B.muted }} />
                <span className="text-[9px] uppercase tracking-wider text-center leading-tight"
                  style={{ color: isActive ? f.accent : B.muted, fontFamily: mono }}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
// "use client";
// import React, { useState, useEffect } from "react";
// import { Heart, BarChart3, Bell, Users, ChevronLeft, ChevronRight, Activity, Crosshair, Leaf, DollarSign } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";
// import { motion, AnimatePresence } from "framer-motion";

// const monoStyle = { fontFamily: "var(--font-jetbrains-mono, monospace)" };
// const displayStyle = { fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800, letterSpacing: "-0.03em", textTransform: "uppercase" };
// const bodyStyle = { fontFamily: "var(--font-dm-sans, sans-serif)" };

// export default function FeatureCards() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const { isDark } = useTheme();

//   const features = [
//     {
//       icon: Crosshair,
//       tag: "SYS-MOD-01",
//       title: "Herd Health Tracking",
//       description: "Complete health record management with vaccination schedules and vet appointments",
//       benefits: ["Health record management", "Vaccination schedules", "Veterinary appointments", "Disease tracking"],
//     },
//     {
//       icon: Activity,
//       tag: "SYS-MOD-02",
//       title: "Breeding Intelligence",
//       description: "AI-assisted breeding cycle management and pregnancy status tracking",
//       benefits: ["Breeding cycle tracking", "Pregnancy prediction", "Calving management", "Genetic selection"],
//     },
//     {
//       icon: BarChart3,
//       tag: "SYS-MOD-03",
//       title: "Dairy Analytics",
//       description: "Data-driven insights to optimize milk yield and production performance",
//       benefits: ["Yield tracking", "Performance metrics", "Production forecasting", "Efficiency analysis"],
//     },
//     {
//       icon: Leaf,
//       tag: "SYS-MOD-04",
//       title: "Feed Management",
//       description: "Optimize feed allocation and track nutritional status across your herd",
//       benefits: ["Feed inventory tracking", "Nutritional monitoring", "Automated reorder alerts", "Cost analysis"],
//     },
//     {
//       icon: Users,
//       tag: "SYS-MOD-05",
//       title: "Workforce Tracking",
//       description: "Streamline workforce operations and boost farm productivity",
//       benefits: ["Attendance tracking", "Task assignment", "Performance monitoring", "Payroll integration"],
//     },
//     {
//       icon: DollarSign,
//       tag: "SYS-MOD-06",
//       title: "Farm Financials",
//       description: "Complete financial analytics to maximize your farm's profitability",
//       benefits: ["Profit & loss tracking", "Expense categorization", "Revenue forecasting", "Financial reports"],
//     },
//   ];

//   useEffect(() => {
//     if (!isAutoPlaying) return;
//     const iv = setInterval(() => setCurrentIndex((p) => (p + 1) % features.length), 5000);
//     return () => clearInterval(iv);
//   }, [isAutoPlaying, features.length]);

//   const navigate = (dir) => {
//     setIsAutoPlaying(false);
//     setCurrentIndex((p) => dir === "prev" ? (p - 1 + features.length) % features.length : (p + 1) % features.length);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   const getPos = (idx) => {
//     const diff = (idx - currentIndex + features.length) % features.length;
//     if (diff === 0) return "center";
//     if (diff === 1 || diff === features.length - 1) return diff === 1 ? "right" : "left";
//     return "hidden";
//   };

//   return (
//     <div className={`min-h-screen relative overflow-hidden flex flex-col justify-center py-20 ${isDark ? "bg-[#070708]" : "bg-white"}`}>

//       {/* BACKGROUND */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "" : "opacity-40"}`} />
//         <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 800px 400px at 25% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
//         <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(15deg, transparent, transparent 60px, rgba(34,197,94,0.025) 60px, rgba(34,197,94,0.025) 61px)" }} />
//       </div>

//       <div className="container mx-auto px-4 relative z-10">

//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16 space-y-5"
//         >
//           <div className={`inline-flex items-center gap-2 px-3 py-1 border ${isDark ? "border-green-500/20 bg-green-500/5" : "border-green-600/30 bg-green-600/10"}`}>
//             <Activity className="w-3 h-3 text-green-500" />
//             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-500" style={monoStyle}>
//               Complete Herd Management Platform
//             </span>
//           </div>

//           <h2 className={isDark ? "text-white" : "text-black"} style={{ ...displayStyle, fontSize: "clamp(2.5rem, 7vw, 4.5rem)" }}>
//             Precision{" "}
//             <span className="text-green-600" style={{ color: isDark ? "#22c55e" : "#15803d" }}>
//               Herd Management Tools
//             </span>
//           </h2>

//           <p className={`text-sm max-w-lg mx-auto ${isDark ? "text-neutral-500" : "text-neutral-500"}`} style={monoStyle}>
//             // Modern livestock management for profitable dairy operations.
//           </p>
//         </motion.div>

//         {/* CAROUSEL STAGE */}
//         <div className="relative max-w-5xl mx-auto h-[480px] flex items-center justify-center" style={{ perspective: "1200px" }}>
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             const position = getPos(index);
//             const isCenter = position === "center";

//             return (
//               <div
//                 key={index}
//                 className={`absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCenter ? "z-30 scale-100 opacity-100 translate-x-0" :
//                     position === "right" ? "z-20 scale-[0.87] opacity-30 translate-x-[55%] blur-[1.5px]" :
//                       position === "left" ? "z-20 scale-[0.87] opacity-30 -translate-x-[55%] blur-[1.5px]" :
//                         "z-0 scale-50 opacity-0 pointer-events-none"
//                   }`}
//                 style={{ width: "100%", maxWidth: "420px" }}
//               >
//                 {/* CARD */}
//                 <div
//                   className={`relative overflow-hidden group ${isDark
//                       ? "bg-[#0d0d0f] border border-white/8"
//                       : "bg-white border border-neutral-200"
//                     }`}
//                   style={
//                     isCenter
//                       ? {
//                         borderTop: "2px solid #22c55e",
//                         boxShadow: isDark
//                           ? "0 -4px 20px rgba(34,197,94,0.3), 0 0 60px -15px rgba(34,197,94,0.35)"
//                           : "0 -4px 20px rgba(34,197,94,0.2), 0 0 40px -10px rgba(34,197,94,0.2)",
//                       }
//                       : {}
//                   }
//                 >
//                   {/* Top green gradient wash */}
//                   <div
//                     className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
//                     style={{ background: "linear-gradient(180deg, rgba(34,197,94,0.04) 0%, transparent 100%)" }}
//                   />

//                   {/* Corner accents — animate on hover */}
//                   {["top-0 left-0 border-l border-t", "top-0 right-0 border-r border-t", "bottom-0 left-0 border-l border-b", "bottom-0 right-0 border-r border-b"].map((cls, ci) => (
//                     <div
//                       key={ci}
//                       className={`absolute ${cls} border-green-500/50 transition-all duration-200 group-hover:w-3.5 group-hover:h-3.5`}
//                       style={{ width: "6px", height: "6px" }}
//                     />
//                   ))}

//                   <div className={`p-6 space-y-5 relative ${isDark ? "bg-neutral-950/30" : "bg-white/50"}`}>

//                     {/* Header row */}
//                     <div className={`flex justify-between items-start border-b pb-4 ${isDark ? "border-white/5" : "border-neutral-200"}`}>
//                       <div className={`p-3 border ${isDark ? "bg-green-500/10 border-green-500/25" : "bg-green-50 border-green-200"}`}>
//                         <Icon className="w-6 h-6 text-green-400" />
//                       </div>
//                       <span className="text-[8px] text-neutral-500" style={monoStyle}>{feature.tag}</span>
//                     </div>

//                     {/* Title + desc */}
//                     <div className="space-y-2">
//                       <h3 className={isDark ? "text-white" : "text-black"} style={{ ...displayStyle, fontSize: "1.4rem" }}>
//                         {feature.title}
//                       </h3>
//                       <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`} style={monoStyle}>
//                         {feature.description}
//                       </p>
//                     </div>

//                     {/* Benefits with ▸ bullets */}
//                     <div className="space-y-2">
//                       {feature.benefits.map((b, bi) => (
//                         <div key={bi} className="flex items-center gap-3">
//                           <span className="text-green-500 text-[11px] flex-shrink-0" style={monoStyle}>▸</span>
//                           <span className={`text-[11px] uppercase tracking-wider font-medium ${isDark ? "text-neutral-300" : "text-neutral-600"}`} style={bodyStyle}>
//                             {b}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* CTA */}
//                     <button
//                       className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${isCenter
//                           ? "bg-green-600 text-white hover:bg-green-500"
//                           : isDark
//                             ? "border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black"
//                             : "border border-green-600/40 text-green-700 hover:bg-green-600 hover:text-white"
//                         }`}
//                     >
//                       See In Action
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Nav controls */}
//           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-0 md:-mx-14 pointer-events-none z-40">
//             {["prev", "next"].map((dir) => (
//               <button
//                 key={dir}
//                 onClick={() => navigate(dir)}
//                 className={`pointer-events-auto p-3 rounded-full border backdrop-blur-sm transition-all ${isDark
//                     ? "border-white/10 bg-neutral-900/50 text-white hover:bg-green-500 hover:text-black hover:border-green-500"
//                     : "border-neutral-300 bg-white/70 text-black hover:bg-green-500 hover:text-white hover:border-green-500"
//                   }`}
//               >
//                 {dir === "prev" ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Pagination dots */}
//         <div className="flex justify-center items-center gap-2 mt-12">
//           {features.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); }}
//               className={`h-1 rounded-sm transition-all duration-300 ${currentIndex === idx
//                   ? "w-8 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
//                   : isDark ? "w-2 bg-neutral-800 hover:bg-neutral-600" : "w-2 bg-neutral-300 hover:bg-neutral-400"
//                 }`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }