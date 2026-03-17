// components/Loader.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Custom Spinner using Tailwind v4 animate-spin */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm font-medium text-slate-600 animate-pulse">
              Loading...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}