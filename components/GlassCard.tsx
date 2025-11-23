'use client'

import React from 'react';
import { useFutureMode } from '@/lib/FutureModeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  const { isFutureMode } = useFutureMode();

  return (
    <div
      className={`
        relative overflow-hidden backdrop-blur-xl rounded-ios-lg shadow-xl transition-all duration-300 ease-out
        ${isFutureMode
          ? 'bg-slate-900/40 border border-cyan-500/20'
          : 'bg-glass-100 border border-emerald-900/10'
        }
        ${hoverEffect
          ? isFutureMode
            ? 'hover:scale-[1.01] hover:bg-slate-900/60 hover:shadow-2xl hover:border-cyan-500/40 hover:shadow-cyan-500/20 group'
            : 'hover:scale-[1.01] hover:bg-glass-200 hover:shadow-2xl hover:border-emerald-900/20 hover:shadow-emerald-500/10 group'
          : ''
        }
        ${className}
      `}
    >
      {/* Subtle Inner Highlight */}
      <div className={`absolute inset-0 border rounded-ios-lg pointer-events-none transition-colors ${
        isFutureMode ? 'border-cyan-500/10' : 'border-emerald-900/5'
      }`}></div>

      {/* Inner Glow on Hover */}
      {hoverEffect && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isFutureMode
            ? 'bg-gradient-to-tr from-cyan-500/10 via-purple-500/5 to-transparent'
            : 'bg-gradient-to-tr from-emerald-900/5 via-transparent to-transparent'
        }`} />
      )}

      {/* Future Mode: Animated Border Glow */}
      {isFutureMode && hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-ios-lg bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy blur-xl" />
        </div>
      )}

      {children}
    </div>
  );
};

export default GlassCard;
