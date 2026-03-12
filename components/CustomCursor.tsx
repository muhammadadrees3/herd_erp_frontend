"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ring = ringRef.current;
        if (!ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let raf: number;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = target.closest(
                "a, button, [role='button'], input, textarea, select, label"
            );
            if (interactive) {
                ring.classList.add("is-hovering");
            } else {
                ring.classList.remove("is-hovering");
            }
        };

        const animate = () => {
            // Smooth follow
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseover", onMouseOver);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseover", onMouseOver);
            cancelAnimationFrame(raf);
        };
    }, []);

    return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
