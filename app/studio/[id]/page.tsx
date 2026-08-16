'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Box, ChevronDown, ChevronRight, CircleHelp, Download, Eye, Layers3,
  Maximize2, Minus, MousePointer2, Plus, RotateCw, Save, Search, ShoppingBag,
  Sparkles, Trash2, Undo2, Redo2, X
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  category: string;
  dimensions: string;
};

type SceneItem = Product & { x: number; y: number; scale: number; rotation: number };

const catalog: Product[] = [
  { id: 'sofa-01', name: 'Larsen 3-Seat Sofa', vendor: 'Verified Catalog', price: 1899, category: 'Seating', dimensions: '86" W × 38" D × 32" H' },
  { id: 'table-01', name: 'Oakline Dining Table', vendor: 'Verified Catalog', price: 1295, category: 'Tables', dimensions: '72" W × 36" D × 30" H' },
  { id: 'lamp-01', name: 'Arc Floor Lamp', vendor: 'Verified Catalog', price: 349, category: 'Lighting', dimensions: '18" W × 18" D × 68" H' },
  { id: 'chair-01', name: 'Cove Accent Chair', vendor: 'Verified Catalog', price: 799, category: 'Seating', dimensions: '31" W × 33" D × 30" H' },
];

const initialItems: SceneItem[] = [
  { ...catalog[0], x: 42, y: 62, scale: 1, rotation: 0 },
  { ...catalog[2], x: 73, y: 48, scale: .75, rotation: 0 },
];

