"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail, Phone, MapPin, Clock, Send, ChevronRight,
    MessageSquare, Headphones, Building2, CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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

// ─── Wheat SVG accent ─────────────────────────────────────────────────────────
const WheatIcon = ({ color = B.wheatGold, size = 13 }) => (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 13 20" fill="none" aria-hidden>
        <path
            d="M6.5 19V2M4 4.5l2.5-2.5 2.5 2.5M3 8l3.5-2.5L10 8M3 11.5l3.5-2.5 3.5 2.5M4 15.5l2.5-2 2.5 2M4.5 19l2-1.5 2 1.5"
            stroke={color} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>
);

// ─── Corner ticks component ───────────────────────────────────────────────────
function CornerTicks({ color = B.wheatGold, size = 7, hoverGrow = false }) {
    const cls = hoverGrow
        ? "absolute transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5"
        : "absolute";
    return (
        <>
            <div className={cls} style={{ top: 0, left: 0, width: size, height: size, borderLeft: `1.5px solid ${color}55`, borderTop: `1.5px solid ${color}55` }} />
            <div className={cls} style={{ top: 0, right: 0, width: size, height: size, borderRight: `1.5px solid ${color}55`, borderTop: `1.5px solid ${color}55` }} />
            <div className={cls} style={{ bottom: 0, left: 0, width: size, height: size, borderLeft: `1.5px solid ${color}55`, borderBottom: `1.5px solid ${color}55` }} />
            <div className={cls} style={{ bottom: 0, right: 0, width: size, height: size, borderRight: `1.5px solid ${color}55`, borderBottom: `1.5px solid ${color}55` }} />
        </>
    );
}

// ─── Contact cards data ───────────────────────────────────────────────────────
const contactCards = [
    {
        icon: Mail,
        label: "Email Support",
        value: "support@herderp.com",
        sub: "Response within 4 hours",
        accent: B.forestGreen,
        id: "SUPPORT_CHANNEL",
        href: "mailto:support@herderp.com",
    },
    {
        icon: Phone,
        label: "Phone / WhatsApp",
        value: "+92 300 123 4567",
        sub: "Mon–Sat · 9 am – 6 pm PKT",
        accent: B.wheatGold,
        id: "HOTLINE",
        href: "tel:+923001234567",
    },
    {
        icon: MapPin,
        label: "Head Office",
        value: "Lahore, Pakistan",
        sub: "Plot 14, Tech City, Lahore",
        accent: B.burntOrange,
        id: "HQ_LOCATION",
        href: "https://maps.google.com",
    },
    {
        icon: Clock,
        label: "Business Hours",
        value: "Sun – Thu",
        sub: "9:00 am – 6:00 pm PKT",
        accent: B.forestGreen,
        id: "HOURS",
        href: null,
    },
];

// ─── Support channels ─────────────────────────────────────────────────────────
const channels = [
    {
        icon: MessageSquare,
        title: "Live Chat",
        desc: "Instant answers for quick questions. Average response: under 2 minutes.",
        accent: B.forestGreen,
    },
    {
        icon: Headphones,
        title: "Priority Support",
        desc: "Dedicated 24/7 line for Professional & Enterprise subscribers.",
        accent: B.wheatGold,
    },
    {
        icon: Building2,
        title: "Enterprise Sales",
        desc: "Custom integrations, multi-farm ERP, and white-label options.",
        accent: B.burntOrange,
    },
];

// ─── FAQ items ────────────────────────────────────────────────────────────────
const faqs = [
    { q: "How long does onboarding take?", a: "Most farms are fully set up and running within one working day. Our onboarding team guides you through every step." },
    { q: "Do I need technical expertise to use HerdERP?", a: "No. HerdERP was designed for farmers first — not IT teams. If you can use a smartphone, you can use HerdERP." },
    { q: "Is my farm data secure?", a: "Yes. All data is encrypted at rest and in transit. We are SOC 2 compliant and never sell your data." },
    { q: "Can I migrate data from another system?", a: "Absolutely. Our team provides a free data migration service for all Professional and Enterprise plans." },
];

