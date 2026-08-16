'use client';

import { ExternalLink, Link2, RotateCw, Trash2 } from 'lucide-react';
import type { PlacedItem } from './RoomCanvas';

export default function Inspector({ item, onChange, onDelete }: { item: PlacedItem | null; onChange: (patch: Partial<PlacedItem>) => void; onDelete: () => void }) {
  if (!item) return <div className="flex h-full items-center justify-center p-8 text-center text-xs text-slate-600">Select a product in the room to inspect its dimensions and placement.</div>;

  return (
    <div className="scrollbar h-full overflow-auto">
      <div className="border-b border-white/[0.06] p-4">
        <div className="flex items-start justify-between"><div><p className="eyebrow">{item.brand}</p><h2 className="mt-1 text-sm font-medium text-white">{item.name}</h2></div><button onClick={onDelete} className="control !px-2 text-rose-300"><Trash2 className="h-3 w-3" /></button></div>
      </div>

      <div className="p-4">
        <img src={item.image} alt="" className="aspect-[1.5] w-full rounded-xl object-cover" />
        <div className="mt-4 flex items-center justify-between"><span className="text-sm font-medium text-white">${item.price.toLocaleString()}</span><span className="rounded-full border border-teal-300/20 bg-teal-300/5 px-2 py-1 text-[8px] text-teal-200">Verified</span></div>

        <div className="mt-6">
          <p className="eyebrow">Physical dimensions</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[['W', item.width], ['D', item.depth], ['H', item.height]].map(([label, value]) => (
              <div key={label as string} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"><p className="text-[8px] text-slate-600">{label as string}</p><p className="mt-1 text-xs text-white">{value as number}"</p></div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="eyebrow">Scene scale</p>
          <input className="mt-4 w-full accent-teal-300" type="range" min=".5" max="1.5" step=".01" value={item.scale} onChange={(e) => onChange({ scale: Number(e.target.value) })} />
          <div className="mt-1 flex justify-between text-[9px] text-slate-600"><span>50%</span><span>{Math.round(item.scale * 100)}%</span><span>150%</span></div>
        </div>

        <div className="mt-6">
          <p className="eyebrow">Rotation</p>
          <div className="mt-3 flex items-center gap-2">
            <input className="field" type="number" value={item.rotation} onChange={(e) => onChange({ rotation: Number(e.target.value) })} />
            <span className="text-xs text-slate-600">deg</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="eyebrow">Fit check</p>
          <p className="mt-2 text-xs text-emerald-300">✓ Current room placement is within the configured scene.</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="control"><Link2 className="h-3 w-3" /> Product</button>
          <button className="control"><ExternalLink className="h-3 w-3" /> Buy online</button>
        </div>
      </div>
    </div>
  );
}
