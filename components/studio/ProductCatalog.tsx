'use client';

import { Plus, Search, SlidersHorizontal, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  width: number;
  depth: number;
  height: number;
  image: string;
  vendorUrl?: string;
};

export const PRODUCTS: Product[] = [
  { id: 'sven-sofa', name: 'Sven Sofa', brand: 'Article', category: 'Sofas', price: 1899, width: 86, depth: 38, height: 34, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85' },
  { id: 'accent-chair', name: 'Modern Accent Chair', brand: 'Article', category: 'Chairs', price: 799, width: 31, depth: 33, height: 30, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=85' },
  { id: 'coffee-table', name: 'Oak Coffee Table', brand: 'Article', category: 'Tables', price: 649, width: 48, depth: 28, height: 16, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=700&q=85' },
  { id: 'floor-lamp', name: 'Arched Floor Lamp', brand: 'Verified vendor', category: 'Lighting', price: 349, width: 18, depth: 18, height: 68, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85' },
  { id: 'dining-table', name: 'Solid Oak Dining Table', brand: 'Verified vendor', category: 'Tables', price: 1295, width: 72, depth: 36, height: 30, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=85' },
  { id: 'rug', name: 'Wool Area Rug', brand: 'Verified vendor', category: 'Rugs', price: 599, width: 96, depth: 120, height: 0.5, image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=85' },
];

export default function ProductCatalog({ onAdd }: { onAdd: (product: Product) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const results = useMemo(() => PRODUCTS.filter((p) => {
    const q = p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase());
    return q && (category === 'All' || p.category === category);
  }), [query, category]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.06] p-4">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Catalog</p><h2 className="mt-1 text-sm font-medium text-white">Products for your room</h2></div><SlidersHorizontal className="h-4 w-4 text-slate-600" /></div>
        <div className="relative mt-4"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="field py-2 pl-9 text-xs" placeholder="Search furniture, lighting..." /></div>
        <div className="scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] ${category === c ? 'border-teal-300/30 bg-teal-300/10 text-teal-100' : 'border-white/[0.06] text-slate-600'}`}>{c}</button>)}</div>
      </div>
      <div className="scrollbar flex-1 space-y-3 overflow-auto p-3">
        {results.map((p) => (
          <div key={p.id} className="group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] transition hover:border-white/[0.13]">
            <div className="relative aspect-[1.55] overflow-hidden bg-slate-900">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[8px] text-white backdrop-blur"><Star className="h-2.5 w-2.5 fill-teal-300 text-teal-300" /> Verified</div>
            </div>
            <div className="p-3">
              <p className="text-[10px] text-slate-500">{p.brand}</p>
              <p className="mt-1 text-xs font-medium text-white">{p.name}</p>
              <div className="mt-2 flex items-end justify-between"><div><p className="text-sm font-medium text-white">${p.price.toLocaleString()}</p><p className="text-[8px] text-slate-600">{p.width}" W × {p.depth}" D × {p.height}" H</p></div><button onClick={() => onAdd(p)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-300/10 text-teal-200 hover:bg-teal-300/20"><Plus className="h-3.5 w-3.5" /></button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
