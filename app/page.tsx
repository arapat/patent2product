'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import { WarpBackground } from "@/components/ui/warp-background";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureMode } from '@/lib/FutureModeContext';
import { cn } from '@/lib/utils';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { isFutureMode } = useFutureMode();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <WarpBackground className="min-h-screen w-full p-0 border-none rounded-none">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <Card className={cn(
          "max-w-4xl w-full backdrop-blur-sm shadow-xl transition-colors duration-300",
          isFutureMode 
            ? "bg-slate-900/95 border-cyan-500/30" 
            : "bg-white/90 border-slate-200/50"
        )}>
          <CardContent className="text-center space-y-10 animate-fade-in p-12">
            {/* Hero Text */}
            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-slate-900 drop-shadow-sm">
              See the <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">Future.</span> <br />
              Before It Ships.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                Transform patent drawings into photorealistic product renderings. Visualize unreleased technology from Apple, Tesla, Meta, and beyond—instantly.
            </p>

            {/* Search Section */}
            <div className="flex justify-center pt-8 w-full">
                <div className="w-full max-w-2xl transform transition-transform hover:scale-[1.01] duration-300">
                    <SearchInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onSearch={handleSearch}
                        large
                        placeholder="Search patents (e.g., 'AR glasses', 'flying car', 'humanoid robot')"
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-3 pt-4 opacity-70">
                {['Consumer Electronics', 'Automotive', 'Aerospace', 'Wearables', 'Robotics'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => {
                            setQuery(tag);
                        }}
                        className="text-xs font-medium px-4 py-2 rounded-full border border-slate-300 hover:bg-emerald-100/50 hover:border-emerald-300 transition-all text-slate-500 hover:text-emerald-700 active:scale-95"
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </WarpBackground>
  );
}
