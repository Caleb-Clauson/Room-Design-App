'use client';

import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { useRef } from 'react';
import type { Product } from './ProductCatalog';

export type PlacedItem = Product & { x: number; y: number; scale: number; rotation: number };

export default function RoomCanvas({
  items,
  selectedId,
  onSelect,
  onMove,
  onRotate,
}: {
  items: PlacedItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, dx: number, dy: number) => void;
  onRotate: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={canvasRef} className="relative aspect-[4/3] w-[min(72vw,980px)] overflow-hidden rounded-lg border border-white/[0.09] bg-[#3c3833] shadow-[0_35px_100px_rgba(0,0,0,.55)]">
      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90" alt="Modern living room" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />

      {items.map((item) => (
        <motion.div
          key={item.id}
          drag
          dragMomentum={false}
          onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          onDragEnd={(_, info) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            onMove(item.id, (info.offset.x / rect.width) * 100, (info.offset.y / rect.height) * 100);
          }}
          className={`absolute cursor-grab active:cursor-grabbing ${selectedId === item.id ? 'z-30' : 'z-20'}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${Math.max(9, item.width / 5)}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
          }}
        >
          <div className={`relative overflow-hidden rounded-md ${selectedId === item.id ? 'ring-2 ring-teal-300 ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-white/50'}`}>
            <img src={item.image} alt={item.name} className="aspect-[1.35] w-full object-cover mix-blend-normal" draggable={false} />
            {selectedId === item.id && <button onClick={(e) => { e.stopPropagation(); onRotate(item.id); }} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#0d1116] text-white shadow-xl"><RotateCw className="h-3 w-3" /></button>}
          </div>
          {selectedId === item.id && <div className="mt-1 text-center text-[8px] font-medium text-teal-100">{item.name} · {item.width}" W</div>}
        </motion.div>
      ))}

      <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/45 px-2 py-1.5 text-[8px] text-white/70 backdrop-blur">
        Photo perspective · Drag to position
      </div>
    </div>
  );
}
