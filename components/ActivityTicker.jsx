"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const entries = [
    "● COW-1042 HEALTH ALERT CLEARED // 09:42 AM",
    "◆ MILK-BATCH-089 SUBMITTED: 1,240L // 08:15 AM",
    "▲ ZONE-B SENSOR TEMP: 32.4°C // NOMINAL",
    "● HERD-204 BREEDING CYCLE: DAY 14 // ON_TRACK",
    "◆ FEED-STOCK ZONE-A: 68% REMAINING // REFILL IN 3 DAYS",
    "▲ COW-0881 VACCINATION COMPLETE // VET-DR.AHMED",
    "● MILK-YIELD TODAY: 14,280L ↑ 6.2% // ABOVE_TARGET",
    "◆ ZONE-C GATE OPENED: 07:30 AM // AUTH_GRANTED",
];

// Duplicate for seamless loop
const content = [...entries, ...entries];

export default function ActivityTicker() {
    const { isDark } = useTheme();

    return (
        <div
            className={`relative w-full h-10 overflow-hidden flex items-center ${isDark
                    ? "bg-neutral-900 border-y border-white/5"
                    : "bg-stone-100 border-y border-stone-300"
                }`}
        >
            {/* Left fade mask */}
            <div
                className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                    background: `linear-gradient(to right, ${isDark ? "#111111" : "#f5f3ef"
                        } 0%, transparent 100%)`,
                }}
            />
            {/* Right fade mask */}
            <div
                className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                    background: `linear-gradient(to left, ${isDark ? "#111111" : "#f5f3ef"
                        } 0%, transparent 100%)`,
                }}
            />

            {/* Scrolling content */}
            <motion.div
                className="flex items-center gap-0 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
                {content.map((entry, idx) => (
                    <span
                        key={idx}
                        className={`text-[10px] uppercase px-4 ${isDark ? "text-neutral-400" : "text-stone-500"
                            }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono, monospace)" }}
                    >
                        {entry}
                        <span className="mx-4 text-green-500">·</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
