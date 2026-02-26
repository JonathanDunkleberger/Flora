"use client";

import { motion } from "framer-motion";

export function GardenWeather() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Dark storm overlay */}
      <div className="absolute inset-0 storm-overlay" />

      {/* Rain drops */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-slate-400/40"
          style={{
            left: `${(i * 3.3) % 100}%`,
            top: `-10px`,
            height: `${10 + (i % 3) * 5}px`,
          }}
          animate={{ y: [0, 400] }}
          transition={{
            duration: 0.6 + (i % 5) * 0.06,
            repeat: Infinity,
            delay: (i % 8) * 0.1,
            ease: "linear",
          }}
        />
      ))}

      {/* Storm message */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-slate-700/80 text-white/90 text-xs px-4 py-2 rounded-full backdrop-blur-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        Growth isn&apos;t linear. Tomorrow your garden heals.
      </motion.div>
    </div>
  );
}
