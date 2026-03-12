"use client";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ─── HerdERP Brand Tokens ─────────────────────────────────────────────────────
const B = {
  forestGreen:  "#2E6B2E",
  lightGreen:   "#3A8C3A",
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

// ─── Testimonial data ─────────────────────────────────────────────────────────
// Each gets an accent color cycling through the brand palette
const accents = [B.forestGreen, B.wheatGold, B.burntOrange];

const testimonials = [
  {
    farm:  "Green Acres Ranch",
    state: "Punjab, PK",
    quote: "HerdERP transformed how I manage my 800-head cattle operation. Milk yield is up 43% in just six months — the data doesn't lie.",
    name:  "James Harrington",
    role:  "Ranch Owner",
    img:   "/Images/Profile Images/p1.webp",
    stat:  { value: "+43%", label: "Yield increase" },
    stars: 5,
  },
  {
    farm:  "Meadowbrook Dairy",
    state: "Sindh, PK",
    quote: "The breeding intelligence module is outstanding. We've reduced breeding costs by 30% and improved conception rates significantly.",
    name:  "Sarah Mitchell",
    role:  "Dairy Farm Manager",
    img:   "/Images/Profile Images/p2.webp",
    stat:  { value: "−30%", label: "Breeding costs" },
    stars: 5,
  },
  {
    farm:  "Hillside Livestock",
    state: "KPK, PK",
    quote: "Real-time health monitoring saved us from a disease outbreak that could have cost us thousands. Absolutely essential tool.",
    name:  "Carlos Rodriguez",
    role:  "Livestock Specialist",
    img:   "/Images/Profile Images/p3.webp",
    stat:  { value: "100%", label: "Outbreak avoided" },
    stars: 5,
  },
  {
    farm:  "Sunfield Farm",
    state: "Balochistan, PK",
    quote: "Went from spreadsheets to a full ERP in under an hour. The onboarding is incredibly smooth and the support is excellent.",
    name:  "Emma Thompson",
    role:  "Small Farm Owner",
    img:   "/Images/Profile Images/p4.webp",
    stat:  { value: "<1hr", label: "Onboarding time" },
    stars: 5,
  },
  {
    farm:  "Canyon Ridge Ranch",
    state: "AJK, PK",
    quote: "The financial reports alone are worth the subscription. We finally understand exactly where every rupee goes on our ranch.",
    name:  "David Okafor",
    role:  "Farm Accountant",
    img:   "/Images/Profile Images/p5.webp",
    stat:  { value: "+24%", label: "Profit margin" },
    stars: 5,
  },
  {
    farm:  "Northern Pastures",
    state: "Gilgit, PK",
    quote: "Our vet team loves the health records system. Everything is organised and accessible from any device, anywhere on the farm.",
    name:  "Fatima Al-Hassan",
    role:  "Veterinary Manager",
    img:   "/Images/Profile Images/p6.webp",
    stat:  { value: "97%", label: "Records accuracy" },
    stars: 5,
  },
];

// Triplicate for seamless loop
const col1 = [...testimonials, ...testimonials, ...testimonials];
const col2 = [...[...testimonials].reverse(), ...[...testimonials].reverse(), ...[...testimonials].reverse()];
const col3 = [...testimonials.slice(2), ...testimonials.slice(2), ...testimonials.slice(2)];

// ─── Card ─────────────────────────────────────────────────────────────────────
function TestimonialCard({ t, isDark, accentColor }) {
  return (
    <div
      className="group relative mb-4 overflow-hidden transition-all duration-350"
      style={{
        background:  isDark
          ? "linear-gradient(160deg, rgba(20,32,20,0.95) 0%, rgba(11,18,11,0.98) 100%)"
          : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(235,229,217,0.98) 100%)",
        border:      `1px solid rgba(196,154,42,0.15)`,
        borderLeft:  `3px solid ${accentColor}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accentColor}55`;
        e.currentTarget.style.borderLeftColor = accentColor;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(196,154,42,0.15)";
        e.currentTarget.style.borderLeftColor = accentColor;
      }}
    >
      {/* Subtle top accent wash */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{
        background: `linear-gradient(180deg, ${accentColor}0D 0%, transparent 100%)`
      }} />

      <div className="relative p-5">

        {/* Header: farm name + stars */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.22em] mb-0.5"
              style={{ color: accentColor, fontFamily: mono }}>
              {t.farm}
            </div>
            <div className="text-[8px] uppercase tracking-wider"
              style={{ color: B.muted, fontFamily: mono }}>
              {t.state}
            </div>
          </div>
          {/* Star rating */}
          <div className="flex gap-0.5">
            {Array.from({ length: t.stars }).map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-current" style={{ color: B.wheatGold }} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3" style={{ height: 1, background: `rgba(196,154,42,0.15)` }} />

        {/* Quote mark — brand styled */}
        <div className="mb-2 leading-none"
          style={{ fontFamily: serif, fontSize: "2.5rem", lineHeight: 1, color: accentColor, opacity: 0.35 }}>
          "
        </div>

        {/* Quote text */}
        <p className="text-[12px] leading-relaxed mb-4 italic"
          style={{ color: isDark ? B.offWhite : "#3A4A38", fontFamily: sans, fontWeight: 300 }}>
          {t.quote}
        </p>

        {/* Stat pill */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4"
          style={{
            background: `${accentColor}12`,
            border:     `1px solid ${accentColor}35`,
          }}>
          <span className="text-sm font-bold leading-none"
            style={{ color: accentColor, fontFamily: serif }}>{t.stat.value}</span>
          <span className="text-[8px] uppercase tracking-widest"
            style={{ color: B.muted, fontFamily: mono }}>{t.stat.label}</span>
        </div>

        {/* Author row */}
        <div className="flex items-center gap-3">
          {/* Avatar with brand corner ticks */}
          <div className="relative flex-shrink-0">
            <img
              src={t.img}
              alt={t.name}
              className="w-10 h-10 object-cover"
              style={{ filter: "grayscale(40%) brightness(0.9)" }}
              onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%) brightness(1)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(40%) brightness(0.9)")}
            />
            {/* Corner ticks — brand colors */}
            <div className="absolute top-0 left-0 w-2 h-2"
              style={{ borderLeft: `1.5px solid ${B.forestGreen}`, borderTop: `1.5px solid ${B.forestGreen}` }} />
            <div className="absolute bottom-0 right-0 w-2 h-2"
              style={{ borderRight: `1.5px solid ${B.wheatGold}`, borderBottom: `1.5px solid ${B.wheatGold}` }} />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider leading-none mb-0.5"
              style={{ color: isDark ? B.cream : "#1A2A1A", fontFamily: serif }}>
              {t.name}
            </p>
            <p className="text-[9px] uppercase tracking-wider"
              style={{ color: B.muted, fontFamily: mono }}>
              {t.role}
            </p>
          </div>

          {/* Verified badge — right */}
          <div className="ml-auto flex items-center gap-1 px-2 py-0.5"
            style={{
              background: `${B.forestGreen}12`,
              border: `1px solid ${B.forestGreen}30`,
            }}>
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: B.forestGreen }} />
            <span className="text-[7px] uppercase tracking-widest"
              style={{ color: B.forestGreen, fontFamily: mono }}>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const { isDark } = useTheme();

  const pageBg   = isDark ? B.darkBg   : "#EEE9DF";
  const textMain = isDark ? B.cream    : "#1A2A1A";

  const cols      = [col1, col2, col3];
  const durations = ["38s", "48s", "43s"];
  const dirs      = ["up", "down", "up"];

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: pageBg }}
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
        {/* Green bloom left */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 700px 500px at 15% 50%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat gold warmth right */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
        }} />
        {/* Grain */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "160px", mixBlendMode: "overlay",
        }} />
        {/* Left brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        {/* ══ SECTION HEADER ════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-8"
        >
          {/* Left: headline */}
          <div className="space-y-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: B.wheatGold }} />
              <WheatIcon />
              <span className="text-[10px] uppercase tracking-[0.26em]"
                style={{ color: B.wheatGold, fontFamily: mono }}>
                Real Farmers, Real Results
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: serif,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
              color: textMain,
            }}>
              Trusted By<br />
              <span style={{ color: B.forestGreen }}>Livestock</span>{" "}
              <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Farmers.</span>
            </h2>

            {/* Rule */}
            <div style={{
              height: 2, width: 80,
              background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
            }} />
          </div>

          {/* Right: satisfaction stats box */}
          <div
            className="flex-shrink-0"
            style={{
              background:  isDark
                ? "linear-gradient(160deg, rgba(20,32,20,0.95) 0%, rgba(11,18,11,0.98) 100%)"
                : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(235,229,217,0.98) 100%)",
              border:      `1px solid rgba(196,154,42,0.22)`,
              borderTop:   `3px solid ${B.wheatGold}`,
            }}
          >
            {/* Top brand bar */}
            <div style={{ height: 0 }} />

            <div className="flex divide-x p-5 gap-0"
              style={{ divideColor: "rgba(196,154,42,0.15)" }}>
              {[
                { value: "98.4%", label: "Satisfaction rate",  accent: B.forestGreen  },
                { value: "99.1%", label: "Annual retention",   accent: B.wheatGold    },
                { value: "1,200+",label: "Active farms",       accent: B.burntOrange  },
              ].map(({ value, label, accent }, i) => (
                <div key={label} className={`flex flex-col gap-1 ${i > 0 ? "pl-5" : ""} ${i < 2 ? "pr-5" : ""}`}
                  style={{ borderColor: "rgba(196,154,42,0.15)" }}>
                  <span className="text-[2rem] font-bold leading-none tracking-tight"
                    style={{ color: accent, fontFamily: serif }}>
                    {value}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest"
                    style={{ color: B.muted, fontFamily: mono }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom "live" bar */}
            <div className="flex items-center gap-2 px-5 py-2"
              style={{ borderTop: "1px solid rgba(196,154,42,0.12)" }}>
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80"
                  style={{ background: B.forestGreen }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: B.forestGreen }} />
              </span>
              <span className="text-[8px] uppercase tracking-widest"
                style={{ color: B.forestGreen, fontFamily: mono }}>
                Live reviews — updated daily
              </span>
            </div>
          </div>
        </motion.div>

        {/* ══ MARQUEE COLUMNS ════════════════════════════════════════════════ */}
        <div className="relative h-[680px] overflow-hidden">

          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${pageBg}, transparent)` }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${pageBg}, transparent)` }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">

            {/* Desktop: 3 columns */}
            {cols.map((col, ci) => (
              <div
                key={ci}
                className={`overflow-hidden h-full ${ci === 0 ? "block" : "hidden md:block"}`}
              >
                <div
                  className={dirs[ci] === "up" ? "animate-scroll-up" : "animate-scroll-down"}
                  style={{ animationDuration: durations[ci] }}
                  onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
                  onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
                >
                  {col.map((t, ti) => (
                    <TestimonialCard
                      key={ti}
                      t={t}
                      isDark={isDark}
                      accentColor={accents[ti % accents.length]}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile: single column */}
            <div className="md:hidden overflow-hidden h-full">
              <div
                className="animate-scroll-up"
                style={{ animationDuration: "42s" }}
              >
                {col1.map((t, ti) => (
                  <TestimonialCard
                    key={ti}
                    t={t}
                    isDark={isDark}
                    accentColor={accents[ti % accents.length]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// "use client";
// import { useTheme } from "@/context/ThemeContext";
// import { motion } from "framer-motion";

// const monoStyle = { fontFamily: "var(--font-jetbrains-mono, monospace)" };
// const displayStyle = { fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800, letterSpacing: "-0.03em", textTransform: "uppercase" };
// const bodyStyle = { fontFamily: "var(--font-dm-sans, sans-serif)" };

// const testimonials = [
//   { farm: "FARM-A102", quote: "HerdERP transformed how I manage my 800-head cattle operation. Milk yield up 43% in just 6 months.", name: "James Harrington", role: "Ranch Owner", img: "/Images/Profile Images/p1.webp" },
//   { farm: "FARM-B047", quote: "The breeding intelligence module is outstanding. We've reduced breeding costs by 30% and improved conception rates significantly.", name: "Sarah Mitchell", role: "Dairy Farm Manager", img: "/Images/Profile Images/p2.webp" },
//   { farm: "FARM-C201", quote: "Real-time health monitoring saved us from a disease outbreak that could have cost us thousands. Absolutely essential.", name: "Carlos Rodriguez", role: "Livestock Specialist", img: "/Images/Profile Images/p3.webp" },
//   { farm: "FARM-D089", quote: "Went from spreadsheets to a full ERP in under an hour. The onboarding is incredibly smooth.", name: "Emma Thompson", role: "Small Farm Owner", img: "/Images/Profile Images/p4.webp" },
//   { farm: "FARM-E312", quote: "The financial reports alone are worth the subscription. Finally understand where every dollar goes on our ranch.", name: "David Okafor", role: "Farm Accountant", img: "/Images/Profile Images/p5.webp" },
//   { farm: "FARM-F114", quote: "Our vet team loves the health records system. Everything is organized and accessible from any device.", name: "Fatima Al-Hassan", role: "Veterinary Manager", img: "/Images/Profile Images/p6.webp" },
// ];

// // Triplicate for seamless infinite loops
// const col1 = [...testimonials, ...testimonials, ...testimonials];
// const col2 = [...[...testimonials].reverse(), ...[...testimonials].reverse(), ...[...testimonials].reverse()];
// const col3 = [...testimonials.slice(2), ...testimonials.slice(2), ...testimonials.slice(2)];

// function TestimonialCard({ t, isDark }) {
//   return (
//     <div
//       className={`group relative p-5 border mb-4 transition-all duration-300 ${isDark
//           ? "bg-[#0d0d0f] border-white/7 hover:border-green-500/25"
//           : "bg-white border-neutral-200 hover:border-green-400/40 shadow-sm"
//         }`}
//     >
//       {/* FARM ID */}
//       <div className="flex justify-between items-start mb-4">
//         <span className="text-[9px] text-green-500/65" style={monoStyle}>[{t.farm}] // VERIFIED</span>
//         <span className="text-neutral-600 group-hover:text-green-500 text-lg transition-colors">"</span>
//       </div>

//       {/* Quote */}
//       <p className={`text-sm font-light italic leading-relaxed mb-4 ${isDark ? "text-neutral-300" : "text-neutral-700"}`} style={bodyStyle}>
//         "{t.quote}"
//       </p>

//       {/* User */}
//       <div className="flex items-center gap-3">
//         <div className="relative flex-shrink-0">
//           <img
//             src={t.img || "/Images/Profile Images/p1.webp"}
//             alt={t.name}
//             className="w-10 h-10 object-cover transition-all duration-500 group-hover:grayscale-0"
//             style={{ filter: "grayscale(100%) contrast(1.25)" }}
//             onMouseEnter={(e) => (e.target.style.filter = "none")}
//             onMouseLeave={(e) => (e.target.style.filter = "grayscale(100%) contrast(1.25)")}
//           />
//           {/* Corner accents on avatar */}
//           <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-green-500/60" />
//           <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-green-500/60" />
//         </div>
//         <div>
//           <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-black"}`} style={{ ...displayStyle, fontSize: "0.7rem" }}>
//             {t.name}
//           </p>
//           <p className="text-[9px] text-neutral-500" style={monoStyle}>{t.role}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Testimonials() {
//   const { isDark } = useTheme();
//   const cols = [col1, col2, col3];
//   const durations = ["35s", "45s", "40s"];
//   const directions = ["up", "down", "up"];

//   return (
//     <section className={`relative py-32 overflow-hidden ${isDark ? "bg-[#070708]" : "bg-[#ede9e3]"}`}>

//       {/* Background */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "" : "opacity-40"}`} />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 relative z-10">

//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16"
//         >
//           <h2 className={isDark ? "text-white" : "text-neutral-900"} style={{ ...displayStyle, fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
//             Trusted By{" "}
//             <span style={{ color: isDark ? "#22c55e" : "#15803d", textShadow: "0 0 40px rgba(34,197,94,0.35)" }}>
//               Livestock<br />Farmers.
//             </span>
//           </h2>

//           {/* Stats */}
//           <div className={`mt-6 md:mt-0 p-5 border ${isDark ? "border-white/8 bg-[#0d0d0f]" : "border-neutral-300 bg-white shadow-sm"}`}>
//             <div className="flex gap-6">
//               <div>
//                 <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}>98.4%</div>
//                 <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1" style={monoStyle}>Satisfaction</div>
//               </div>
//               <div className={`w-px ${isDark ? "bg-white/5" : "bg-neutral-200"}`} />
//               <div>
//                 <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`} style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}>99.1%</div>
//                 <div className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1" style={monoStyle}>Retention</div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* MARQUEE COLUMNS */}
//         <div className="relative h-[680px] overflow-hidden">
//           {/* Top fade */}
//           <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none"
//             style={{ background: `linear-gradient(to bottom, ${isDark ? "#070708" : "#ede9e3"}, transparent)` }} />
//           {/* Bottom fade */}
//           <div className="absolute bottom-0 left-0 right-0 h-20 z-20 pointer-events-none"
//             style={{ background: `linear-gradient(to top, ${isDark ? "#070708" : "#ede9e3"}, transparent)` }} />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
//             {cols.map((col, ci) => (
//               <div
//                 key={ci}
//                 className="overflow-hidden h-full hidden md:block"
//                 style={{ display: ci === 0 ? "block" : undefined }}
//               >
//                 <div
//                   className={`${directions[ci] === "up" ? "animate-scroll-up" : "animate-scroll-down"}`}
//                   style={{ animationDuration: durations[ci] }}
//                   onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
//                   onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
//                 >
//                   {col.map((t, ti) => (
//                     <TestimonialCard key={ti} t={t} isDark={isDark} img />
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* Mobile: single column */}
//             <div className="md:hidden overflow-hidden h-full">
//               <div
//                 className="animate-scroll-up"
//                 style={{ animationDuration: "40s" }}
//               >
//                 {col1.map((t, ti) => (
//                   <TestimonialCard key={ti} t={t} isDark={isDark} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }