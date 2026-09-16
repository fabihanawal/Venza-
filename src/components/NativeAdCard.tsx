import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdSlotConfig } from '../types';

interface NativeAdCardProps {
  ad: AdSlotConfig;
  className?: string;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ ad, className = '' }) => {
  if (!ad.active) return null;

  return (
    <div className={`relative bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-100 p-4 shadow-sm flex flex-col justify-between overflow-hidden group ${className}`}>
      {/* Sponsored Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-xs">
          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
          স্পনসরড (বিজ্ঞাপন)
        </span>
        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
          {ad.sponsorName}
        </span>
      </div>

      {/* Ad Visual */}
      <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-slate-200">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Title & CTA */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 mb-3 group-hover:text-emerald-700 transition-colors">
          {ad.title}
        </h4>

        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>বিস্তারিত জানুন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
