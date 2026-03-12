"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Eye, EyeOff, ArrowRight, Shield, Zap,
  Lock, Mail, User, Building2, Activity, Database, HeartPulse,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

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
};

const serif = "var(--font-display)";
const sans = "var(--font-body)";
const mono = "var(--font-mono)";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// ─── Wheat SVG ────────────────────────────────────────────────────────────────
const WheatIcon = ({ color = B.wheatGold, size = 13 }) => (
  <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 13 20" fill="none" aria-hidden>
    <path
      d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
      stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const systemFeatures = [
  {
    icon: Activity,
    accent: B.forestGreen,
    title: "Herd Health Tracking",
    description: "Monitor animal health, vaccinations & vet records in real-time.",
  },
  {
    icon: Database,
    accent: B.wheatGold,
    title: "Breeding Management",
    description: "Track breeding cycles, pregnancy status & calving predictions.",
  },
  {
    icon: HeartPulse,
    accent: B.burntOrange,
    title: "Secure Data Storage",
    description: "Bank-level encryption protects all your livestock records.",
  },
];

export default function SignUp() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "", farmName: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const payload = {
        name: formData.fullName,
        farm_name: formData.farmName,
        email: formData.email,
        password,
        confirmPassword: formData.confirmPassword,
      };
      const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
      console.log("REGISTER_SUCCESS:", response.data);
      setSuccess("Account created! Redirecting to login…");
      setFormData({ fullName: "", farmName: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      console.log("REGISTER_ERROR:", err.response?.data || err.message);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Computed colours ──────────────────────────────────────────────────────
  const pageBg = isDark ? B.darkBg : "#EEE9DF";
  const cardBg = isDark ? B.cardDark : "rgba(248,244,236,0.97)";
  const textMain = isDark ? B.cream : "#1A2A1A";
  const textSub = isDark ? B.offWhite : "#4A5A48";
  const inputBg = isDark ? "rgba(11,18,11,0.8)" : "rgba(240,236,228,0.9)";
  const inputBorder = isDark ? "rgba(196,154,42,0.2)" : "rgba(46,107,46,0.25)";

  // ─── Reusable field ──────────────────────────────────────────────────────
  const Field = ({ label, LabelIcon, name, type = "text", placeholder, value, required = true }) => (
    <div>
      <label className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest"
        style={{ color: B.muted, fontFamily: mono }}>
        <LabelIcon className="w-3 h-3" />{label}
      </label>
      <input
        type={type} name={name} value={value} placeholder={placeholder}
        onChange={handleChange} required={required}
        className="w-full px-4 py-3.5 text-[12px] outline-none transition-all duration-200"
        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, fontFamily: mono, caretColor: B.wheatGold }}
        onFocus={e => (e.currentTarget.style.borderColor = B.forestGreen)}
        onBlur={e => (e.currentTarget.style.borderColor = inputBorder)}
      />
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden pt-[76px]"
      style={{ background: pageBg, fontFamily: sans }}>

      {/* ══ BACKGROUND ══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(196,154,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(46,107,46,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(46,107,46,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 700px 600px at 85% 50%, rgba(46,107,46,0.08) 0%, transparent 70%)"
        }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px]" style={{
          background: "radial-gradient(ellipse at top left, rgba(196,154,42,0.06) 0%, transparent 65%)"
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.wheatGold} 30%, ${B.burntOrange} 70%, transparent)`
        }} />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-76px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl">

          {/* 3-colour top divider */}
          <div className="w-full h-[3px]" style={{
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
          }} />

          <div className="grid lg:grid-cols-2 gap-0" style={{
            border: `1px solid rgba(196,154,42,0.22)`,
            borderTop: "none",
            boxShadow: isDark
              ? `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(46,107,46,0.12)`
              : `0 24px 80px rgba(0,0,0,0.12)`,
          }}>

            {/* ── RIGHT: FORM first on mobile ─────────────────────────── */}
            <div className="p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1"
              style={{ background: cardBg }}>

              {/* Heading */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <WheatIcon color={B.forestGreen} />
                  <span className="text-[9px] uppercase tracking-[0.26em]"
                    style={{ color: B.forestGreen, fontFamily: mono }}>
                    Create Account
                  </span>
                </div>
                <h2 style={{
                  fontFamily: serif, fontWeight: 700,
                  fontSize: "1.85rem", lineHeight: 1.05,
                  letterSpacing: "-0.02em", color: textMain,
                }}>
                  Start Your Farm Journey
                </h2>
                <p className="text-[12px] mt-1.5"
                  style={{ color: B.muted, fontFamily: mono }}>
                  Sign up to get started with HerdERP — free forever for small farms
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mb-4 px-4 py-3"
                  style={{ background: "rgba(196,96,26,0.1)", border: `1px solid rgba(196,96,26,0.35)`, borderLeft: `3px solid ${B.burntOrange}` }}>
                  <span className="text-[11px]" style={{ color: B.burntOrange, fontFamily: mono }}>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 px-4 py-3"
                  style={{ background: "rgba(46,107,46,0.1)", border: `1px solid rgba(46,107,46,0.35)`, borderLeft: `3px solid ${B.forestGreen}` }}>
                  <span className="text-[11px]" style={{ color: B.forestGreen, fontFamily: mono }}>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Full Name" LabelIcon={User} name="fullName" placeholder="John Smith" value={formData.fullName} />
                <Field label="Farm Name" LabelIcon={Building2} name="farmName" placeholder="Green Valley Ranch" value={formData.farmName} />
                <Field label="Email" LabelIcon={Mail} name="email" placeholder="your@email.com" value={formData.email} type="email" />

                {/* Password with show/hide */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest"
                    style={{ color: B.muted, fontFamily: mono }}>
                    <Lock className="w-3 h-3" />Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••••••" required
                      className="w-full px-4 py-3.5 pr-12 text-[12px] outline-none transition-all duration-200"
                      style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, fontFamily: mono, caretColor: B.wheatGold }}
                      onFocus={e => (e.currentTarget.style.borderColor = B.forestGreen)}
                      onBlur={e => (e.currentTarget.style.borderColor = inputBorder)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: B.muted }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest"
                    style={{ color: B.muted, fontFamily: mono }}>
                    <Lock className="w-3 h-3" />Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleChange}
                      placeholder="••••••••••••" required
                      className="w-full px-4 py-3.5 pr-12 text-[12px] outline-none transition-all duration-200"
                      style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, fontFamily: mono, caretColor: B.wheatGold }}
                      onFocus={e => (e.currentTarget.style.borderColor = B.forestGreen)}
                      onBlur={e => (e.currentTarget.style.borderColor = inputBorder)}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: B.muted }}>
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Rule */}
                <div style={{ height: 1, background: `linear-gradient(to right, ${B.forestGreen}40, transparent)` }} />

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="group w-full py-4 flex items-center justify-center gap-2.5 font-semibold text-[10px] uppercase tracking-widest transition-all duration-300"
                  style={{
                    background: loading ? `${B.forestGreen}80` : B.forestGreen,
                    color: "#fff", fontFamily: mono,
                    boxShadow: loading ? "none" : `0 4px 24px rgba(46,107,46,0.4)`,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = B.lightGreen; }}
                  onMouseLeave={e => { e.currentTarget.style.background = loading ? `${B.forestGreen}80` : B.forestGreen; }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {loading ? "Creating Account…" : "Create Account — It's Free"}
                  {!loading && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px" style={{ background: "rgba(196,154,42,0.2)" }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[9px] uppercase tracking-widest"
                    style={{ background: cardBg, color: B.muted, fontFamily: mono }}>or</span>
                </div>
              </div>

              {/* Login link */}
              <p className="text-center text-[10px] uppercase tracking-wider"
                style={{ color: B.muted, fontFamily: mono }}>
                Already have an account?{" "}
                <Link href="/login" className="font-bold transition-colors"
                  style={{ color: B.wheatGold }}
                  onMouseEnter={e => (e.currentTarget.style.color = B.forestGreen)}
                  onMouseLeave={e => (e.currentTarget.style.color = B.wheatGold)}>
                  Sign In →
                </Link>
              </p>
            </div>

            {/* ── LEFT: Brand panel ───────────────────────────────────── */}
            <div
              className="relative p-10 lg:p-14 flex flex-col justify-between order-1 lg:order-2 min-h-[420px]"
              style={{
                background: isDark
                  ? `linear-gradient(150deg, rgba(20,34,20,0.98) 0%, rgba(11,18,11,0.99) 100%)`
                  : `linear-gradient(150deg, rgba(240,236,228,0.99) 0%, rgba(228,222,210,0.99) 100%)`,
                borderLeft: `1px solid rgba(196,154,42,0.18)`,
              }}
            >
              {/* Corner ticks */}
              {["top-0 left-0 border-l border-t", "top-0 right-0 border-r border-t", "bottom-0 left-0 border-l border-b", "bottom-0 right-0 border-r border-b"].map((cls, i) => (
                <div key={i} className={`absolute ${cls}`} style={{ width: 8, height: 8, borderColor: `${B.wheatGold}50` }} />
              ))}

              {/* Top accent glow */}
              <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
                background: `linear-gradient(180deg, ${B.wheatGold}05 0%, transparent 100%)`
              }} />

              <div className="relative">
                {/* Logo */}
                <Link href="/" className="block">
                  <Image src="/erp-logo.png" alt="HerdERP Logo" width={140} height={10}
                    className=" object-contain" />
                </Link>

                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-5 h-px" style={{ background: B.wheatGold }} />
                  <WheatIcon />
                  <span className="text-[9px] uppercase tracking-[0.26em]"
                    style={{ color: B.wheatGold, fontFamily: mono }}>
                    Join 1,200+ Farms Today
                  </span>
                </div>

                <h1 style={{
                  fontFamily: serif, fontWeight: 700, lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)",
                  color: textMain,
                }} className="mb-4">
                  Transform Your<br />
                  <span style={{ color: B.forestGreen }}>Livestock</span>{" "}
                  <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Journey.</span>
                </h1>

                {/* Gradient rule */}
                <div className="mb-5" style={{
                  height: 2, width: 64,
                  background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
                }} />

                <p className="text-sm leading-relaxed mb-8 max-w-sm"
                  style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                  Join thousands of livestock farmers using smart technology to manage healthier herds and increase profits.
                </p>

                {/* Feature cards */}
                <div className="space-y-3">
                  {systemFeatures.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="group flex gap-4 p-4 transition-all duration-300"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                          border: `1px solid rgba(196,154,42,0.14)`,
                          borderLeft: `3px solid ${f.accent}`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(46,107,46,0.1)" : "rgba(46,107,46,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)")}
                      >
                        <div className="shrink-0 w-7 h-7 flex items-center justify-center"
                          style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}40` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: f.accent }} />
                        </div>
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-wider mb-0.5"
                            style={{ color: textMain, fontFamily: mono }}>{f.title}</h3>
                          <p className="text-[10px] leading-relaxed"
                            style={{ color: B.muted, fontFamily: mono }}>{f.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom status */}
              <div className="relative flex items-center gap-3 pt-6 mt-6"
                style={{ borderTop: `1px solid rgba(196,154,42,0.15)` }}>
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: B.forestGreen }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: B.forestGreen }} />
                </span>
                <span className="text-[9px] uppercase tracking-widest"
                  style={{ color: B.muted, fontFamily: mono }}>
                  System Status: <span style={{ color: B.forestGreen }}>Operational</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}