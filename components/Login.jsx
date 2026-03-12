"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Activity, Shield, TrendingUp, HeartPulse,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import axiosInstance from "@/utils/axios";

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

// ─── Wheat SVG ────────────────────────────────────────────────────────────────
const WheatIcon = ({ color = B.wheatGold, size = 13 }) => (
  <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 13 20" fill="none" aria-hidden>
    <path
      d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
      stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const systemMetrics = [
  { icon: Activity, value: "50K+", label: "Animals Tracked", accent: B.forestGreen },
  { icon: TrendingUp, value: "+45%", label: "Yield Increase", accent: B.wheatGold },
  { icon: Shield, value: "99.9%", label: "Uptime SLA", accent: B.forestGreen },
  { icon: HeartPulse, value: "97%", label: "Herd Health Score", accent: B.burntOrange },
];

const Login = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      setSuccess("Login successful! Redirecting...");
      if (response.data.accessToken)
        Cookies.set("accessToken", response.data.accessToken, { expires: 7, secure: true, sameSite: "Strict", path: "/" });
      if (response.data.refreshToken)
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 30, secure: true, sameSite: "Strict", path: "/" });
      if (response.data.user)
        localStorage.setItem("user", JSON.stringify(response.data.user));
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const pageBg = isDark ? B.darkBg : "#EEE9DF";
  const cardBg = isDark ? B.cardDark : "rgba(248,244,236,0.97)";
  const textMain = isDark ? B.cream : "#1A2A1A";
  const textSub = isDark ? B.offWhite : "#4A5A48";
  const inputBg = isDark ? "rgba(11,18,11,0.8)" : "rgba(240,236,228,0.9)";
  const inputBorder = isDark ? "rgba(196,154,42,0.2)" : "rgba(46,107,46,0.25)";

  return (
    <div className="min-h-screen relative overflow-hidden pt-[76px]" style={{ background: pageBg, fontFamily: sans }}>

      {/* ══ BACKGROUND ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Field grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(196,154,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(46,107,46,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(46,107,46,0.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Green left bloom */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 700px 600px at 15% 50%, rgba(46,107,46,0.1) 0%, transparent 70%)"
        }} />
        {/* Wheat warmth top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px]" style={{
          background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
        }} />
        {/* Left brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
          background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
        }} />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-76px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl">

          {/* 3-colour top divider */}
          <div className="w-full h-[3px] mb-0" style={{
            background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
          }} />

          <div className="grid lg:grid-cols-2 gap-0" style={{
            border: `1px solid rgba(196,154,42,0.22)`,
            borderTop: "none",
            boxShadow: isDark
              ? `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(46,107,46,0.12)`
              : `0 24px 80px rgba(0,0,0,0.12)`,
          }}>

            {/* ── LEFT: Brand panel ──────────────────────────────────────── */}
            <div
              className="relative p-10 lg:p-14 flex flex-col justify-between min-h-[580px]"
              style={{
                background: isDark
                  ? `linear-gradient(150deg, rgba(20,34,20,0.98) 0%, rgba(11,18,11,0.99) 100%)`
                  : `linear-gradient(150deg, rgba(240,236,228,0.99) 0%, rgba(228,222,210,0.99) 100%)`,
                borderRight: `1px solid rgba(196,154,42,0.18)`,
              }}
            >
              {/* Corner ticks */}
              {["top-0 left-0 border-l border-t", "top-0 right-0 border-r border-t", "bottom-0 left-0 border-l border-b", "bottom-0 right-0 border-r border-b"].map((cls, i) => (
                <div key={i} className={`absolute ${cls}`} style={{ width: 8, height: 8, borderColor: `${B.wheatGold}50` }} />
              ))}

              {/* Accent glow */}
              <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
                background: `linear-gradient(180deg, ${B.forestGreen}08 0%, transparent 100%)`
              }} />

              <div className="relative">
                {/* Logo */}
                <Link href="/" className="block mb-8">
                  <Image src="/erp-logo.png" alt="HerdERP Logo" width={160} height={80}
                    className="w-auto object-contain" style={{ maxHeight: 60 }} />
                </Link>

                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-5 h-px" style={{ background: B.wheatGold }} />
                  <WheatIcon />
                  <span className="text-[9px] uppercase tracking-[0.26em]"
                    style={{ color: B.wheatGold, fontFamily: mono }}>
                    Livestock Management ERP
                  </span>
                </div>

                {/* Headline */}
                <h1 style={{
                  fontFamily: serif, fontWeight: 700, lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  color: textMain,
                }} className="mb-4">
                  Modern Livestock<br />
                  <span style={{ color: B.forestGreen }}>Reliable</span>{" "}
                  <span style={{ color: B.burntOrange, fontStyle: "italic" }}>Results.</span>
                </h1>

                {/* Gradient rule */}
                <div className="mb-5" style={{
                  height: 2, width: 64,
                  background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
                }} />

                <p className="text-sm leading-relaxed mb-8 max-w-sm"
                  style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                  Manage livestock with proven technology trusted by 1,200+ farms worldwide.
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  {systemMetrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div key={i} className="group p-4 transition-all duration-300 relative overflow-hidden"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
                          border: `1px solid rgba(196,154,42,0.14)`,
                          borderLeft: `3px solid ${m.accent}`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(46,107,46,0.1)" : "rgba(46,107,46,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)")}
                      >
                        <Icon className="w-3.5 h-3.5 mb-2" style={{ color: m.accent }} />
                        <div className="text-xl font-bold leading-none mb-0.5"
                          style={{ color: textMain, fontFamily: serif }}>{m.value}</div>
                        <div className="text-[8px] uppercase tracking-widest"
                          style={{ color: B.muted, fontFamily: mono }}>{m.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom status */}
              <div className="relative flex items-center gap-3 pt-6"
                style={{ borderTop: `1px solid rgba(196,154,42,0.15)` }}>
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: B.forestGreen }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: B.forestGreen }} />
                </span>
                <span className="text-[9px] uppercase tracking-widest"
                  style={{ color: B.muted, fontFamily: mono }}>
                  Systems <span style={{ color: B.forestGreen }}>Operational</span> · Auth Protocol v4.0
                </span>
              </div>
            </div>

            {/* ── RIGHT: Login form ──────────────────────────────────────── */}
            <div className="p-10 lg:p-14 flex flex-col justify-center" style={{ background: cardBg }}>

              {/* Form heading */}
              <div className="mb-9">
                <div className="flex items-center gap-2 mb-5">
                  <WheatIcon color={B.forestGreen} />
                  <span className="text-[9px] uppercase tracking-[0.26em]"
                    style={{ color: B.forestGreen, fontFamily: mono }}>
                    Secure Sign In
                  </span>
                </div>
                <h2 style={{
                  fontFamily: serif, fontWeight: 700,
                  fontSize: "1.85rem", lineHeight: 1.05,
                  letterSpacing: "-0.02em", color: textMain,
                }}>
                  Welcome Back
                </h2>
                <p className="text-[12px] mt-1.5"
                  style={{ color: B.muted, fontFamily: mono }}>
                  Enter your credentials to continue
                </p>
              </div>

              {/* Error / success */}
              {error && (
                <div className="mb-4 px-4 py-3 flex items-start gap-2"
                  style={{ background: "rgba(196,96,26,0.1)", border: `1px solid rgba(196,96,26,0.35)`, borderLeft: `3px solid ${B.burntOrange}` }}>
                  <span className="text-[11px]" style={{ color: B.burntOrange, fontFamily: mono }}>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 px-4 py-3 flex items-start gap-2"
                  style={{ background: "rgba(46,107,46,0.1)", border: `1px solid rgba(46,107,46,0.35)`, borderLeft: `3px solid ${B.forestGreen}` }}>
                  <span className="text-[11px]" style={{ color: B.forestGreen, fontFamily: mono }}>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest"
                    style={{ color: B.muted, fontFamily: mono }}>
                    <Mail className="w-3 h-3" />Email
                  </label>
                  <input
                    type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 text-[12px] outline-none transition-all duration-200"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: textMain, fontFamily: mono,
                      caretColor: B.wheatGold,
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = B.forestGreen)}
                    onBlur={e => (e.currentTarget.style.borderColor = inputBorder)}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest"
                    style={{ color: B.muted, fontFamily: mono }}>
                    <Lock className="w-3 h-3" />Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3.5 pr-12 text-[12px] outline-none transition-all duration-200"
                      style={{
                        background: inputBg,
                        border: `1px solid ${inputBorder}`,
                        color: textMain, fontFamily: mono,
                        caretColor: B.wheatGold,
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = B.forestGreen)}
                      onBlur={e => (e.currentTarget.style.borderColor = inputBorder)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: B.muted }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-green-700" />
                    <span className="text-[9px] uppercase tracking-wide"
                      style={{ color: B.muted, fontFamily: mono }}>Remember</span>
                  </label>
                  <button type="button" className="text-[9px] uppercase tracking-wide transition-colors"
                    style={{ color: B.wheatGold, fontFamily: mono }}
                    onMouseEnter={e => (e.currentTarget.style.color = B.forestGreen)}
                    onMouseLeave={e => (e.currentTarget.style.color = B.wheatGold)}>
                    Forgot Password?
                  </button>
                </div>

                {/* Gradient rule */}
                <div style={{ height: 1, background: `linear-gradient(to right, ${B.forestGreen}40, transparent)` }} />

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="group w-full py-4 flex items-center justify-center gap-2.5 font-semibold text-[10px] uppercase tracking-widest transition-all duration-300"
                  style={{
                    background: loading ? `${B.forestGreen}80` : B.forestGreen,
                    color: "#fff",
                    fontFamily: mono,
                    boxShadow: loading ? "none" : `0 4px 24px rgba(46,107,46,0.4)`,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = B.lightGreen; }}
                  onMouseLeave={e => { e.currentTarget.style.background = loading ? `${B.forestGreen}80` : B.forestGreen; }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {loading ? "Signing In…" : "Sign In to HerdERP"}
                  {!loading && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px" style={{ background: `rgba(196,154,42,0.2)` }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-[9px] uppercase tracking-widest"
                    style={{ background: cardBg, color: B.muted, fontFamily: mono }}>
                    or
                  </span>
                </div>
              </div>

              {/* Sign-up link */}
              <p className="text-center text-[10px] uppercase tracking-wider"
                style={{ color: B.muted, fontFamily: mono }}>
                No account?{" "}
                <Link href="/signup"
                  className="font-bold transition-colors"
                  style={{ color: B.wheatGold }}
                  onMouseEnter={e => (e.currentTarget.style.color = B.forestGreen)}
                  onMouseLeave={e => (e.currentTarget.style.color = B.wheatGold)}>
                  Sign Up Free →
                </Link>
              </p>

              {/* Security notice */}
              <div className="mt-7 px-4 py-3 flex items-start gap-3"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
                  border: `1px solid rgba(46,107,46,0.18)`,
                  borderLeft: `3px solid ${B.forestGreen}`,
                }}>
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: B.forestGreen }} />
                <div>
                  <p className="text-[9px] uppercase tracking-wider mb-0.5"
                    style={{ color: B.forestGreen, fontFamily: mono }}>
                    Secure Connection
                  </p>
                  <p className="text-[10px] leading-relaxed"
                    style={{ color: B.muted, fontFamily: mono }}>
                    Bank-level encryption protects all your farm data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;