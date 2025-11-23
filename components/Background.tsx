'use client'

import React from 'react';
import { useFutureMode } from '@/lib/FutureModeContext';

const Background: React.FC = () => {
  const { isFutureMode } = useFutureMode();

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-emerald-50 future-mode:bg-slate-950 transition-colors duration-500">
      {/* Base Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isFutureMode ? 'bg-[#0a0a0f]' : 'bg-[#f0fdf4]'
      }`}></div>

      {/* Moving Gradient Mesh */}
      <div
        className={`absolute inset-0 opacity-60 animate-gradient-xy transition-opacity duration-500 ${
          isFutureMode ? 'opacity-40' : 'opacity-60'
        }`}
        style={{
          background: isFutureMode
            ? `
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3), transparent 50%),
              radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.25), transparent 50%),
              radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.25), transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.25), transparent 50%),
              radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.25), transparent 50%)
            `
            : `
              radial-gradient(circle at 50% 50%, rgba(167, 243, 208, 0.4), transparent 50%),
              radial-gradient(circle at 0% 0%, rgba(110, 231, 183, 0.3), transparent 50%),
              radial-gradient(circle at 100% 0%, rgba(134, 239, 172, 0.3), transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(94, 234, 212, 0.3), transparent 50%),
              radial-gradient(circle at 0% 100%, rgba(167, 243, 208, 0.3), transparent 50%)
            `,
          backgroundSize: '200% 200%',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Noise Texture */}
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 pointer-events-none transition-all duration-500 ${
        isFutureMode ? 'mix-blend-screen' : 'mix-blend-multiply'
      }`}></div>

      {/* Vignette */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
        isFutureMode
          ? 'bg-[radial-gradient(transparent_0%,#0a0a0f_100%)]'
          : 'bg-[radial-gradient(transparent_0%,#f0fdf4_100%)]'
      }`}></div>

      {/* Future Mode: Glowing Orbs */}
      {isFutureMode && (
        <>
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6), transparent 70%)',
              animationDuration: '4s',
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent 70%)',
              animationDuration: '6s',
              animationDelay: '2s',
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default Background;
