"use client";
import { useState } from "react";
import { Globe, BookOpen, ShieldCheck, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const B = {
  forestGreen: "#2E6B2E",
  lightGreen:  "#3A8C3A",
  deepGreen:   "#1D4A1D",
  wheatGold:   "#C49A2A",
  burntOrange: "#C4601A",
  cream:       "#F5F0E8",
  offWhite:    "#DDD7CA",
  muted:       "#7A8870",
  darkBg:      "#0B120B",
  footerBg:    "#070D07",
};

const serif = "var(--font-display)";
const sans  = "var(--font-body)";
const mono  = "var(--font-mono)";

// ─── Wheat SVG ────────────────────────────────────────────────────────────────
const Wheat = ({ color = B.wheatGold, size = 13 }) => (
  <svg width={size} height={Math.round(size * 1.54)} viewBox="0 0 13 20" fill="none" aria-hidden>
    <path
      d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
      stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ─── Nav columns ──────────────────────────────────────────────────────────────
const navCols = [
  {
    label: "Platform",
    accent: B.forestGreen,
    links: [
      { name: "Features",      href: "#feature-cards" },
      { name: "Pricing Plans", href: "#pricing"       },
      { name: "Integrations",  href: "#"              },
      { name: "API Docs",      href: "#"              },
      { name: "System Status", href: "#"              },
    ],
  },
  {
    label: "Solutions",
    accent: B.wheatGold,
    links: [
      { name: "Herd Management", href: "#" },
      { name: "Farm Analytics",  href: "#" },
      { name: "Milk Tracking",   href: "#" },
      { name: "Health Records",  href: "#" },
      { name: "Feed Management", href: "#" },
    ],
  },
  {
    label: "Support",
    accent: B.burntOrange,
    links: [
      { name: "Contact Support", href: "#footer" },
      { name: "Documentation",   href: "#"       },
      { name: "What's New",      href: "#"       },
      { name: "Resources",       href: "#"       },
      { name: "Security",        href: "#"       },
    ],
  },
];

const contacts = [
  { icon: MapPin, text: "Rawalpindi, Punjab, Pakistan" },
  { icon: Phone,  text: "+92 300 000 0000"             },
  { icon: Mail,   text: "hello@herderp.io"             },
];

const socials = [Globe, BookOpen, ShieldCheck];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = () => { if (email.trim()) setSubmitted(true); };

  return (
    <footer id="footer" className="relative overflow-hidden" style={{ background: B.footerBg }}>

      {/* ══ BACKGROUND ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm field grid */}
        <div className="absolute inset-0" style={{
          backgroundImage:
            "linear-gradient(rgba(196,154,42,0.03) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(196,154,42,0.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Green atmospheric bloom — bottom centre */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px]" style={{
          background: "radial-gradient(ellipse at bottom, rgba(46,107,46,0.09) 0%, transparent 68%)"
        }} />
        {/* Wheat warmth — top right */}
        <div className="absolute top-0 right-0 w-[400px] h-[280px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.05) 0%, transparent 65%)"
        }} />
        {/* Left brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
        }} />
      </div>

      {/* ══ 3-COLOUR TOP DIVIDER ══════════════════════════════════════════════ */}
      <div className="w-full h-[3px]" style={{
        background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 pt-16">

        {/* ══ MAIN GRID ═════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14"
          style={{ borderBottom: `1px solid rgba(196,154,42,0.12)` }}>

          {/* ── Brand column ── */}
          <div className="space-y-6">
            {/* Logo */}
            <Image
              src="/erp-logo.png"
              alt="HerdERP"
              width={80}
              height={80}
              className=" w-auto object-contain"
            />

            {/* Tagline */}
            <p className="text-[12px] font-light leading-relaxed"
              style={{ color: B.muted, fontFamily: sans }}>
              Precision livestock management ERP built for modern farming operations.
              Track health, optimise yield and grow smarter — season after season.
            </p>

            {/* Contact details */}
            <div className="space-y-2.5">
              {contacts.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: B.wheatGold }} />
                  <span className="text-[10px]"
                    style={{ color: B.muted, fontFamily: mono }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social icon buttons */}
            <div className="flex gap-2">
              {socials.map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 flex items-center justify-center transition-all duration-250"
                  style={{
                    border:     `1px solid rgba(196,154,42,0.22)`,
                    background: "rgba(255,255,255,0.02)",
                    color:      B.muted,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background  = B.forestGreen;
                    e.currentTarget.style.color       = "#fff";
                    e.currentTarget.style.borderColor = B.forestGreen;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.color       = B.muted;
                    e.currentTarget.style.borderColor = "rgba(196,154,42,0.22)";
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {navCols.map((col) => (
            <div key={col.label} className="space-y-5">

              {/* Heading */}
              <div className="flex items-center gap-2">
                <Wheat color={col.accent} size={10} />
                <h3 className="text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: col.accent, fontFamily: mono }}>
                  {col.label}
                </h3>
              </div>

              {/* Accent rule */}
              <div style={{ height: 1, background: `${col.accent}28` }} />

              {/* Links */}
              <ul className="space-y-3">
                {col.links.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 transition-colors duration-200"
                      style={{ color: B.muted, fontFamily: mono, fontSize: 10.5, letterSpacing: "0.1em" }}
                      onMouseEnter={e => (e.currentTarget.style.color = col.accent)}
                      onMouseLeave={e => (e.currentTarget.style.color = B.muted)}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <Wheat color={col.accent} size={7} />
                      </span>
                      <span className="uppercase tracking-wider">{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ══ NEWSLETTER BANNER ═════════════════════════════════════════════ */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-12"
          style={{ borderBottom: `1px solid rgba(196,154,42,0.12)` }}
        >
          {/* Left copy */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Wheat />
              <span className="text-[9px] uppercase tracking-[0.26em]"
                style={{ color: B.wheatGold, fontFamily: mono }}>
                Farm Intelligence Newsletter
              </span>
            </div>
            <h3 style={{
              fontFamily: serif, fontWeight: 700,
              fontSize: "1.4rem", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: B.cream,
            }}>
              Built for Farmers.{" "}
              <span style={{ color: B.forestGreen }}>Trusted</span>{" "}
              <span style={{ color: B.burntOrange, fontStyle: "italic" }}>in the Field.</span>
            </h3>
            <p className="text-[11px] font-light"
              style={{ color: B.muted, fontFamily: sans }}>
              Monthly agri-tech insights, product updates and seasonal farm tips.
            </p>
          </div>

          {/* Email input */}
          <div className="w-full md:w-[400px] flex-shrink-0">
            {submitted ? (
              <div className="flex items-center gap-3 px-5 py-4"
                style={{
                  background:  "rgba(46,107,46,0.12)",
                  border:      `1px solid rgba(46,107,46,0.38)`,
                  borderLeft:  `3px solid ${B.forestGreen}`,
                }}>
                <Wheat color={B.forestGreen} />
                <span className="text-[11px]"
                  style={{ color: B.forestGreen, fontFamily: mono }}>
                  You're subscribed — welcome to the HerdERP community.
                </span>
              </div>
            ) : (
              <div className="flex"
                style={{ border: `1px solid rgba(196,154,42,0.28)`, background: "rgba(255,255,255,0.02)" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent px-4 py-3.5 text-[11px] outline-none"
                  style={{ color: B.cream, fontFamily: mono, caretColor: B.wheatGold }}
                />
                <button
                  onClick={handleSubscribe}
                  className="flex items-center gap-1.5 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest flex-shrink-0 transition-all duration-250"
                  style={{ background: B.forestGreen, color: "#fff", fontFamily: mono }}
                  onMouseEnter={e => (e.currentTarget.style.background = B.lightGreen)}
                  onMouseLeave={e => (e.currentTarget.style.background = B.forestGreen)}
                >
                  Subscribe <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ STATUS / LEGAL BAR ════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">

          {/* Left: system status */}
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: B.forestGreen }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: B.forestGreen }} />
              </span>
              <span className="text-[9px] uppercase tracking-widest"
                style={{ color: B.muted, fontFamily: mono }}>
                Systems{" "}
                <span style={{ color: B.forestGreen }}>Operational</span>
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest hidden sm:block"
              style={{ color: "rgba(122,136,112,0.4)", fontFamily: mono }}>
              Latency · 8ms
            </span>
            <span className="text-[9px] uppercase tracking-widest hidden sm:block"
              style={{ color: "rgba(122,136,112,0.4)", fontFamily: mono }}>
              HerdERP v4.2
            </span>
          </div>

          {/* Right: legal links */}
          <div className="flex items-center gap-1">
            {["Privacy", "Terms", "Compliance"].map((item, i) => (
              <span key={item} className="flex items-center">
                {i > 0 && (
                  <span className="mx-2" style={{ color: "rgba(196,154,42,0.18)", fontSize: 8 }}>·</span>
                )}
                <button
                  className="text-[9px] uppercase tracking-widest transition-colors duration-200"
                  style={{ color: "rgba(122,136,112,0.5)", fontFamily: mono }}
                  onMouseEnter={e => (e.currentTarget.style.color = B.wheatGold)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(122,136,112,0.5)")}
                >
                  {item}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ══ COPYRIGHT ═════════════════════════════════════════════════════ */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4"
          style={{ borderTop: `1px solid rgba(196,154,42,0.1)` }}
        >
          <p className="text-[9px] uppercase tracking-widest"
            style={{ color: "rgba(122,136,112,0.38)", fontFamily: mono }}>
            © {new Date().getFullYear()} HerdERP · All rights reserved
          </p>
          <div className="flex items-center gap-2">
            <Wheat color="rgba(196,154,42,0.22)" size={8} />
            <span className="text-[9px] uppercase tracking-widest"
              style={{ color: "rgba(122,136,112,0.28)", fontFamily: mono }}>
              Grown with care for farmers worldwide
            </span>
            <Wheat color="rgba(196,154,42,0.22)" size={8} />
          </div>
        </div>
      </div>

      {/* ══ GHOST WATERMARK ══════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none select-none absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden"
        style={{ height: 130 }}
        aria-hidden
      >
        <span
          className="font-bold leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontFamily: serif,
            fontSize: "clamp(5rem, 14vw, 9rem)",
            color: B.wheatGold,
            opacity: 0.022,
            transform: "translateY(32%)",
          }}
        >
          HerdERP
        </span>
      </div>
    </footer>
  );
}
// "use client";
// import { useState } from "react";
// import { Globe, BookOpen, ShieldCheck, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// // ─── HerdERP Brand Tokens ─────────────────────────────────────────────────────
// const B = {
//   forestGreen:  "#2E6B2E",
//   lightGreen:   "#3A8C3A",
//   deepGreen:    "#1D4A1D",
//   wheatGold:    "#C49A2A",
//   burntOrange:  "#C4601A",
//   cream:        "#F5F0E8",
//   offWhite:     "#DDD7CA",
//   muted:        "#7A8870",
//   darkBg:       "#0B120B",
//   footerBg:     "#080E08",
//   cardDark:     "#0D170D",
// };

// const serif = "var(--font-display)";
// const sans  = "var(--font-body)";
// const mono  = "var(--font-mono)";

// // ─── Wheat SVG ────────────────────────────────────────────────────────────────
// const WheatSVG = ({ color = B.wheatGold, size = 13 }) => (
//   <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 13 20" fill="none" aria-hidden>
//     <path
//       d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
//       stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
//     />
//   </svg>
// );

// // ─── Nav columns ─────────────────────────────────────────────────────────────
// const navCols = [
//   {
//     label: "Platform",
//     accent: B.forestGreen,
//     links: [
//       { name: "Features",       href: "#feature-cards" },
//       { name: "Pricing Plans",  href: "#pricing"       },
//       { name: "Integrations",   href: "#"              },
//       { name: "API Access",     href: "#"              },
//       { name: "System Status",  href: "#"              },
//     ],
//   },
//   {
//     label: "Solutions",
//     accent: B.wheatGold,
//     links: [
//       { name: "Herd Management",  href: "#" },
//       { name: "Farm Analytics",   href: "#" },
//       { name: "Milk Tracking",    href: "#" },
//       { name: "Health Records",   href: "#" },
//       { name: "Feed Management",  href: "#" },
//     ],
//   },
//   {
//     label: "Support",
//     accent: B.burntOrange,
//     links: [
//       { name: "Contact Support",  href: "#footer"    },
//       { name: "Documentation",    href: "#"          },
//       { name: "What's New",       href: "#"          },
//       { name: "Resources",        href: "#"          },
//       { name: "Security",         href: "#"          },
//     ],
//   },
// ];

// // ─── Social icon buttons ──────────────────────────────────────────────────────
// const socials = [
//   { icon: Globe,        label: "Website"  },
//   { icon: BookOpen,     label: "Docs"     },
//   { icon: ShieldCheck,  label: "Security" },
// ];

// // ─── Contact items ────────────────────────────────────────────────────────────
// const contacts = [
//   { icon: MapPin, text: "Rawalpindi, Punjab, Pakistan" },
//   { icon: Phone,  text: "+92 300 000 0000"             },
//   { icon: Mail,   text: "hello@herderp.io"              },
// ];

// export default function Footer() {
//   const [email,     setEmail]     = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = () => {
//     if (email.trim()) { setSubmitted(true); }
//   };

//   return (
//     <footer
//       id="footer"
//       className="relative overflow-hidden"
//       style={{ background: B.footerBg }}
//     >
//       {/* ══ BACKGROUND ════════════════════════════════════════════════════════ */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Field grid — very subtle */}
//         <div className="absolute inset-0" style={{
//           backgroundImage: "linear-gradient(rgba(196,154,42,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.03) 1px,transparent 1px)",
//           backgroundSize: "48px 48px",
//         }} />
//         {/* Green bloom — centre */}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{
//           background: "radial-gradient(ellipse at bottom, rgba(46,107,46,0.09) 0%, transparent 68%)"
//         }} />
//         {/* Wheat warmth — top right */}
//         <div className="absolute top-0 right-0 w-[400px] h-[300px]" style={{
//           background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.05) 0%, transparent 65%)"
//         }} />
//         {/* Left brand stripe */}
//         <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
//           background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
//         }} />
//       </div>

//       {/* ══ TOP BRAND DIVIDER ═════════════════════════════════════════════════ */}
//       <div className="w-full h-[3px]" style={{
//         background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
//       }} />

//       <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 pt-16 pb-0">

//         {/* ══ NEWSLETTER BANNER ═════════════════════════════════════════════ */}
//         <div
//           className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 mb-16"
//           style={{
//             background:  `linear-gradient(135deg, rgba(46,107,46,0.14) 0%, rgba(11,18,11,0.9) 100%)`,
//             border:      `1px solid rgba(196,154,42,0.2)`,
//             borderLeft:  `3px solid ${B.forestGreen}`,
//           }}
//         >
//           {/* Left text */}
//           <div className="space-y-2">
//             <div className="flex items-center gap-2.5">
//               <WheatSVG />
//               <span className="text-[9px] uppercase tracking-[0.26em]"
//                 style={{ color: B.wheatGold, fontFamily: mono }}>
//                 Farm Intelligence Newsletter
//               </span>
//             </div>
//             <h3 style={{
//               fontFamily: serif,
//               fontWeight: 700,
//               fontSize: "1.45rem",
//               lineHeight: 1.1,
//               letterSpacing: "-0.02em",
//               color: B.cream,
//             }}>
//               Built for Farmers.{" "}
//               <span style={{ color: B.forestGreen }}>Trusted</span>{" "}
//               <span style={{ color: B.burntOrange, fontStyle: "italic" }}>in the Field.</span>
//             </h3>
//             <p className="text-xs font-light"
//               style={{ color: B.muted, fontFamily: sans }}>
//               Product updates, agri-tech insights and seasonal farm tips — monthly.
//             </p>
//           </div>

//           {/* Right: email input */}
//           <div className="w-full md:w-[420px] flex-shrink-0">
//             {submitted ? (
//               <div
//                 className="flex items-center gap-3 px-5 py-4"
//                 style={{ background: `rgba(46,107,46,0.15)`, border: `1px solid rgba(46,107,46,0.4)` }}
//               >
//                 <WheatSVG color={B.forestGreen} />
//                 <span className="text-sm" style={{ color: B.forestGreen, fontFamily: mono }}>
//                   You're subscribed — welcome to the HerdERP community.
//                 </span>
//               </div>
//             ) : (
//               <div
//                 className="flex items-center"
//                 style={{ border: `1px solid rgba(196,154,42,0.28)`, background: "rgba(255,255,255,0.03)" }}
//               >
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   onKeyDown={e => e.key === "Enter" && handleSubmit()}
//                   placeholder="your@email.com"
//                   className="flex-1 bg-transparent px-4 py-3.5 text-[11px] outline-none placeholder:uppercase"
//                   style={{
//                     color: B.cream,
//                     fontFamily: mono,
//                     letterSpacing: "0.1em",
//                     caretColor: B.wheatGold,
//                   }}
//                 />
//                 <button
//                   onClick={handleSubmit}
//                   className="flex items-center gap-2 px-5 py-3.5 font-semibold text-[10px] uppercase tracking-widest transition-all duration-300 flex-shrink-0"
//                   style={{ background: B.forestGreen, color: "#fff", fontFamily: mono }}
//                   onMouseEnter={e => (e.currentTarget.style.background = B.lightGreen)}
//                   onMouseLeave={e => (e.currentTarget.style.background = B.forestGreen)}
//                 >
//                   Subscribe
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ MAIN FOOTER GRID ══════════════════════════════════════════════ */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14"
//           style={{ borderBottom: `1px solid rgba(196,154,42,0.12)` }}>

//           {/* ── Brand column (2/5) ── */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* Logo */}
//             <div>
//               <Image
//                 src="/erp-logo.png"
//                 alt="HerdERP"
//                 width={200}
//                 height={100}
//                 className="h-14 w-auto object-contain"
//               />
//             </div>

//             {/* Tagline */}
//             <p className="text-sm font-light leading-relaxed max-w-xs"
//               style={{ color: B.muted, fontFamily: sans }}>
//               Precision livestock management ERP built for modern farming operations.
//               Track health, optimise yield and grow smarter — season after season.
//             </p>

//             {/* Contact details */}
//             <div className="space-y-2.5">
//               {contacts.map(({ icon: Icon, text }) => (
//                 <div key={text} className="flex items-center gap-2.5">
//                   <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: B.wheatGold }} />
//                   <span className="text-[11px]"
//                     style={{ color: B.muted, fontFamily: mono }}>{text}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Social buttons */}
//             <div className="flex gap-2.5">
//               {socials.map(({ icon: Icon, label }) => (
//                 <button
//                   key={label}
//                   aria-label={label}
//                   className="w-9 h-9 flex items-center justify-center transition-all duration-250"
//                   style={{
//                     border:     `1px solid rgba(196,154,42,0.25)`,
//                     background: "rgba(255,255,255,0.03)",
//                     color:      B.muted,
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.background   = B.forestGreen;
//                     e.currentTarget.style.color        = "#fff";
//                     e.currentTarget.style.borderColor  = B.forestGreen;
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.background   = "rgba(255,255,255,0.03)";
//                     e.currentTarget.style.color        = B.muted;
//                     e.currentTarget.style.borderColor  = "rgba(196,154,42,0.25)";
//                   }}
//                 >
//                   <Icon className="w-3.5 h-3.5" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ── Nav columns (3×1/5) ── */}
//           {navCols.map((col) => (
//             <div key={col.label} className="space-y-5">

//               {/* Column heading */}
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-px" style={{ background: col.accent }} />
//                 <h3 className="text-[9px] uppercase tracking-[0.28em]"
//                   style={{ color: col.accent, fontFamily: mono }}>
//                   {col.label}
//                 </h3>
//               </div>

//               {/* Divider */}
//               <div style={{ height: 1, background: `${col.accent}22` }} />

//               {/* Links */}
//               <ul className="space-y-3">
//                 {col.links.map(({ name, href }) => (
//                   <li key={name}>
//                     <Link
//                       href={href}
//                       className="group flex items-center gap-2 transition-all duration-200"
//                       style={{ color: B.muted, fontFamily: mono, fontSize: 11, letterSpacing: "0.1em" }}
//                       onMouseEnter={e => (e.currentTarget.style.color = col.accent)}
//                       onMouseLeave={e => (e.currentTarget.style.color = B.muted)}
//                     >
//                       {/* Wheat pip — appears on hover */}
//                       <span
//                         className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
//                       >
//                         <WheatSVG color={col.accent} size={8} />
//                       </span>
//                       <span className="uppercase tracking-wider text-[10.5px]">{name}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* ══ BOTTOM METADATA BAR ════════════════════════════════════════════ */}
//         <div className="flex flex-wrap items-center justify-between gap-4 py-5">

//           {/* Left: system status */}
//           <div className="flex items-center gap-5 flex-wrap">
//             {/* Live pulse */}
//             <div className="flex items-center gap-2">
//               <span className="relative flex h-1.5 w-1.5">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
//                   style={{ background: B.forestGreen }} />
//                 <span className="relative inline-flex rounded-full h-1.5 w-1.5"
//                   style={{ background: B.forestGreen }} />
//               </span>
//               <span className="text-[9px] uppercase tracking-widest"
//                 style={{ color: B.muted, fontFamily: mono }}>
//                 All Systems{" "}
//                 <span style={{ color: B.forestGreen }}>Operational</span>
//               </span>
//             </div>
//             <span className="text-[9px] uppercase tracking-widest hidden sm:block"
//               style={{ color: "rgba(122,136,112,0.45)", fontFamily: mono }}>
//               Latency · 8ms
//             </span>
//             <span className="text-[9px] uppercase tracking-widest hidden sm:block"
//               style={{ color: "rgba(122,136,112,0.45)", fontFamily: mono }}>
//               HerdERP v4.2
//             </span>
//           </div>

//           {/* Right: legal links */}
//           <div className="flex items-center gap-4">
//             {["Privacy", "Terms", "Compliance"].map((item, i) => (
//               <span key={item} className="flex items-center gap-4">
//                 {i > 0 && (
//                   <span style={{ color: "rgba(196,154,42,0.2)", fontSize: 10 }}>·</span>
//                 )}
//                 <button
//                   className="text-[9px] uppercase tracking-widest transition-colors duration-200"
//                   style={{ color: "rgba(122,136,112,0.6)", fontFamily: mono }}
//                   onMouseEnter={e => (e.currentTarget.style.color = B.wheatGold)}
//                   onMouseLeave={e => (e.currentTarget.style.color = "rgba(122,136,112,0.6)")}
//                 >
//                   {item}
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ══ COPYRIGHT BAR ══════════════════════════════════════════════════ */}
//         <div
//           className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4"
//           style={{ borderTop: `1px solid rgba(196,154,42,0.1)` }}
//         >
//           <p className="text-[9px] uppercase tracking-widest"
//             style={{ color: "rgba(122,136,112,0.45)", fontFamily: mono }}>
//             © {new Date().getFullYear()} HerdERP · All rights reserved
//           </p>
//           <div className="flex items-center gap-2">
//             <WheatSVG color="rgba(196,154,42,0.3)" size={9} />
//             <span className="text-[9px] uppercase tracking-widest"
//               style={{ color: "rgba(122,136,112,0.35)", fontFamily: mono }}>
//               Grown with care for farmers worldwide
//             </span>
//             <WheatSVG color="rgba(196,154,42,0.3)" size={9} />
//           </div>
//         </div>
//       </div>

//       {/* ══ LARGE WATERMARK ════════════════════════════════════════════════════ */}
//       <div
//         className="pointer-events-none select-none absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden"
//         style={{ height: 120 }}
//         aria-hidden
//       >
//         <span
//           className="text-[9rem] font-bold leading-none tracking-tighter opacity-[0.025] whitespace-nowrap"
//           style={{
//             fontFamily: serif,
//             color: B.wheatGold,
//             transform: "translateY(30%)",
//           }}
//         >
//           HerdERP
//         </span>
//       </div>
//     </footer>
//   );
// }

// // "use client";
// // import { Globe, Terminal, ShieldCheck } from "lucide-react";

// // const monoStyle = { fontFamily: "var(--font-jetbrains-mono, monospace)" };
// // const displayStyle = { fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800, letterSpacing: "-0.04em", textTransform: "uppercase" };
// // const bodyStyle = { fontFamily: "var(--font-dm-sans, sans-serif)" };

// // const navCols = [
// //   {
// //     label: "01 // Platform",
// //     links: ["Features", "Pricing Plans", "Integrations", "API Docs", "System Status"],
// //   },
// //   {
// //     label: "02 // Solutions",
// //     links: ["Herd Management", "Farm Analytics", "Milk Tracking", "Inventory", "Health Reports"],
// //   },
// //   {
// //     label: "03 // Support",
// //     links: ["Contact Support", "Documentation", "What's New", "Resources", "Security"],
// //   },
// // ];

// // export default function Footer() {
// //   return (
// //     <footer id="footer" className="relative bg-[#050505] pt-24 overflow-hidden">

// //       {/* Decorative grid */}
// //       <div className="absolute inset-0 pointer-events-none opacity-20">
// //         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 relative z-10">

// //         {/* MAIN GRID — 4 columns */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 mb-16">

// //           {/* Brand column */}
// //           <div className="bg-[#050505] p-8">
// //             <div className="mb-4">
// //               <div style={{ ...displayStyle, fontSize: "2rem" }}>
// //                 <span className="text-white">HERD</span>
// //                 <span className="text-green-500">ERP</span>
// //               </div>
// //               <p className="text-[10px] mt-1 text-green-500/55 uppercase tracking-widest" style={monoStyle}>
// //                 // LIVESTOCK_PLATFORM
// //               </p>
// //             </div>

// //             <p className="text-sm text-neutral-500 mb-8 leading-relaxed" style={bodyStyle}>
// //               Precision livestock management ERP built for modern farming operations. Track health, optimize yield, and grow smarter.
// //             </p>

// //             <div className="flex gap-3">
// //               {[Globe, Terminal, ShieldCheck].map((Icon, i) => (
// //                 <button
// //                   key={i}
// //                   className="w-9 h-9 flex items-center justify-center border border-white/10 text-neutral-600 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all duration-200"
// //                 >
// //                   <Icon className="w-4 h-4" />
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Nav columns */}
// //           {navCols.map((col, ci) => (
// //             <div key={ci} className="bg-[#050505] p-8">
// //               <h3 className="text-[10px] text-green-500 uppercase tracking-[0.3em] mb-6" style={monoStyle}>
// //                 {col.label}
// //               </h3>
// //               <ul className="space-y-3">
// //                 {col.links.map((link, li) => (
// //                   <li key={li}>
// //                     <button className="group flex items-center gap-1 text-[11px] font-bold text-white/50 hover:text-green-400 uppercase tracking-widest transition-colors" style={monoStyle}>
// //                       <span className="opacity-0 group-hover:opacity-100 text-green-500 transition-opacity">▶ </span>
// //                       {link}
// //                     </button>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>

// //         {/* NEWSLETTER AREA */}
// //         <div className="grid md:grid-cols-2 gap-12 items-center mb-16 pb-12 border-b border-white/5">
// //           <div>
// //             <h3 className="text-white mb-2 leading-tight" style={{ ...displayStyle, fontSize: "1.5rem" }}>
// //               Built for Livestock Farmers.<br />
// //               <span className="text-green-500">Trusted in the Field.</span>
// //             </h3>
// //             <p className="text-sm text-neutral-600" style={bodyStyle}>
// //               Get the latest product updates and agri-tech insights.
// //             </p>
// //           </div>

// //           <div>
// //             <div className="flex items-end gap-0 border-b border-white/10">
// //               <span className="text-green-500 text-xl pb-3 pr-3" style={monoStyle}>&gt;</span>
// //               <input
// //                 type="email"
// //                 placeholder="YOUR@EMAIL.COM"
// //                 className="flex-1 bg-transparent pb-3 text-sm text-white placeholder-neutral-700 outline-none uppercase tracking-wider"
// //                 style={monoStyle}
// //               />
// //               <button className="pb-3 pl-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:bg-green-500 hover:text-black border-b-0 transition-all px-4" style={monoStyle}>
// //                 EXECUTE →
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* METADATA BAR */}
// //         <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
// //           <div className="flex items-center gap-6">
// //             <div className="flex items-center gap-2">
// //               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
// //               <span className="text-[9px] uppercase tracking-widest text-neutral-500" style={monoStyle}>
// //                 System: <span className="text-green-500">Operational</span>
// //               </span>
// //             </div>
// //             <span className="text-[9px] text-neutral-600" style={monoStyle}>Network_Latency: 8ms</span>
// //             <span className="text-[9px] text-neutral-600" style={monoStyle}>Build: v2.4.1</span>
// //           </div>
// //           <div className="flex gap-6">
// //             {["Privacy", "Terms", "Compliance"].map((item) => (
// //               <button key={item} className="text-[9px] text-neutral-600 hover:text-green-500 uppercase tracking-widest transition-colors" style={monoStyle}>
// //                 {item}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* DATA-STREAM PROGRESS LINE — racing packets */}
// //       <div className="footer-progress-line" />
// //     </footer>
// //   );
// // }