// ─── Form field component ─────────────────────────────────────────────────────
function Field({ label, id, type = "text", placeholder, value, onChange, isDark, accent, required }) {
    const [focused, setFocused] = useState(false);
    const textMain = isDark ? B.cream : "#1A2A1A";
    const inputBg = isDark ? "rgba(11,18,11,0.8)" : "rgba(238,233,223,0.85)";

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-[9px] uppercase tracking-[0.22em]"
                style={{ color: focused ? accent : B.muted, fontFamily: mono }}
            >
                {label}{required && <span style={{ color: B.burntOrange }}> *</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    rows={5}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        background: inputBg,
                        border: `1px solid ${focused ? accent + "80" : "rgba(196,154,42,0.2)"}`,
                        color: textMain,
                        fontFamily: sans,
                        fontSize: 13,
                        padding: "12px 14px",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.2s",
                    }}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        background: inputBg,
                        border: `1px solid ${focused ? accent + "80" : "rgba(196,154,42,0.2)"}`,
                        color: textMain,
                        fontFamily: sans,
                        fontSize: 13,
                        padding: "12px 14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                    }}
                />
            )}
        </div>
    );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({ q, a, isDark, accent }) {
    const [open, setOpen] = useState(false);
    const textMain = isDark ? B.cream : "#1A2A1A";
    const textSub = isDark ? B.offWhite : "#4A5A48";

    return (
        <div
            className="group overflow-hidden transition-all duration-300"
            style={{
                border: `1px solid ${open ? accent + "40" : "rgba(196,154,42,0.15)"}`,
                borderLeft: `3px solid ${open ? accent : accent + "40"}`,
                background: isDark
                    ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                    : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <span
                    className="text-sm font-semibold leading-snug"
                    style={{ color: textMain, fontFamily: sans }}
                >
                    {q}
                </span>
                <span
                    className="flex-shrink-0 ml-4 w-5 h-5 flex items-center justify-center transition-transform duration-300"
                    style={{
                        color: accent,
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        fontSize: 18,
                        lineHeight: 1,
                    }}
                >
                    +
                </span>
            </button>
            {open && (
                <div className="px-5 pb-4">
                    <div className="h-px mb-3" style={{ background: `rgba(196,154,42,0.14)` }} />
                    <p className="text-[12px] leading-relaxed" style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                        {a}
                    </p>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ContactPage() {
    const { isDark } = useTheme();

    const pageBg = isDark ? B.darkBg : "#EEE9DF";
    const textMain = isDark ? B.cream : "#1A2A1A";
    const textSub = isDark ? B.offWhite : "#4A5A48";

    // Form state
    const [form, setForm] = useState({ name: "", email: "", farm: "", topic: "", message: "" });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const updateField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate submission
        await new Promise(r => setTimeout(r, 1400));
        setSending(false);
        setSent(true);
    };

    return (
        <section
            className="relative min-h-screen overflow-hidden py-28"
            style={{ background: pageBg }}
        >
            {/* ══ BACKGROUND ══════════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Field-row grid */}
                <div className="absolute inset-0" style={{
                    backgroundImage: isDark
                        ? "linear-gradient(rgba(196,154,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,154,42,0.04) 1px,transparent 1px)"
                        : "linear-gradient(rgba(46,107,46,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(46,107,46,0.06) 1px,transparent 1px)",
                    backgroundSize: "48px 48px",
                }} />
                {/* Green bloom */}
                <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse 900px 600px at 20% 40%, rgba(46,107,46,0.1) 0%, transparent 70%)"
                }} />
                {/* Wheat warmth right */}
                <div className="absolute top-0 right-0 w-[600px] h-[500px]" style={{
                    background: "radial-gradient(ellipse at top right, rgba(196,154,42,0.07) 0%, transparent 65%)"
                }} />
                {/* Grain texture */}
                <div className="absolute inset-0" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "repeat", backgroundSize: "160px", mixBlendMode: "overlay",
                }} />
                {/* Left brand stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block" style={{
                    background: `linear-gradient(to bottom, transparent, ${B.forestGreen} 30%, ${B.wheatGold} 70%, transparent)`
                }} />
                {/* Right brand stripe */}
                <div className="absolute right-0 top-0 bottom-0 w-[3px] hidden xl:block" style={{
                    background: `linear-gradient(to bottom, transparent, ${B.burntOrange} 50%, transparent)`
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 space-y-20">

                {/* ══ SECTION HEADER ════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65 }}
                    className="text-center space-y-5"
                >
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-3">
                        <div className="w-6 h-px" style={{ background: B.wheatGold }} />
                        <WheatIcon />
                        <span className="text-[10px] uppercase tracking-[0.28em]"
                            style={{ color: B.wheatGold, fontFamily: mono }}>
                            We Are Always Listening
                        </span>
                        <WheatIcon />
                        <div className="w-6 h-px" style={{ background: B.wheatGold }} />
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontFamily: serif,
                        fontWeight: 700,
                        lineHeight: 1.0,
                        letterSpacing: "-0.03em",
                        fontSize: "clamp(2.8rem, 7vw, 5.2rem)",
                        color: textMain,
                    }}>
                        Get In <span style={{ color: B.forestGreen }}>Touch</span>{" "}
                        <span style={{ color: B.burntOrange, fontStyle: "italic" }}>With Us.</span>
                    </h1>

                    {/* Gradient rule */}
                    <div className="mx-auto" style={{
                        height: 2, width: 80,
                        background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold})`
                    }} />

                    <p className="text-sm max-w-xl mx-auto leading-relaxed"
                        style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                        Whether you're a small family farm or a large ranch operation — our team is here to help you
                        get the most from HerdERP. Reach out anytime.
                    </p>
                </motion.div>

                {/* ══ CONTACT CARDS ═════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {contactCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.5 }}
                            >
                                {/* Wrap in <a> only if href exists */}
                                {card.href ? (
                                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer" className="group relative block overflow-hidden transition-all duration-350"
                                        style={{
                                            background: isDark
                                                ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                                                : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
                                            border: `1px solid rgba(196,154,42,0.18)`,
                                            borderTop: `3px solid ${card.accent}`,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${card.accent}22`; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                        <ContactCardInner card={card} Icon={Icon} isDark={isDark} />
                                    </a>
                                ) : (
                                    <div className="group relative overflow-hidden"
                                        style={{
                                            background: isDark
                                                ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                                                : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
                                            border: `1px solid rgba(196,154,42,0.18)`,
                                            borderTop: `3px solid ${card.accent}`,
                                        }}
                                    >
                                        <ContactCardInner card={card} Icon={Icon} isDark={isDark} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ══ MAIN CONTENT: FORM + SUPPORT CHANNELS ════════════════════════════ */}
                <div className="grid lg:grid-cols-[1fr_420px] gap-10">

                    {/* ── Contact form ─────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                        style={{
                            background: isDark
                                ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                                : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
                            border: `1px solid rgba(196,154,42,0.18)`,
                            borderTop: `3px solid ${B.forestGreen}`,
                        }}
                    >
                        {/* Accent wash */}
                        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{
                            background: `linear-gradient(180deg, ${B.forestGreen}0E 0%, transparent 100%)`
                        }} />
                        <CornerTicks color={B.wheatGold} size={8} hoverGrow />

                        <div className="relative p-7 md:p-10">
                            {/* Form header */}
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2.5" style={{ background: `${B.forestGreen}18`, border: `1px solid ${B.forestGreen}35` }}>
                                    <Send className="w-4 h-4" style={{ color: B.forestGreen }} />
                                </div>
                                <div>
                                    <div className="text-[8px] uppercase tracking-[0.22em]" style={{ color: B.forestGreen, fontFamily: mono }}>
                                        Send a Message
                                    </div>
                                    <div className="text-[7.5px] uppercase tracking-widest" style={{ color: B.muted, fontFamily: mono }}>
                                        MSG_CHANNEL · SECURE
                                    </div>
                                </div>
                            </div>

                            <div className="h-px my-5" style={{ background: `linear-gradient(to right, ${B.forestGreen}55, transparent)` }} />

                            {sent ? (
                                /* ── Success state ── */
                                <div className="flex flex-col items-center gap-5 py-14 text-center">
                                    <CheckCircle2 className="w-14 h-14" style={{ color: B.forestGreen }} />
                                    <div>
                                        <p className="text-lg font-bold mb-1" style={{ color: textMain, fontFamily: serif }}>
                                            Message Received!
                                        </p>
                                        <p className="text-[12px] leading-relaxed" style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                                            Our team will get back to you within 4 hours. <br />
                                            Check your email for a confirmation.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setSent(false); setForm({ name: "", email: "", farm: "", topic: "", message: "" }); }}
                                        className="text-[10px] uppercase tracking-widest transition-colors duration-200"
                                        style={{ color: B.wheatGold, fontFamily: mono }}
                                        onMouseEnter={e => (e.currentTarget.style.color = B.forestGreen)}
                                        onMouseLeave={e => (e.currentTarget.style.color = B.wheatGold)}
                                    >
                                        Send another message →
                                    </button>
                                </div>
                            ) : (
                                /* ── Form fields ── */
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <Field label="Full Name" id="name" placeholder="John Harrington" required
                                            value={form.name} onChange={updateField("name")} isDark={isDark} accent={B.forestGreen} />
                                        <Field label="Email Address" id="email" type="email" placeholder="john@myfarm.pk" required
                                            value={form.email} onChange={updateField("email")} isDark={isDark} accent={B.forestGreen} />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <Field label="Farm / Company Name" id="farm" placeholder="Green Acres Ranch"
                                            value={form.farm} onChange={updateField("farm")} isDark={isDark} accent={B.wheatGold} />
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="topic"
                                                className="text-[9px] uppercase tracking-[0.22em]"
                                                style={{ color: B.muted, fontFamily: mono }}>
                                                Topic
                                            </label>
                                            <select
                                                id="topic"
                                                value={form.topic}
                                                onChange={updateField("topic")}
                                                style={{
                                                    background: isDark ? "rgba(11,18,11,0.8)" : "rgba(238,233,223,0.85)",
                                                    border: `1px solid rgba(196,154,42,0.2)`,
                                                    color: form.topic ? (isDark ? B.cream : "#1A2A1A") : B.muted,
                                                    fontFamily: sans,
                                                    fontSize: 13,
                                                    padding: "12px 14px",
                                                    outline: "none",
                                                    appearance: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <option value="" disabled>Select a topic…</option>
                                                <option value="sales">Sales & Pricing</option>
                                                <option value="support">Technical Support</option>
                                                <option value="demo">Request a Demo</option>
                                                <option value="enterprise">Enterprise Inquiry</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Field label="Message" id="message" type="textarea"
                                        placeholder="Tell us about your farm and how we can help…" required
                                        value={form.message} onChange={updateField("message")} isDark={isDark} accent={B.forestGreen} />

                                    {/* Submit CTA */}
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full flex items-center justify-center gap-2.5 py-4 font-semibold text-[10px] uppercase tracking-widest transition-all duration-300"
                                        style={{
                                            fontFamily: mono,
                                            background: sending ? B.deepGreen : B.forestGreen,
                                            color: "#fff",
                                            boxShadow: `0 4px 24px ${B.forestGreen}45`,
                                            opacity: sending ? 0.75 : 1,
                                            cursor: sending ? "not-allowed" : "pointer",
                                            letterSpacing: "0.18em",
                                        }}
                                        onMouseEnter={e => { if (!sending) e.currentTarget.style.background = B.lightGreen; }}
                                        onMouseLeave={e => { if (!sending) e.currentTarget.style.background = B.forestGreen; }}
                                    >
                                        {sending ? (
                                            <>
                                                <span className="animate-spin inline-block" style={{ borderTop: `2px solid #fff`, borderRight: `2px solid transparent`, borderRadius: "50%", width: 13, height: 13 }} />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Send Message
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[9px] uppercase tracking-widest" style={{ color: B.muted, fontFamily: mono }}>
                                        🔒 Your data is encrypted and never sold
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Right column: channels + office info ─────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-5"
                    >
                        {/* Support channels */}
                        {channels.map((ch, idx) => {
                            const Icon = ch.icon;
                            return (
                                <div key={idx} className="group relative overflow-hidden transition-all duration-300"
                                    style={{
                                        background: isDark
                                            ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                                            : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
                                        border: `1px solid rgba(196,154,42,0.15)`,
                                        borderLeft: `3px solid ${ch.accent}`,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${ch.accent}45`; e.currentTarget.style.borderLeftColor = ch.accent; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(196,154,42,0.15)"; e.currentTarget.style.borderLeftColor = ch.accent; }}
                                >
                                    {/* Top tint */}
                                    <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none" style={{
                                        background: `linear-gradient(180deg, ${ch.accent}0C 0%, transparent 100%)`
                                    }} />
                                    <div className="relative flex items-start gap-4 p-5">
                                        <div className="p-2.5 flex-shrink-0"
                                            style={{ background: `${ch.accent}15`, border: `1px solid ${ch.accent}35` }}>
                                            <Icon className="w-4 h-4" style={{ color: ch.accent }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.22em] mb-1"
                                                style={{ color: ch.accent, fontFamily: mono }}>
                                                {ch.title}
                                            </p>
                                            <p className="text-[11px] leading-relaxed"
                                                style={{ color: textSub, fontFamily: sans, fontWeight: 300 }}>
                                                {ch.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Live status widget */}
                        <div className="relative overflow-hidden p-5"
                            style={{
                                background: isDark
                                    ? "linear-gradient(160deg, rgba(15,26,15,0.97) 0%, rgba(11,18,11,0.99) 100%)"
                                    : "linear-gradient(160deg, rgba(248,244,236,0.97) 0%, rgba(232,226,214,0.99) 100%)",
                                border: `1px solid ${B.forestGreen}30`,
                                borderTop: `3px solid ${B.forestGreen}`,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-80"
                                        style={{ background: B.forestGreen }} />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                                        style={{ background: B.forestGreen }} />
                                </span>
                                <span className="text-[8px] uppercase tracking-widest"
                                    style={{ color: B.forestGreen, fontFamily: mono }}>
                                    Support currently online
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "&lt;2 min", label: "Avg chat response" },
                                    { value: "4h", label: "Email response" },
                                    { value: "98.4%", label: "Satisfaction" },
                                ].map(({ value, label }, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-lg font-bold leading-none mb-0.5"
                                            style={{ color: i === 0 ? B.forestGreen : i === 1 ? B.wheatGold : B.burntOrange, fontFamily: serif }}
                                            dangerouslySetInnerHTML={{ __html: value }} />
                                        <div className="text-[8px] uppercase tracking-widest"
                                            style={{ color: B.muted, fontFamily: mono }}>
                                            {label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ══ FAQ SECTION ═══════════════════════════════════════════════════════ */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="w-6 h-px" style={{ background: B.wheatGold }} />
                        <WheatIcon />
                        <span className="text-[10px] uppercase tracking-[0.26em]"
                            style={{ color: B.wheatGold, fontFamily: mono }}>
                            Frequently Asked Questions
                        </span>
                        <div className="flex-1 h-px" style={{ background: "rgba(196,154,42,0.15)" }} />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.5 }}
                            >
                                <FaqItem
                                    q={faq.q} a={faq.a}
                                    isDark={isDark}
                                    accent={idx % 3 === 0 ? B.forestGreen : idx % 3 === 1 ? B.wheatGold : B.burntOrange}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ══ BOTTOM CTA BANNER ════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* 3-colour brand divider */}
                    <div className="w-full h-[2px] mb-px" style={{
                        background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`
                    }} />

                    <div className="grid grid-cols-1 sm:grid-cols-3"
                        style={{ border: `1px solid rgba(196,154,42,0.18)`, borderTop: "none" }}>
                        {[
                            { icon: "🌱", label: "Free 30-Day Trial", accent: B.forestGreen },
                            { icon: "⚡", label: "Response Within 4 Hours", accent: B.wheatGold },
                            { icon: "🔒", label: "Enterprise-Grade Security", accent: B.burntOrange },
                        ].map((item, idx) => (
                            <div key={idx}
                                className="flex items-center justify-center gap-2.5 py-5 transition-colors duration-250"
                                style={{
                                    background: isDark ? B.cardDark : "rgba(240,236,228,0.9)",
                                    borderRight: idx < 2 ? "1px solid rgba(196,154,42,0.14)" : "none",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(46,107,46,0.1)" : "rgba(46,107,46,0.06)")}
                                onMouseLeave={e => (e.currentTarget.style.background = isDark ? B.cardDark : "rgba(240,236,228,0.9)")}
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

            </div>
        </section>
    );
}

// ─── Internal card content (shared between <a> and <div> wrappers) ─────────────
function ContactCardInner({ card, Icon, isDark }) {
    const textMain = isDark ? "#F5F0E8" : "#1A2A1A";
    const textSub = isDark ? "#DDD7CA" : "#4A5A48";
    const mono = "var(--font-mono)";
    const serif = "var(--font-display)";
    const B_muted = "#7A8870";

    return (
        <>
            {/* Top accent wash */}
            <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{
                background: `linear-gradient(180deg, ${card.accent}0D 0%, transparent 100%)`
            }} />
            <CornerTicks color={card.accent} size={7} hoverGrow />

            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5" style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}35` }}>
                        <Icon className="w-4 h-4" style={{ color: card.accent }} />
                    </div>
                    <div className="text-[7.5px] uppercase tracking-widest" style={{ color: B_muted, fontFamily: mono }}>
                        {card.id}
                    </div>
                </div>

                <div className="text-[9px] uppercase tracking-[0.22em] mb-1"
                    style={{ color: card.accent, fontFamily: mono }}>
                    {card.label}
                </div>

                <p className="text-[15px] font-bold leading-snug mb-1"
                    style={{ color: textMain, fontFamily: serif }}>
                    {card.value}
                </p>

                <p className="text-[10px] leading-snug"
                    style={{ color: B_muted, fontFamily: mono }}>
                    {card.sub}
                </p>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: card.accent }} />
            </div>
        </>
    );
}