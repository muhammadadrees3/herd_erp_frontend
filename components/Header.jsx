"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronRight, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "@/context/NavigationContext";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
  forestGreen: "#2E6B2E",
  lightGreen: "#3A8C3A",
  deepGreen: "#1D4A1D",
  wheatGold: "#C49A2A",
  burntOrange: "#C4601A",
  cream: "#F5F0E8",
  darkBg: "#0B120B",
};

const mono = "var(--font-mono)";
const display = "var(--font-display)";

// ─── Nav links (route-based) ──────────────────────────────────────────────────
const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { startLoading } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // ── Navigate with loader ──────────────────────────────────────────────────
  const navigate = (href) => {
    if (href !== pathname) {
      startLoading();
      router.push(href);
    }
    setMenuOpen(false);
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const isTransparent = isHomePage && !scrolled;

  const navTextColor = isTransparent
    ? "rgba(245,240,232,0.88)"
    : isDark
      ? "rgba(200,195,185,0.85)"
      : "#2C3C2A";

  const scrolledBg = isDark
    ? "rgba(8,13,8,0.95)"
    : "rgba(240,237,230,0.96)";

  return (
    <>
      {/* Top scrim for transparent state */}
      {isHomePage && (
        <div
          className="fixed top-0 left-0 w-full z-[99] pointer-events-none"
          style={{ height: 130, background: "linear-gradient(to bottom, rgba(8,13,8,0.55) 0%, transparent 100%)" }}
          aria-hidden
        />
      )}

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
        className="fixed top-0 w-full z-[100] transition-all duration-500"
        style={{
          height: isTransparent ? 100 : 76,
          background: isTransparent ? "transparent" : scrolledBg,
          backdropFilter: isTransparent ? "none" : "blur(18px)",
          borderBottom: isTransparent ? "none" : `1px solid rgba(196,154,42,0.18)`,
          boxShadow: isTransparent ? "none" : "0 4px 32px rgba(0,0,0,0.28)",
        }}
      >
        {/* 3-color bottom rule on scroll */}
        {!isTransparent && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})` }}
          />
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">

          {/* ── LOGO ──────────────────────────────────────────────────────── */}
          <button onClick={() => navigate("/")} className="flex items-center group">
            <div className="flex items-baseline" style={{ fontFamily: display, fontWeight: 700, fontSize: "2rem" }}>
              <span style={{ color: B.cream }}>Herd</span>
              <span style={{ color: B.wheatGold }}>ERP</span>
            </div>
          </button>

          {/* ── DESKTOP NAV ───────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-8 translate-x-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative group text-[12px] font-bold uppercase transition-all duration-200"
                  style={{
                    color: isActive ? B.wheatGold : navTextColor,
                    fontFamily: display,
                    letterSpacing: "0.18em",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = B.wheatGold)}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? B.wheatGold : navTextColor)}
                >
                  {link.name}
                  <span
                    className="absolute -bottom-1.5 left-0 h-[1.5px] transition-all duration-250"
                    style={{
                      background: B.wheatGold,
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                  {!isActive && (
                    <span
                      className="absolute -bottom-1.5 left-0 w-0 h-[1.5px] transition-all duration-250 group-hover:w-full"
                      style={{ background: B.wheatGold }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT ACTIONS ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 transition-all duration-200"
              style={{ color: isTransparent ? "rgba(196,154,42,0.8)" : B.wheatGold }}
              onMouseEnter={e => (e.currentTarget.style.opacity = 0.8)}
              onMouseLeave={e => (e.currentTarget.style.opacity = 1)}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon size={18} fill="currentColor" /> : <Sun size={18} />}
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 font-bold text-[11px] uppercase tracking-widest transition-all duration-300"
              style={{
                fontFamily: display,
                letterSpacing: "0.15em",
                color: isTransparent ? B.cream : isDark ? B.cream : "#2C3C2A",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = B.wheatGold)}
              onMouseLeave={e => (e.currentTarget.style.color = isTransparent ? B.cream : isDark ? B.cream : "#2C3C2A")}
            >
              Login
            </Link>

            {/* Get Started CTA */}
            <Link
              href="/signup"
              className="hidden lg:flex items-center px-7 py-3 font-black text-[11px] uppercase tracking-widest transition-all duration-300 rounded-[3px]"
              style={{
                fontFamily: display,
                letterSpacing: "0.15em",
                background: B.wheatGold,
                color: "#0B120B",
                boxShadow: `0 4px 20px rgba(196,154,42,0.25)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#D4AA3A";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 6px 24px rgba(196,154,42,0.35)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = B.wheatGold;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(196,154,42,0.25)`;
              }}
            >
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
              style={{ color: isTransparent ? B.cream : isDark ? B.cream : "#1A2A1A" }}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ══ MOBILE MENU ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-[110] flex flex-col"
            style={{ background: isDark ? B.darkBg : "#F0EDE5" }}
          >
            {/* Brand stripe top */}
            <div
              className="w-full h-[3px]"
              style={{ background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})` }}
            />

            <div className="flex justify-between items-center px-8 py-6">
              <Image src="/erp-logo.png" alt="HerdERP" width={180} height={90}
                className="h-12 w-auto object-contain" />
              <button
                onClick={() => setMenuOpen(false)}
                style={{ color: isDark ? B.cream : "#1A2A1A" }}
                aria-label="Close menu"
              >
                <X size={30} />
              </button>
            </div>

            {/* Separator */}
            <div className="mx-8 h-px mb-8" style={{ background: "rgba(196,154,42,0.22)" }} />

            <div className="flex flex-col px-8 gap-2">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.38 }}
                  >
                    <button
                      onClick={() => navigate(link.href)}
                      className="block w-full text-left py-4 border-b transition-all duration-200 group"
                      style={{
                        fontFamily: "var(--font-barlow-condensed, serif)",
                        fontSize: "2.4rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        color: isActive ? B.forestGreen : isDark ? B.cream : "#1D3A1D",
                        borderBottomColor: "rgba(196,154,42,0.15)",
                        letterSpacing: "-0.02em",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = B.forestGreen)}
                      onMouseLeave={e => (e.currentTarget.style.color = isActive ? B.forestGreen : isDark ? B.cream : "#1D3A1D")}
                    >
                      {link.name}
                      <span
                        className="inline-block ml-2 text-base transition-opacity"
                        style={{ color: B.wheatGold, opacity: isActive ? 1 : 0 }}
                      >→</span>
                    </button>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.07 + 0.06 }}
                className="mt-6"
              >
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 w-full py-3.5 mb-3 font-bold text-sm uppercase tracking-widest transition-all duration-300"
                  style={{
                    fontFamily: mono,
                    background: "transparent",
                    color: isDark ? B.cream : "#1A2A1A",
                    border: `1.5px solid rgba(196,154,42,0.45)`,
                    letterSpacing: "0.18em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = B.wheatGold; e.currentTarget.style.color = B.wheatGold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(196,154,42,0.45)"; e.currentTarget.style.color = isDark ? B.cream : "#1A2A1A"; }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center gap-2 w-full py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300"
                  style={{ fontFamily: mono, background: B.forestGreen, color: "#fff", letterSpacing: "0.18em" }}
                  onMouseEnter={e => (e.currentTarget.style.background = B.lightGreen)}
                  onMouseLeave={e => (e.currentTarget.style.background = B.forestGreen)}
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Bottom trust line */}
            <div className="mt-auto px-8 pb-8 pt-4">
              <p className="text-[9px] uppercase tracking-[0.26em]"
                style={{ color: B.wheatGold, fontFamily: mono }}>
                ✦ Trusted by 1,200+ farms · 18 countries
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
