"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

const NavigationContext = createContext({ isLoading: false, startLoading: () => { } });

export function NavigationProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const timerRef = useRef(null);

    // When the pathname actually changes, the new page has loaded — stop the loader
    useEffect(() => {
        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
            // Small delay so the bar reaches ~100% visually before disappearing
            timerRef.current = setTimeout(() => setIsLoading(false), 320);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [pathname]);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    return (
        <NavigationContext.Provider value={{ isLoading, startLoading }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
