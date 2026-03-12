"use client";
import { useEffect, useRef } from "react";
import { useNavigation } from "@/context/NavigationContext";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
    forestGreen: "#2E6B2E",
    wheatGold: "#C49A2A",
    burntOrange: "#C4601A",
};

/**
 * Thin top-bar progress indicator.
 * Uses requestAnimationFrame for smooth GPU-accelerated transform animation.
 * Appears instantly on nav click, gracefully completes when route settles.
 */
export default function NavigationLoader() {
    const { isLoading } = useNavigation();
    const barRef = useRef(null);
    const glowRef = useRef(null);
    const rafRef = useRef(null);
    const progRef = useRef(0);   // 0–100
    const phaseRef = useRef("idle"); // "growing" | "completing" | "idle"

    useEffect(() => {
        const bar = barRef.current;
        const glow = glowRef.current;
        if (!bar || !glow) return;

        if (isLoading) {
            // ── Start: reset then animate to ~85% (never completes on its own)
            progRef.current = 0;
            phaseRef.current = "growing";
            bar.style.opacity = "1";
            glow.style.opacity = "1";

            const tick = () => {
                if (phaseRef.current !== "growing") return;
                // Decelerate: fast at first, very slow near 85%
                const remaining = 85 - progRef.current;
                progRef.current += remaining * 0.028;
                const pct = Math.min(progRef.current, 85);
                bar.style.transform = `scaleX(${pct / 100})`;
                glow.style.left = `${pct}%`;
                rafRef.current = requestAnimationFrame(tick);
            };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(tick);

        } else if (phaseRef.current === "growing") {
            // ── Complete: rush to 100% then fade out
            phaseRef.current = "completing";
            cancelAnimationFrame(rafRef.current);

            const complete = () => {
                if (phaseRef.current !== "completing") return;
                progRef.current += (100 - progRef.current) * 0.18;
                const pct = Math.min(progRef.current, 100);
                bar.style.transform = `scaleX(${pct / 100})`;
                glow.style.left = `${pct}%`;

                if (pct >= 99.5) {
                    // Fade out
                    bar.style.transition = "opacity 0.3s ease";
                    glow.style.transition = "opacity 0.3s ease";
                    bar.style.opacity = "0";
                    glow.style.opacity = "0";
                    setTimeout(() => {
                        phaseRef.current = "idle";
                        progRef.current = 0;
                        bar.style.transform = "scaleX(0)";
                        bar.style.transition = "none";
                        glow.style.transition = "none";
                    }, 310);
                    return;
                }
                rafRef.current = requestAnimationFrame(complete);
            };
            rafRef.current = requestAnimationFrame(complete);
        }

        return () => cancelAnimationFrame(rafRef.current);
    }, [isLoading]);

    return (
        <div
            aria-hidden
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: 999,
                pointerEvents: "none",
            }}
        >
            {/* Progress bar */}
            <div
                ref={barRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "left center",
                    transform: "scaleX(0)",
                    opacity: 0,
                    background: `linear-gradient(to right, ${B.forestGreen}, ${B.wheatGold}, ${B.burntOrange})`,
                    boxShadow: `0 0 10px ${B.forestGreen}80`,
                }}
            />
            {/* Leading glow dot */}
            <div
                ref={glowRef}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0%",
                    transform: "translateY(-50%) translateX(-50%)",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    opacity: 0,
                    background: B.wheatGold,
                    boxShadow: `0 0 12px 4px ${B.wheatGold}90`,
                }}
            />
        </div>
    );
}
