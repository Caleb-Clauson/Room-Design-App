'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Box, Lightbulb, Image as ImageIcon, Sliders, Settings, Download, Search, Layers, Compass, Sun, Sparkles, Grid3x3, MousePointer2 } from 'lucide-react';
import ProductCatalog, { PRODUCTS, type Product } from '../../../components/studio/ProductCatalog';
import Inspector from '../../../components/studio/Inspector';
import Assistant from '../../../components/studio/Assistant';

// 1. Keep the type import static for TypeScript
import type { PlacedItem } from '../../../components/studio/RoomCanvas';

// 2. Dynamically import the RoomCanvas component and disable SSR
const RoomCanvas = dynamic(() => import('../../../components/studio/RoomCanvas'), { ssr: false });

const startingItems: PlacedItem[] = [
  { ...PRODUCTS[0], x: 44, y: 61, scale: .82, rotation: 0, zIndex: 1 },
];

function StudioWorkspaceContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;

  // Global State
  const [items, setItems] = useState<PlacedItem[]>(startingItems);
  const [selectedId, setSelectedId] = useState<string | null>(startingItems[0]?.id || null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  
  // Viewport & Tools State
  const [zoom, setZoom] = useState(100);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [mobileView, setMobileView] = useState<'canvas' | 'library' | 'inspector'>('canvas');
  const [rightTab, setRightTab] = useState<'env' | 'camera' | 'object' | 'fx' | 'image'>('object');

  const selected = useMemo(() => items.find((x) => x.id === selectedId) ?? null, [items, selectedId]);

  function add(product: Product) {
    // New items spawn at the highest zIndex
    const highestZ = items.length > 0 ? Math.max(...items.map(i => i.zIndex)) : 0;
    const copy: PlacedItem = { ...product, id: `${product.id}-${Date.now()}`, x: 50, y: 50, scale: 0.8, rotation: 0, zIndex: highestZ + 1 };
    setItems((v) => [...v, copy]);
    setSelectedId(copy.id);
    setMobileView('canvas'); // Auto-switch to canvas on mobile when item added
  }

  function update(id: string, patch: Partial<PlacedItem>) {
    setItems((v) => v.map((x) => x.id === id ? { ...x, ...patch } : x));
  }

  function move(id: string, x: number, y: number) {
    setItems((v) => v.map((item) => item.id === id ? { ...item, x, y } : item));
  }

  return (
    <main className="flex h-[100dvh] w-screen flex-col bg-[#0b0e14] text-slate-300 overflow-hidden font-sans select-none">
      
      {/* Top Application Title Bar */}
      <header className="flex h-14 lg:h-11 items-center justify-between border-b border-[#1b222d] bg-[#10141d] px-4 text-xs z-30 shrink-0">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 lg:h-3.5 lg:w-3.5" /> <span className="hidden lg:inline">File</span>
          </a>
          <span className="text-slate-600 hidden lg:inline">|</span>
          <span className="font-semibold text-slate-200">Studio — {roomId === 'new' ? 'Untitled' : roomId}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => setAssistantOpen(true)} className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-md text-[11px] font-bold hover:bg-cyan-500/20 transition-all">
            <Sparkles className="h-3 w-3" /> AI Spatial Assistant
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a href="/checkout" className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 lg:py-1 rounded-md text-[11px] font-bold hover:bg-emerald-600/30 transition-all">
            <Download className="h-3 w-3" /> <span className="hidden lg:inline">Export Spec Sheet</span>
          </a>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Library Sidebar (Desktop Only, becomes active view on Mobile) */}
        <aside className={`${mobileView === 'library' ? 'flex w-full' : 'hidden'} lg:flex w-[280px] shrink-0 border-r border-[#1b222d] bg-[#121720] overflow-hidden`}>
          <div className="flex flex-1 flex-col p-4 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Verified Catalog</h2>
            <div className="flex-1">
              <ProductCatalog onAdd={add} />
            </div>
          </div>
        </aside>

        {/* Center 3D Viewport / Canvas */}
        <section className={`${mobileView === 'canvas' ? 'flex' : 'hidden'} lg:flex relative flex-1 flex-col items-center justify-center bg-[#07090e] overflow-hidden p-2 lg:p-0`}>
          
          {/* Floating Canvas Toolbar */}
          <div className="absolute top-4 z-20 flex items-center gap-1 rounded-xl border border-[#222a38] bg-[#10141d]/90 p-1 backdrop-blur-md shadow-2xl">
            <button className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"><MousePointer2 className="h-4 w-4" /></button>
            <button 
              onClick={() => setSnapToGrid(!snapToGrid)} 
              className={`p-2 rounded-lg transition-colors ${snapToGrid ? 'bg-[#222a38] text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-[#161c27]'}`}
              title="Toggle Grid Snapping"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>

          <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform w-full h-full flex items-center justify-center">
            <RoomCanvas 
              items={items} 
              selectedId={selectedId} 
              snapToGrid={snapToGrid}
              onSelect={setSelectedId} 
              onMove={move} 
              onRotate={(id) => update(id, { rotation: ((items.find((x) => x.id === id)?.rotation ?? 0) + 15) % 360 })} 
            />
          </div>
          
          {assistantOpen && <Assistant onClose={() => setAssistantOpen(false)} />}
        </section>

        {/* Right Properties & Inspector Sidebar */}
        <aside className={`${mobileView === 'inspector' ? 'flex w-full' : 'hidden'} lg:flex w-[320px] shrink-0 flex-col border-l border-[#1b222d] bg-[#121720] overflow-y-auto p-4 space-y-6 text-xs`}>
          <div className="grid grid-cols-5 gap-1 border-b border-[#1b222d] pb-3 text-slate-500">
            <button onClick={() => setRightTab('object')} className={`flex flex-col items-center gap-1 ${rightTab === 'object' ? 'text-cyan-400' : 'hover:text-slate-300'}`}><Sliders className="h-4 w-4" /><span className="text-[9px]">Object</span></button>
            <button onClick={() => setRightTab('env')} className={`flex flex-col items-center gap-1 ${rightTab === 'env' ? 'text-cyan-400' : 'hover:text-slate-300'}`}><Sun className="h-4 w-4" /><span className="text-[9px]">Env</span></button>
          </div>
          <div className="flex-1">
            {rightTab === 'object' && (
              <Inspector 
                item={selected} 
                onChange={(patch) => selected && update(selected.id, patch)} 
                onDelete={() => { if (selected) setItems((v) => v.filter((x) => x.id !== selected.id)); setSelectedId(null); }} 
              />
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <div className="flex lg:hidden items-center justify-around border-t border-[#1b222d] bg-[#10141d] p-3 shrink-0 pb-safe">
        <button onClick={() => setMobileView('library')} className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${mobileView === 'library' ? 'text-cyan-400' : 'text-slate-500'}`}><Box className="h-5 w-5" /> Library</button>
        <button onClick={() => setMobileView('canvas')} className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${mobileView === 'canvas' ? 'text-cyan-400' : 'text-slate-500'}`}><MousePointer2 className="h-5 w-5" /> Canvas</button>
        <button onClick={() => setMobileView('inspector')} className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${mobileView === 'inspector' ? 'text-cyan-400' : 'text-slate-500'}`}><Sliders className="h-5 w-5" /> Inspect</button>
      </div>
    </main>
  );
}

export default function ProfessionalStudioPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-[#07090e] text-xs font-bold text-cyan-400 uppercase tracking-widest">Loading Studio Workspace...</div>}>
      <StudioWorkspaceContent params={params} />
    </Suspense>
  );
}