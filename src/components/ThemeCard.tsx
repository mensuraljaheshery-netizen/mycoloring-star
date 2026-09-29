'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface ThemeCardProps {
  name: string;
  category: string;
  description: string;
  slug: string;
}

export function ThemeCard({ name, category, description, slug }: ThemeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={'/theme/' + slug}>
      <div
        className="group relative rounded-3xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border-4 border-amber-100 flex flex-col justify-between overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(!isHovered)}
      >
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none z-20 flex justify-between p-3 animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
        )}

        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-slate-100 flex items-center justify-center border-2 border-slate-200">
          {!isHovered ? (
            <div className="w-full h-full bg-gradient-to-br from-amber-200 via-rose-200 to-sky-300 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-4xl mb-2">??</span>
              <span className="font-bold text-slate-800 text-lg">{name}</span>
              <span className="text-xs text-slate-600 bg-white/70 px-2 py-1 rounded-full mt-2">
                Color Preview
              </span>
            </div>
          ) : (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 text-center border-4 border-dashed border-slate-400 transition-all duration-300">
              <span className="text-4xl mb-2 grayscale">???</span>
              <span className="font-bold text-slate-900 text-lg uppercase tracking-wide">
                Color Me!
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full mt-2">
                Line Art Mode
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            {category}
          </span>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{name}</h3>
          <p className="text-slate-500 text-sm line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