export default function StudioPage({ params }: { params: { id: string } }) {
  const [items, setItems] = useState<SceneItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>('sofa-01');
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [zoom, setZoom] = useState(100);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function addProduct(product: Product) {
    const item: SceneItem = { ...product, x: 52, y: 50, scale: .8, rotation: 0 };
    setItems((current) => [...current, item]);
    setSelectedId(product.id);
  }

  function updateSelected(patch: Partial<SceneItem>) {
    setItems((current) => current.map((item) => item.id === selectedId ? { ...item, ...patch } : item));
  }

  function removeSelected() {
    if (!selectedId) return;
    setItems((current) => current.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#05070b] text-slate-300">
      <header className="flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#080b12]/90 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="button !px-2.5"><ArrowLeft className="h-4 w-4" /></a>
          <div className="h-5 w-px bg-white/[0.08]" />
          <div>
            <p className="text-xs font-semibold text-white">{params.id === 'new' ? 'Untitled Project' : 'Oak Street Living Room'}</p>
            <p className="text-[9px] uppercase tracking-[.18em] text-emerald-400">Saved just now</p>
          </div>
        </div>

        <div className="hidden items-center gap-1 rounded-xl border border-white/[0.07] bg-black/20 p-1 md:flex">
          <button className="button !border-0 !bg-transparent !px-2.5"><Undo2 className="h-3.5 w-3.5" /></button>
          <button className="button !border-0 !bg-transparent !px-2.5"><Redo2 className="h-3.5 w-3.5" /></button>
        </div>

        <div className="flex items-center gap-2">
          <button className="button hidden sm:inline-flex"><Eye className="h-3.5 w-3.5" /> Preview</button>
          <a href="/checkout" className="button button-primary"><ShoppingBag className="h-3.5 w-3.5" /> Specs & Checkout</a>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-white/[0.07] bg-[#080b12] lg:flex lg:flex-col">
          <div className="border-b border-white/[0.06] p-4">
            <p className="eyebrow">Scene</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-cyan-400/[0.07] px-3 py-2 text-xs text-white">
              <Layers3 className="h-3.5 w-3.5 text-cyan-300" />
              Living Room
            </div>
          </div>
          <div className="scrollbar-thin flex-1 overflow-auto p-3">
            <div className="mb-2 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">
              <ChevronDown className="h-3 w-3" /> Objects
            </div>
            {items.map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition ${selectedId === item.id ? 'bg-cyan-400/10 text-white' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}>
                <Box className="h-3.5 w-3.5" />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setAssistantOpen(true)} className="m-3 flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3 text-left text-xs text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span><strong className="block">Spatial Assistant</strong><span className="text-[10px] text-slate-500">Ask about your scene</span></span>
          </button>
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col bg-[#070a10]">
          <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0c111a]/90 p-1 shadow-xl backdrop-blur-xl">
            <button className="button !border-0 !bg-transparent !px-2.5"><MousePointer2 className="h-3.5 w-3.5" /></button>
            <button className="button !border-0 !bg-transparent !px-2.5"><Maximize2 className="h-3.5 w-3.5" /></button>
            <button className="button !border-0 !bg-transparent !px-2.5"><RotateCw className="h-3.5 w-3.5" /></button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:40px_40px]" />
            <div
              className="relative aspect-[4/3] w-[min(76vw,900px)] overflow-hidden rounded-xl border border-white/[0.10] bg-gradient-to-br from-[#343a42] via-[#20252b] to-[#11151a] shadow-[0_30px_100px_rgba(0,0,0,.6)]"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,.12),transparent_38%),linear-gradient(180deg,transparent_58%,rgba(0,0,0,.32))]" />
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#5b4a3c]/70 to-transparent" />

              {items.map((item) => (
                <motion.button
                  key={`${item.id}-${item.x}-${item.y}`}
                  drag
                  dragMomentum={false}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                  onDragEnd={(_, info) => {
                    const rect = (e?.currentTarget as HTMLElement)?.parentElement?.getBoundingClientRect();
                    if (!rect) return;
                    updateSelected({
                      x: Math.max(5, Math.min(95, item.x + (info.offset.x / rect.width) * 100)),
                      y: Math.max(5, Math.min(95, item.y + (info.offset.y / rect.height) * 100)),
                    });
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg transition ${selectedId === item.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-white/40'}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%,-50%) rotate(${item.rotation}deg) scale(${item.scale})` }}
                >
                  <div className="flex h-24 w-44 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-br from-[#9b8068] to-[#3e332b] shadow-2xl">
                    <Box className="h-8 w-8 text-white/40" />
                  </div>
                  {selectedId === item.id && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-cyan-300">{item.name}</span>}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex h-12 items-center justify-between border-t border-white/[0.07] bg-[#080b12] px-4">
            <div className="flex items-center gap-1">
              <button className="button !px-2" onClick={() => setZoom(Math.max(50, zoom - 10))}><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-12 text-center text-[10px] text-slate-500">{zoom}%</span>
              <button className="button !px-2" onClick={() => setZoom(Math.min(160, zoom + 10))}><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <div className="text-[10px] text-slate-600">Canvas • Drag objects to position</div>
            <button className="button !px-2.5"><CircleHelp className="h-3.5 w-3.5" /></button>
          </div>
        </section>

        <aside className="hidden w-80 shrink-0 border-l border-white/[0.07] bg-[#080b12] xl:flex xl:flex-col">
          <div className="border-b border-white/[0.06] p-4">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow">Inspector</p><h2 className="mt-1 text-sm font-semibold text-white">{selected ? selected.name : 'Nothing selected'}</h2></div>
              {selected && <button onClick={removeSelected} className="button !px-2 text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
          </div>

          {selected ? (
            <div className="scrollbar-thin flex-1 overflow-auto p-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <p className="eyebrow">Product</p>
                <p className="mt-2 text-xs font-semibold text-white">{selected.vendor}</p>
                <p className="mt-1 text-xs text-slate-500">{selected.dimensions}</p>
                <p className="mt-3 text-sm font-semibold text-white">${selected.price.toLocaleString()}</p>
              </div>

              <div className="mt-6">
                <p className="eyebrow">Transform</p>
                <label className="mt-3 block text-xs text-slate-500">Scale</label>
                <input type="range" min=".4" max="1.8" step=".05" value={selected.scale} onChange={(e) => updateSelected({ scale: Number(e.target.value) })} className="mt-3 w-full accent-cyan-400" />
                <div className="mt-1 flex justify-between text-[10px] text-slate-600"><span>40%</span><span>{Math.round(selected.scale * 100)}%</span><span>180%</span></div>

                <label className="mt-5 block text-xs text-slate-500">Rotation</label>
                <input type="range" min="-180" max="180" value={selected.rotation} onChange={(e) => updateSelected({ rotation: Number(e.target.value) })} className="mt-3 w-full accent-cyan-400" />
                <div className="mt-1 text-right text-[10px] text-slate-600">{selected.rotation}°</div>
              </div>

              <div className="mt-6">
                <p className="eyebrow">Placement</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="glass-soft rounded-xl p-3"><span className="text-[9px] uppercase text-slate-600">X</span><p className="mt-1 text-xs text-white">{Math.round(selected.x)}%</p></div>
                  <div className="glass-soft rounded-xl p-3"><span className="text-[9px] uppercase text-slate-600">Y</span><p className="mt-1 text-xs text-white">{Math.round(selected.y)}%</p></div>
                </div>
              </div>

              <button className="button button-primary mt-6 w-full"><ShoppingBag className="h-3.5 w-3.5" /> Buy Online</button>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-600">Select an object in the scene.</div>
          )}

          <div className="border-t border-white/[0.06] p-3">
            <button onClick={() => setCatalogOpen(!catalogOpen)} className="flex w-full items-center justify-between rounded-xl p-2 text-left">
              <span className="flex items-center gap-2 text-xs font-semibold text-white"><ShoppingBag className="h-3.5 w-3.5 text-cyan-300" /> Verified Catalog</span>
              {catalogOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            {catalogOpen && (
              <div className="mt-2 max-h-48 space-y-2 overflow-auto">
                {catalog.map((product) => (
                  <button key={product.id} onClick={() => addProduct(product)} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.04]">
                    <div className="flex justify-between gap-2"><span className="text-[11px] font-semibold text-white">{product.name}</span><span className="text-[10px] text-slate-400">${product.price}</span></div>
                    <p className="mt-1 text-[9px] text-slate-600">{product.category} • {product.dimensions}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {assistantOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/50 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 20, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} className="w-full max-w-md rounded-2xl border border-white/[0.10] bg-[#0b0f17] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow">AI Room Redecorator</p><h2 className="mt-1 text-lg font-semibold text-white">Spatial Assistant</h2></div>
              <button className="button !px-2" onClick={() => setAssistantOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Describe the direction you want to explore. The production AI layer can turn this into scene operations.</p>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input mt-4 min-h-28 resize-none" placeholder="Try: Make the room warm, modern and add two accent chairs..." />
            <button onClick={() => setPrompt('Concept queued: warm modern palette with two accent chairs.')} className="button button-primary mt-3 w-full"><Sparkles className="h-3.5 w-3.5" /> Analyze Scene</button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
