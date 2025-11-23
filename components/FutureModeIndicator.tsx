'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFutureMode } from '@/lib/FutureModeContext'
import { Sparkles, Zap } from 'lucide-react'

export function FutureModeIndicator() {
  const { isFutureMode } = useFutureMode()

  return (
    <AnimatePresence>
      {isFutureMode && (
        <motion.div
          initial={{ opacity: 0, x: 20, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 right-6 z-40"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />

            {/* Main Badge */}
            <div className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 animate-gradient-xy opacity-50" />

              {/* Content */}
              <div className="relative flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 blur-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-xy">
                  FUTURE MODE
                </span>

                <div className="relative">
                  <Zap className="w-3 h-3 text-purple-400" />
                </div>
              </div>

              {/* Scan Line Effect */}
              <motion.div
                className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-purple-400/60" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400/60" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-pink-400/60" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
