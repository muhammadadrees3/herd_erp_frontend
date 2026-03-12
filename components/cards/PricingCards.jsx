"use client";
import { useState } from "react";
import { Sprout, Tractor, Building2, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
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

// ─── Pricing plans ────────────────────────────────────────────────────────────
const plans = [
  {
    id:          "STARTER",
    icon:        Sprout,
    name:        "Starter Farm",
    tagline:     "Small herds, big ambitions",
    description: "Perfect for small livestock operations getting started with smart farm management.",
    monthly:     49,
    annual:      39,
    popular:     false,
    accent:      B.wheatGold,
    specs: [
      { label: "Animals Tracked", value: "Up to 500"  },
      { label: "Team Members",    value: "3 Users"    },
      { label: "Reports",         value: "Standard"   },
      { label: "Support",         value: "Email"      },
    ],
    features: [
      "Herd health tracking",
      "Basic milk yield reports",
      "Feed management",
      "Mobile app access",
      "Data export (CSV)",
    ],
  },
  {
    id:          "PROFESSIONAL",
    icon:        Tractor,
    name:        "Professional Dairy",
    tagline:     "The complete farm platform",
    description: "For growing operations that need advanced analytics, breeding tools and team collaboration.",
    monthly:     129,
    annual:      103,
    popular:     true,
    accent:      B.forestGreen,
    specs: [
      { label: "Animals Tracked", value: "Up to 5,000"  },
      { label: "Team Members",    value: "15 Users"     },
      { label: "Reports",         value: "Advanced"     },
      { label: "Support",         value: "Priority 24/7"},
    ],
    features: [
      "Everything in Starter",
      "Breeding intelligence module",
      "Milk yield forecasting",
      "Workforce management",
      "Financial reports & P&L",
      "API access",
    ],
  },
  {
    id:          "ENTERPRISE",
    icon:        Building2,
    name:        "Enterprise Ranch",
    tagline:     "Built for large-scale operations",
    description: "For large ranch operations needing custom integrations, unlimited scale and a dedicated success manager.",
    monthly:     299,
    annual:      239,
    popular:     false,
    accent:      B.burntOrange,
    specs: [
      { label: "Animals Tracked", value: "Unlimited"    },
      { label: "Team Members",    value: "Unlimited"    },
      { label: "Reports",         value: "Custom"       },
      { label: "Support",         value: "Dedicated CSM"},
    ],
    features: [
      "Everything in Professional",
      "Custom ERP integrations",
      "Multi-farm management",
      "White-label option",
      "SLA guarantee",
      "On-site onboarding",
    ],
  },
];

// ─── Trust bar items ──────────────────────────────────────────────────────────
const trustItems = [
  { icon: "🌱", label: "30-Day Free Trial"         },
  { icon: "🔒", label: "No Credit Card Required"   },
  { icon: "⚡", label: "Under 5 Min Setup"         },
  { icon: "📞", label: "Cancel Anytime"            },
];

export default function PricingCards() {
  const { isDark }           = useTheme();
  const [isAnnual, setAnnual] = useState(false);

  const pageBg   = isDark ? B.darkBg  : "#EEE9DF";
  const textMain = isDark ? B.cream   : "#1A2A1A";
  const textSub  = isDark ? B.offWhite: "#4A5A48";

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-28"
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
        {/* Green centre bloom */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 900px 600px at 50% 45%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat warmth top-right */}
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
          className="text-center mb-14 space-y-5"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: B.wheatGold }} />
            <WheatIcon />
            <span className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: B.wheatGold, fontFamily: mono }}>
              Simple, Transparent Pricing
            </span>
            <WheatIcon />
            <div className="w-6 h-px" style={{ background: B.wheatGold }} />
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: serif,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            color: textMain,
          }}>
            A Plan for Every
            <br />
            <span style={{ color: B.forestGreen }}>Size of</span>{" "}
            <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Farm.</span>
          </h2>

          {/* Gradient rule */}
          <div className="mx-auto" style={{
            height: 2, width: 80,
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
          }} />

          <p className="text-sm max-w-xl mx-auto leading-relaxed"
            style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
            Start free for 30 days. No credit card required.
            Scale up as your herd grows — or cancel anytime.
          </p>

          {/* ── Billing toggle ── */}
          <div className="flex items-center justify-center pt-2">
            <div
              className="inline-flex items-center p-1"
              style={{
                border:     `1px solid rgba(196,154,42,0.28)`,
                background: isDark ? "rgba(11,18,11,0.8)" : "rgba(235,229,217,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              {["Monthly", "Annual"].map((label) => {
                const active = label === "Annual" ? isAnnual : !isAnnual;
                return (
                  <button
                    key={label}
                    onClick={() => setAnnual(label === "Annual")}
                    className="relative px-7 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-all duration-300"
                    style={{
                      fontFamily: mono,
                      background: active
                        ? `linear-gradient(135deg, ${B.forestGreen}, ${B.deepGreen})`
                        : "transparent",
                      color: active ? "#fff" : B.muted,
                      boxShadow: active ? `0 2px 16px rgba(46,107,46,0.35)` : "none",
                    }}
                  >
                    {label}
                    {label === "Annual" && !isAnnual && (
                      <span className="ml-1.5 text-[8px]"
                        style={{ color: B.wheatGold }}>
                        −20%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══ CARDS GRID ════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, idx) => {
            const Icon  = plan.icon;
            const price = isAnnual ? plan.annual : plan.monthly;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="relative group"
              >
                {/* ── Popular banner ── */}
                {plan.popular && (
                  <div
                    className="flex items-center justify-center gap-2 py-2 text-[9px] font-bold uppercase tracking-widest"
                    style={{
                      background: `linear-gradient(to right, ${B.forestGreen}, ${B.deepGreen})`,
                      color: "#fff",
                      fontFamily: mono,
                    }}
                  >
                    <WheatIcon color="#fff" size={10} />
                    Most Popular — Best Value
                    <WheatIcon color="#fff" size={10} />
                  </div>
                )}

                {/* ── Card ── */}
                <div
                  className="relative overflow-hidden transition-all duration-400"
                  style={{
                    background: isDark
                      ? `linear-gradient(160deg, rgba(20,34,20,0.97) 0%, rgba(11,18,11,0.99) 100%)`
                      : `linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)`,
                    border:    `1px solid ${plan.popular ? plan.accent + "55" : "rgba(196,154,42,0.18)"}`,
                    borderTop: `3px solid ${plan.accent}`,
                    boxShadow: plan.popular
                      ? `0 8px 60px ${plan.accent}22, 0 2px 0 ${plan.accent}`
                      : "none",
                    transform: "translateY(0)",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = `0 16px 60px ${plan.accent}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = plan.popular
                      ? `0 8px 60px ${plan.accent}22, 0 2px 0 ${plan.accent}`
                      : "none";
                  }}
                >
                  {/* Accent glow wash */}
                  <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{
                    background: `linear-gradient(180deg, ${plan.accent}10 0%, transparent 100%)`
                  }} />

                  {/* Corner ticks */}
                  {[
                    "top-0 left-0 border-l border-t",
                    "top-0 right-0 border-r border-t",
                    "bottom-0 left-0 border-l border-b",
                    "bottom-0 right-0 border-r border-b",
                  ].map((cls, ci) => (
                    <div key={ci}
                      className={`absolute ${cls} transition-all duration-300 group-hover:w-4 group-hover:h-4`}
                      style={{ width: 7, height: 7, borderColor: plan.accent + "50" }}
                    />
                  ))}

                  <div className="relative p-7">

                    {/* Plan ID + icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5"
                          style={{
                            background: `${plan.accent}15`,
                            border:     `1px solid ${plan.accent}35`,
                          }}>
                          <Icon className="w-4 h-4" style={{ color: plan.accent }} />
                        </div>
                        <div>
                          <div className="text-[8px] uppercase tracking-[0.22em]"
                            style={{ color: plan.accent, fontFamily: mono }}>{plan.name}</div>
                          <div className="text-[7.5px] uppercase tracking-widest"
                            style={{ color: B.muted, fontFamily: mono }}>{plan.id}</div>
                        </div>
                      </div>
                      {/* Wheat icon */}
                      <WheatIcon color={plan.accent} size={14} />
                    </div>

                    {/* Tagline */}
                    <p className="text-[11px] italic mb-1"
                      style={{ color: plan.accent, fontFamily: sans }}>
                      {plan.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-[11px] leading-relaxed mb-5"
                      style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                      {plan.description}
                    </p>

                    {/* Gradient rule */}
                    <div className="mb-5" style={{
                      height: 1,
                      background: `linear-gradient(to right, ${plan.accent}55, transparent)`
                    }} />

                    {/* ── Price box ── */}
                    <div
                      className="flex items-start gap-1 mb-1"
                    >
                      <span className="text-base mt-2 font-bold"
                        style={{ color: plan.accent, fontFamily: serif }}>$</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={price}
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{    opacity: 0, y:  12 }}
                          transition={{ duration: 0.22 }}
                          className="text-[3.8rem] font-bold leading-none tracking-tight"
                          style={{ color: textMain, fontFamily: serif }}
                        >
                          {price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[10px] mt-auto mb-1.5"
                        style={{ color: B.muted, fontFamily: mono }}>/mo</span>
                    </div>

                    {isAnnual && (
                      <p className="text-[9px] mb-4 uppercase tracking-wider"
                        style={{ color: B.forestGreen, fontFamily: mono }}>
                        Billed annually — saves 20%
                      </p>
                    )}

                    {/* ── Specs table ── */}
                    <div className="mb-6"
                      style={{ border: `1px solid rgba(196,154,42,0.15)` }}>
                      {plan.specs.map((spec, si) => (
                        <div
                          key={si}
                          className="flex justify-between items-center px-3 py-2.5 group/row transition-colors duration-200"
                          style={{
                            borderBottom: si < plan.specs.length - 1
                              ? "1px solid rgba(196,154,42,0.1)"
                              : "none",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = `${plan.accent}08`)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span className="text-[10px] uppercase tracking-wider"
                            style={{ color: B.muted, fontFamily: mono }}>
                            {spec.label}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide"
                            style={{ color: isDark ? B.cream : "#1A2A1A", fontFamily: mono }}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ── Features list ── */}
                    <div className="space-y-2 mb-7">
                      {plan.features.map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2.5">
                          {/* Wheat pip */}
                          <svg width="8" height="11" viewBox="0 0 8 11" fill="none" className="flex-shrink-0">
                            <path d="M4 10.5V1.5M2.5 3l1.5-1.5L5.5 3M2 5.5l2-1.5 2 1.5M2 8l2-1.5 2 1.5"
                              stroke={plan.accent} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-[11px] leading-snug"
                            style={{ color: textSub, fontFamily: sans }}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ── CTA ── */}
                    <Link href="/signup">
                      <button
                        className="w-full py-3.5 flex items-center justify-center gap-2 font-semibold text-[10px] uppercase tracking-widest transition-all duration-300 group/btn"
                        style={
                          plan.popular
                            ? {
                                background: plan.accent,
                                color: "#fff",
                                fontFamily: mono,
                                boxShadow: `0 4px 24px ${plan.accent}45`,
                              }
                            : {
                                border: `1.5px solid ${plan.accent}45`,
                                color:  plan.accent,
                                background: "transparent",
                                fontFamily: mono,
                              }
                        }
                        onMouseEnter={e => {
                          e.currentTarget.style.background = plan.accent;
                          e.currentTarget.style.color      = "#fff";
                          e.currentTarget.style.boxShadow = `0 4px 24px ${plan.accent}45`;
                        }}
                        onMouseLeave={e => {
                          if (plan.popular) {
                            e.currentTarget.style.background = plan.accent;
                            e.currentTarget.style.color      = "#fff";
                          } else {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color      = plan.accent;
                            e.currentTarget.style.boxShadow  = "none";
                          }
                        }}
                      >
                        Get Started — {plan.name}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ══ TRUST BAR ═════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-14"
        >
          {/* 3-colour brand divider */}
          <div className="w-full h-[2px] mb-px" style={{
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
          }} />

          <div className="grid grid-cols-2 md:grid-cols-4"
            style={{ border: `1px solid rgba(196,154,42,0.18)`, borderTop: "none" }}>
            {trustItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2.5 py-4 transition-colors duration-250"
                style={{
                  background: isDark ? B.cardDark : "rgba(240,236,228,0.9)",
                  borderRight: idx < trustItems.length - 1
                    ? "1px solid rgba(196,154,42,0.14)"
                    : "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark
                  ? `rgba(46,107,46,0.1)` : `rgba(46,107,46,0.06)`)}
                onMouseLeave={e => (e.currentTarget.style.background = isDark
                  ? B.cardDark : "rgba(240,236,228,0.9)")}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-[9px] uppercase tracking-widest"
                  style={{ color: isDark ? B.offWhite : "#3A4A38", fontFamily: mono }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fine print */}
        <p className="text-center mt-7 text-[9px] uppercase tracking-widest"
          style={{ color: B.muted, fontFamily: mono }}>
          All plans include 30-day free trial · No setup fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import { Zap, Crown, Sparkles, Check } from "lucide-react";
// import { motion } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext";
// import Link from "next/link";

// const monoStyle = { fontFamily: "var(--font-jetbrains-mono, monospace)" };
// const displayStyle = { fontFamily: "var(--font-barlow-condensed, sans-serif)", fontWeight: 800, letterSpacing: "-0.03em", textTransform: "uppercase" };
// const bodyStyle = { fontFamily: "var(--font-dm-sans, sans-serif)" };

// const plans = [
//   {
//     id: "STARTER_PLAN",
//     icon: Zap,
//     name: "Starter Farm",
//     description: "For small livestock operations getting started with smart farm management",
//     monthly: 49,
//     annual: 39,
//     popular: false,
//     specs: [
//       { label: "Animals", value: "Up to 500" },
//       { label: "Users", value: "3 Users" },
//       { label: "Reports", value: "Basic" },
//       { label: "Support", value: "Email" },
//     ],
//   },
//   {
//     id: "PROFESSIONAL_PLAN",
//     icon: Crown,
//     name: "Professional Dairy",
//     description: "For growing operations that need advanced analytics and team collaboration",
//     monthly: 129,
//     annual: 103,
//     popular: true,
//     specs: [
//       { label: "Animals", value: "Up to 5,000" },
//       { label: "Users", value: "15 Users" },
//       { label: "Reports", value: "Advanced" },
//       { label: "Support", value: "Priority 24/7" },
//     ],
//   },
//   {
//     id: "ENTERPRISE_PLAN",
//     icon: Sparkles,
//     name: "Enterprise Ranch",
//     description: "For large-scale ranch operations with custom integrations and dedicated support",
//     monthly: 299,
//     annual: 239,
//     popular: false,
//     specs: [
//       { label: "Animals", value: "Unlimited" },
//       { label: "Users", value: "Unlimited" },
//       { label: "Reports", value: "Custom" },
//       { label: "Support", value: "Dedicated CSM" },
//     ],
//   },
// ];

// export default function PricingCards() {
//   const { isDark } = useTheme();
//   const [isAnnual, setIsAnnual] = useState(false);

//   return (
//     <section id="pricing" className={`relative overflow-hidden py-24 ${isDark ? "bg-[#070708]" : "bg-white"}`}>

//       {/* MULTI-LAYER BACKGROUND */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "" : "opacity-40"}`} />
//         <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 800px 600px at 50% 40%, rgba(34,197,94,0.055) 0%, transparent 70%)" }} />
//         <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(15deg, transparent, transparent 60px, rgba(34,197,94,0.025) 60px, rgba(34,197,94,0.025) 61px)" }} />
//       </div>

//       <div className="max-w-7xl mx-auto px-4 relative z-10">

//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12 space-y-4"
//         >
//           <h2 className={isDark ? "text-white" : "text-neutral-900"} style={{ ...displayStyle, fontSize: "clamp(3rem, 7vw, 5rem)" }}>
//             Choose Your{" "}
//             <span
//               style={{
//                 color: isDark ? "#22c55e" : "#15803d",
//                 textShadow: "0 0 40px rgba(34,197,94,0.4)",
//               }}
//             >
//               Power Level.
//             </span>
//           </h2>

//           {/* Billing toggle */}
//           <div className="flex items-center justify-center mt-8">
//             <div className={`inline-flex items-center gap-1 p-1 border ${isDark ? "bg-neutral-900 border-white/10" : "bg-neutral-100 border-neutral-300"}`}>
//               {["Monthly", "Annual"].map((label) => {
//                 const active = label === "Annual" ? isAnnual : !isAnnual;
//                 return (
//                   <button
//                     key={label}
//                     onClick={() => setIsAnnual(label === "Annual")}
//                     className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${active
//                         ? "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]"
//                         : isDark
//                           ? "text-neutral-500 hover:text-white"
//                           : "text-neutral-500 hover:text-black"
//                       }`}
//                     style={monoStyle}
//                   >
//                     {label}
//                     {label === "Annual" && !isAnnual && (
//                       <span className="ml-2 text-green-500 text-[8px]">[-20%]</span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </motion.div>

//         {/* PRICING CARDS GRID */}
//         <div className="grid md:grid-cols-3 gap-8 items-start">
//           {plans.map((plan, idx) => {
//             const Icon = plan.icon;
//             const price = isAnnual ? plan.annual : plan.monthly;

//             return (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1, duration: 0.6 }}
//                 className="relative group"
//               >
//                 {/* MOST POPULAR flag */}
//                 {plan.popular && (
//                   <div
//                     className="bg-green-500 text-black text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 text-center w-full"
//                     style={monoStyle}
//                   >
//                     ★ MOST POPULAR
//                   </div>
//                 )}

//                 <div
//                   className={`relative overflow-hidden transition-all duration-300 group-hover:-translate-y-4 ${plan.popular
//                       ? isDark
//                         ? "bg-[#0d0d0f] border border-green-500/45"
//                         : "bg-white border border-green-600/50"
//                       : isDark
//                         ? "bg-[#0d0d0f] border border-white/7"
//                         : "bg-white border border-neutral-200"
//                     }`}
//                   style={{
//                     boxShadow: plan.popular
//                       ? "0 0 80px -20px rgba(34,197,94,0.45)"
//                       : undefined,
//                     transition: "transform 300ms ease, box-shadow 300ms ease",
//                   }}
//                 >
//                   {/* Corner accents */}
//                   {["top-0 left-0 border-l border-t", "top-0 right-0 border-r border-t", "bottom-0 left-0 border-l border-b", "bottom-0 right-0 border-r border-b"].map((cls, ci) => (
//                     <div
//                       key={ci}
//                       className={`absolute ${cls} border-green-500/50 transition-all duration-200 group-hover:w-3.5 group-hover:h-3.5`}
//                       style={{ width: "6px", height: "6px" }}
//                       aria-hidden="true"
//                     />
//                   ))}

//                   <div className="p-8">
//                     {/* Plan badge + icon */}
//                     <div className="flex justify-between items-start mb-6">
//                       <span
//                         className={`text-[8px] px-2 py-1 border text-green-500 border-green-500/30 ${isDark ? "bg-green-500/5" : "bg-green-50"}`}
//                         style={monoStyle}
//                       >
//                         {plan.id}
//                       </span>
//                       <Icon className={`w-7 h-7 text-neutral-700 group-hover:text-green-500 transition-colors duration-300 ${isDark ? "" : "text-neutral-400"}`} />
//                     </div>

//                     {/* Plan name + desc */}
//                     <h3 className={`mb-2 ${isDark ? "text-white" : "text-neutral-900"}`} style={{ ...displayStyle, fontSize: "1.8rem" }}>
//                       {plan.name}
//                     </h3>
//                     <p className={`text-xs mb-6 ${isDark ? "text-neutral-500" : "text-neutral-500"}`} style={monoStyle}>
//                       {plan.description}
//                     </p>

//                     {/* Price box */}
//                     <div className={`p-5 border mb-6 ${isDark ? "border-white/5 bg-black/20" : "border-neutral-200 bg-neutral-50"}`}>
//                       <div className="flex items-end gap-1">
//                         <span className="text-green-500 text-xl font-bold" style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}>$</span>
//                         <span
//                           className={`text-5xl font-bold leading-none ${isDark ? "text-white" : "text-neutral-900"}`}
//                           style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800 }}
//                         >
//                           {price}
//                         </span>
//                         <span className={`text-xs mb-1 ${isDark ? "text-neutral-500" : "text-neutral-500"}`} style={monoStyle}>/mo</span>
//                       </div>
//                       {isAnnual && (
//                         <p className="text-[9px] text-green-500 mt-1.5" style={monoStyle}>BILLED ANNUALLY — SAVES 20%</p>
//                       )}
//                     </div>

//                     {/* Specs table */}
//                     <div className={`border ${isDark ? "border-white/5" : "border-neutral-200"} mb-8`}>
//                       {plan.specs.map((spec, si) => (
//                         <div
//                           key={si}
//                           className={`group/row flex justify-between items-center px-4 py-3 transition-colors cursor-default ${si < plan.specs.length - 1 ? `border-b ${isDark ? "border-white/5" : "border-neutral-200"}` : ""
//                             } ${isDark ? "hover:bg-white/3" : "hover:bg-neutral-50"}`}
//                         >
//                           <span className={`text-[10px] uppercase ${isDark ? "text-neutral-500" : "text-neutral-500"}`} style={bodyStyle}>
//                             {spec.label}
//                           </span>
//                           <span
//                             className={`text-[11px] group-hover/row:text-green-500 transition-colors ${isDark ? "text-white" : "text-neutral-900"}`}
//                             style={monoStyle}
//                           >
//                             {spec.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* CTA */}
//                     <Link href="/signup">
//                       <button
//                         className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${plan.popular
//                             ? "bg-green-600 text-white hover:bg-green-500"
//                             : isDark
//                               ? "border border-white/10 text-neutral-300 hover:bg-green-600 hover:text-white hover:border-green-600"
//                               : "border border-neutral-300 text-neutral-700 bg-neutral-50 hover:bg-green-600 hover:text-white hover:border-green-600"
//                           }`}
//                       >
//                         Get Started →
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Trust bar */}
//         <div className={`mt-16 grid grid-cols-3 gap-px ${isDark ? "bg-white/5" : "bg-neutral-200"}`}>
//           {[
//             { icon: Check, label: "30-Day Money Back" },
//             { icon: Check, label: "No Credit Card Required" },
//             { icon: Check, label: "Under 5 Min Setup" },
//           ].map((item, idx) => {
//             const Icon = item.icon;
//             return (
//               <div key={idx} className={`flex items-center justify-center gap-2 py-5 ${isDark ? "bg-[#070708]" : "bg-white"}`}>
//                 <Icon className="w-4 h-4 text-green-500/60" />
//                 <span className={`text-[10px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-500"}`} style={monoStyle}>
//                   {item.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         <p className={`text-center mt-8 text-[10px] ${isDark ? "text-neutral-600" : "text-neutral-400"}`} style={monoStyle}>
//           // All plans include 30-day free trial. Cancel anytime. No setup fees.
//         </p>
//       </div>
//     </section>
//   );
// }