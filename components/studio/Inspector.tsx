'use client';

import { ExternalLink, Link2, Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import type { PlacedItem } from './RoomCanvas';

export default function Inspector({ item, onChange, onDelete }: { item: PlacedItem | null; onChange: (patch: Partial<PlacedItem>) => void; onDelete: () => void }) {
  if (!item) return (
    <div className="flex h-full items-center justify-center p-6 text-center text-[10px] uppercase tracking-wider text-slate-500">
      <div className="w-full rounded-xl border border-[#222a38] bg-[#161c27] p-6">Select an object to inspect.</div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto space-y-4 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between rounded-xl border border-[#222a38] bg-[#161c27] p-3 shadow-md">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">{item.brand}</p>
          <h2 className="mt-1 text-xs font-bold text-white truncate pr-2">{item.name}</h2>
        </div>
        <button onClick={onDelete} className="rounded-md p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Depth / Z-Index Controls */}
      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Spatial Depth (Layering)</p>
        <div className="flex gap-2">
          <button 
            onClick={() => onChange({ zIndex: item.zIndex + 1 })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#222a38] bg-[#161c27] py-2 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowUpToLine className="h-3 w-3" /> Bring Forward
          </button>
          <button 
            onClick={() => onChange({ zIndex: Math.max(0, item.zIndex - 1) })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#222a38] bg-[#161c27] py-2 text-[9px] font-bold uppercase tracking-wider text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowDownToLine className="h-3 w-3" /> Send Backward
          </button>
        </div>
      </div>

      {/* Scale & Rotation */}
      <div className="space-y-3 rounded-xl border border-[#222a38] bg-[#161c27] p-3 shadow-md">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Scale Multiplier</span>
            <span className="font-mono text-[10px] text-white">{item.scale.toFixed(2)}x</span>
          </div>
          <input className="w-full accent-cyan-500 cursor-pointer" type="range" min=".5" max="1.5" step=".01" value={item.scale} onChange={(e) => onChange({ scale: Number(e.target.value) })} />
        </div>
        <div className="border-t border-[#222a38] pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Rotation (Z-Axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <input className="w-full rounded-md border border-[#222a38] bg-[#090c12] px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-500 transition-colors" type="number" value={item.rotation} onChange={(e) => onChange({ rotation: Number(e.target.value) })} />
          </div>
        </div>
      </div>
    </div>
  );
}