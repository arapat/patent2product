'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Patent, LoadingState } from '@/lib/types';
import PatentCard from '@/components/PatentCard';
import SearchInput from '@/components/SearchInput';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { MOCK_PATENTS } from '@/lib/constants';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Patent[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [inputVal, setInputVal] = useState(query);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm) return;

    setStatus(LoadingState.LOADING);
    try {
      // Simulate API call - in a real app, you'd call your API here
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter patents based on search term
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = MOCK_PATENTS.filter(patent => {
        // Search in title
        if (patent.title.toLowerCase().includes(searchLower)) return true;

        // Search in abstract
        if (patent.abstract.toLowerCase().includes(searchLower)) return true;

        // Search in tags (if they exist)
        if (patent.tags && patent.tags.some(tag => tag.toLowerCase().includes(searchLower))) return true;

        return false;
      });

      setResults(filtered);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
      setResults([]);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const handleNewSearch = () => {
    if (inputVal !== query) {
      router.push(`/results?q=${encodeURIComponent(inputVal)}`);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header / Search Bar */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between mb-16 animate-fade-in">
        <div className="flex items-center gap-6">
            <button
                onClick={() => router.back()}
                className="group w-12 h-12 flex items-center justify-center rounded-full bg-white/50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all active:scale-90 shadow-sm"
            >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
            </button>
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Results for</h2>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">&quot;{query}&quot;</h1>
            </div>
        </div>
        <div className="w-full lg:w-1/2">
            <SearchInput
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onSearch={handleNewSearch}
                loading={status === LoadingState.LOADING}
            />
        </div>
      </div>

      {/* Content Area */}
      {status === LoadingState.LOADING ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-ios-lg bg-slate-200/50 animate-pulse border border-slate-200"></div>
            ))}
        </div>
      ) : status === LoadingState.ERROR ? (
        <div className="text-center py-20 bg-red-50 border border-red-200 rounded-ios-lg backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h3>
            <p className="text-red-700 mb-6">We couldn&apos;t reach the intelligence engine. Showing cached examples.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left p-6">
                {results.map(patent => (
                    <PatentCard key={patent.id} patent={patent} />
                ))}
            </div>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((patent) => (
                <PatentCard key={patent.id} patent={patent} />
                ))}
            </div>

            {results.length === 0 && (
                <div className="text-center py-24 text-slate-500">
                    <RefreshCw className="w-10 h-10 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No patents found. Try a different term.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between mb-16 animate-fade-in">
          <div className="flex items-center gap-6">
            <button className="group w-12 h-12 flex items-center justify-center rounded-full bg-white/50 border border-slate-200 shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Loading</h2>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Results...</h1>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-ios-lg bg-slate-200/50 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
