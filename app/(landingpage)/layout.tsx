import Header from "@/components/Header";
import NavigationLoader from "@/components/NavigationLoader";
import Footer from "@/components/Footer";

export default function LandingPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* Navigation progress loader — renders above everything */}
            <NavigationLoader />
            {/* Persistent header across all marketing/landing pages */}
            {/* <Header /> */}
            {children}
            {/* <Footer /> */}
        </>
    );
}




// You are a senior frontend performance engineer. I need your help to analyze and optimize my Next.js application because it is currently lagging due to heavy animations.

// Project Stack:

// Next.js (React)

// Tailwind CSS v4

// Framer Motion (for animations)

// Custom CSS keyframe animations

// Lucide React icons

// next-themes for dark/light mode

// Inline design system styles with gradients and glassmorphism effects

// Animations currently used:

// Framer Motion scroll animations using useScroll, useTransform

// Motion variants with staggerChildren

// Hover animations using spring physics

// Custom CSS keyframes:

// animate-breathe (glow pulse)

// animate-scan (moving scan line)

// shimmer-on-hover (button shimmer)

// Glassmorphism UI effects using backdrop-filter blur

// Problem:
// The website has many animations running simultaneously which causes the UI to lag and reduces smoothness during scrolling and interaction.

// Your tasks:

// Analyze the animation architecture and identify performance bottlenecks.

// Optimize Framer Motion usage:

// Reduce unnecessary motion components

// Replace heavy spring transitions with lighter tween transitions where possible

// Avoid excessive useScroll and useTransform calculations

// Optimize CSS animations:

// Reduce infinite keyframe animations

// Ensure animations use GPU-accelerated properties (transform, opacity)

// Optimize visual effects:

// Reduce heavy backdrop-filter blur usage

// Optimize gradients and glow effects

// Improve rendering performance:

// Prevent unnecessary React re-renders

// Use React.memo where appropriate

// Implement lazy loading for heavy animation components using dynamic imports.

// Ensure animations run only when elements are visible using viewport or IntersectionObserver.

// Provide optimized code examples and refactor suggestions.

// Ensure the final result keeps the design aesthetic but significantly improves performance and smoothness.

// Goal:
// Maintain a modern animated UI but achieve smooth 60 FPS performance and remove lag during scrolling or interaction.

// Return:

// Optimized code examples

// Performance improvement suggestions

// Refactored animation patterns

// Any architectural changes needed for scalable animation design.