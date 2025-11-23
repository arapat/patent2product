'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Patent } from '../lib/types';
import GlassCard from './GlassCard';
import { ArrowRight, FileText, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface PatentCardProps {
  patent: Patent;
}

const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  const router = useRouter();

  const handlePrototype = () => {
    router.push(`/prototype/${patent.id}`);
  };

  return (
    <GlassCard hoverEffect className="flex flex-col h-full p-8 group/card">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6 gap-3">
        <a
          href={patent.page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200 hover:bg-emerald-200/50 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Patent
        </a>
        <a
          href={patent.pdf_local_path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-100/50 border border-blue-200 hover:bg-blue-200/50 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText className="w-3.5 h-3.5" />
          PDF
        </a>
      </div>

      <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 leading-tight group-hover/card:text-emerald-700 transition-colors">
        {patent.title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
        {patent.abstract}
      </p>

      {/* Images Gallery */}
      {patent.images && patent.images.length > 0 && (
        <div className="mb-6">
          <div className={`grid gap-2 ${
            patent.images.length === 1 ? 'grid-cols-1' :
            patent.images.length === 2 ? 'grid-cols-2' :
            patent.images.length === 3 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {patent.images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group/img"
              >
                <Image
                  src={img.local_path}
                  alt={`${patent.title} - Figure ${idx + 1}`}
                  fill
                  className="object-contain group-hover/img:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
          {patent.images.length > 4 && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              +{patent.images.length - 4} more images
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Tags */}
        {patent.tags && patent.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patent.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePrototype}
          className="w-full group/btn flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <span>Prototype This</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </GlassCard>
  );
};

export default PatentCard;
