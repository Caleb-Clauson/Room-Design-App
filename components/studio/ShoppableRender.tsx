'use client';

import { useState } from 'react';
import { ShoppingBag, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { NormalizedProduct } from '../../types/scene';

type Hotspot = {
  id: string;
  x: number; // Percentage X
  y: number; // Percentage Y
  product: NormalizedProduct;
};

export default function ShoppableRender({ imageUrl, hotspots }: { imageUrl: string, hotspots: Hotspot[] }) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-[#222a38] bg-[#07090e] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      {/* The AI-Generated Room Render */}
      <img 
        src={imageUrl} 
        alt="AI Redesigned Room" 
        className="w-full h-auto object-cover"
        draggable={false}
      />

      {/* Shoppable Hotspot Tags */}
      {hotspots.map((spot) => (
        <div 
          key={spot.id}
          className="absolute z-20"
          style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setActiveHotspot(spot.id)}
          onMouseLeave={() => setActiveHotspot(null)}
        >
          {/* Pulsing Tag Dot */}
          <button className="relative flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-transform hover:scale-110">
            <ShoppingBag className="h-3 w-3" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40"></span>
          </button>

          {/* Product Popover Card */}
          {activeHotspot === spot.id && (
            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-48 rounded-xl border border-[#222a38] bg-[#10141d]/95 p-3 backdrop-blur-md shadow-2xl transition-all">
              <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Verified Match
              </div>
              <h4 className="text-xs font-bold text-white leading-tight mb-1">{spot.product.name}</h4>
              <p className="text-[10px] text-slate-400 mb-3">{spot.product.supplier}</p>
              
              <div className="flex items-center justify-between border-t border-[#222a38] pt-2">
                <span className="font-mono text-xs font-bold text-emerald-400">${spot.product.price}</span>
                <a 
                  href={spot.product.vendorUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded bg-cyan-500 px-2 py-1 text-[9px] font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Buy <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Viewport Overlay UI */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 backdrop-blur-md px-4 py-2 border border-white/10 shadow-lg">
        <h3 className="text-xs font-bold text-white mb-0.5">AI Redesign Complete</h3>
        <p className="text-[10px] text-slate-400">Hover over items to view verified supplier products.</p>
      </div>
    </div>
  );
}