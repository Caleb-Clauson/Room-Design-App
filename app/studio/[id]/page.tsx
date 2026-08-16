'use client';

import React, { useState, use, Suspense } from 'react';
import { ArrowLeft, Box, Lightbulb, Image as ImageIcon, Sliders, Settings, Eye, Download, Search, Layers, Compass, Sun } from 'lucide-react';
import { NormalizedProduct } from '../../../types/scene';

const MOCK_LIBRARY_ITEMS: NormalizedProduct[] = [
  {
    id: 'lib-1',
    supplier: 'Article',
    sku: 'ART-SVEN-01',
    name: 'Leather Highrise Sofa',
    category: 'Furniture',
    price: 1699,
    dimensions: { width: 88, height: 32, depth: 38 },
    finish: 'Charme Tan',
    assetUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    vendorUrl: 'https://www.article.com'
  },
  {
    id: 'lib-2',
    supplier: 'Ferguson',
    sku: 'FERG-LIGHT-02',
    name: 'Modern Industrial Chandelier',
    category: 'Lighting',
    price: 420,
    dimensions: { width: 36, height: 24, depth: 36 },
    finish: 'Matte Black / Brass',
    assetUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    vendorUrl: 'https://www.ferguson.com'
  }
];

function StudioWorkspaceContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;

  const [activeLibraryTab, setActiveLibraryTab] = useState<'objects' | 'materials' | 'lights'>('objects');
  const [exposure, setExposure] = useState<number>(8.0);
  const [shadowBoost, setShadowBoost] = useState<number>(0.58);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <main className="flex h-screen w-screen flex-col bg-[#0b0e14] text-slate-300 overflow-hidden font-sans select-none">
      
      {/* Top Application Title Bar */}
      <header className="flex h-11 items-center justify-between border-b border-[#1b222d] bg-[#10141d] px-4 text-xs z-30">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> File
          </a>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-slate-200">Nest & Frame Studio — Interior Highrise* (ID: {roomId})</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#161c27] px-3 py-1 rounded-md border border-[#222a38] text-[11px] text-slate-400">
            <span>Twinmotion Engine 2026.1</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="/checkout" className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-md text-[11px] font-bold hover:bg-emerald-600/30 transition-all">
            <Download className="h-3 w-3" /> Export Spec Sheet
          </a>
        </div>
      </header>

      {/* Main Workspace Layout (Left Library | Center 3D Viewport | Right Properties) */}
      <div className="grid flex-1 grid-cols-[280px_1fr_320px] overflow-hidden">
        
        {/* Left Library Sidebar */}
        <aside className="flex border-r border-[#1b222d] bg-[#121720] overflow-hidden">
          {/* Left Vertical Icon Bar */}
          <div className="flex flex-col items-center gap-4 border-r border-[#1b222d] bg-[#0e1219] py-4 w-16 shrink-0">
            <button 
              onClick={() => setActiveLibraryTab('materials')} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] transition-colors ${activeLibraryTab === 'materials' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <ImageIcon className="h-5 w-5" /> Materials
            </button>
            <button 
              onClick={() => setActiveLibraryTab('objects')} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] transition-colors ${activeLibraryTab === 'objects' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Box className="h-5 w-5" /> Objects
            </button>
            <button 
              onClick={() => setActiveLibraryTab('lights')} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] transition-colors ${activeLibraryTab === 'lights' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Lightbulb className="h-5 w-5" /> Lights
            </button>
          </div>

          {/* Library Content Panel */}
          <div className="flex flex-1 flex-col p-4 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Library</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..." 
                  className="w-full rounded-lg border border-[#222a38] bg-[#090c12] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">Ferguson & Article Assets</div>
              {MOCK_LIBRARY_ITEMS.map((item) => (
                <div key={item.id} className="group cursor-pointer rounded-xl border border-[#222a38] bg-[#161c27] p-2.5 hover:border-cyan-500 transition-all">
                  <div className="h-20 w-full rounded-lg overflow-hidden mb-2 border border-[#1b222d]">
                    <img src={item.assetUrl} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-cyan-400">{item.supplier}</span>
                    <span className="text-emerald-400 font-semibold">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center 3D Viewport */}
        <section className="relative flex flex-col items-center justify-center bg-[#07090e] overflow-hidden">
          
          {/* Top Viewport Floating Toolbar */}
          <div className="absolute top-4 z-20 flex items-center gap-1 rounded-xl border border-[#222a38] bg-[#10141d]/90 p-1 backdrop-blur-md shadow-2xl">
            <button className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]">✋ Move</button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c27]">🔄 Rotate</button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c27]">⤢ Scale</button>
          </div>

          {/* Photorealistic 3D Scene Mockup Viewport */}
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" 
              alt="Highrise Interior Render" 
              className="absolute inset-0 h-full w-full object-cover filter brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[11px] font-mono text-slate-300">
              FPS: 60.0 • Triangles: 1.4M • PBR Raytracing Active
            </div>
          </div>
        </section>

        {/* Right Properties & Inspector Sidebar */}
        <aside className="flex flex-col border-l border-[#1b222d] bg-[#121720] overflow-y-auto p-4 space-y-6 text-xs">
          
          {/* Top Tab Switcher */}
          <div className="grid grid-cols-5 gap-1 border-b border-[#1b222d] pb-3 text-slate-500">
            <button className="flex flex-col items-center gap-1 text-cyan-400"><Sun className="h-4 w-4" /><span className="text-[9px]">Env</span></button>
            <button className="flex flex-col items-center gap-1 hover:text-slate-300"><Compass className="h-4 w-4" /><span className="text-[9px]">Camera</span></button>
            <button className="flex flex-col items-center gap-1 hover:text-slate-300"><Sliders className="h-4 w-4" /><span className="text-[9px]">Render</span></button>
            <button className="flex flex-col items-center gap-1 hover:text-slate-300"><Layers className="h-4 w-4" /><span className="text-[9px]">FX</span></button>
            <button className="flex flex-col items-center gap-1 hover:text-slate-300"><Settings className="h-4 w-4" /><span className="text-[9px]">Image</span></button>
          </div>

          {/* Exposure Properties */}
          <div className="space-y-4">
            <div className="font-bold text-white tracking-wider uppercase text-[10px]">Environment & Exposure</div>
            
            <div className="space-y-2 bg-[#161c27] p-3 rounded-xl border border-[#222a38]">
              <div className="flex justify-between text-slate-400">
                <span>Exposure</span>
                <span className="font-mono text-white">{exposure.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="1" max="16" step="0.1" value={exposure} 
                onChange={(e) => setExposure(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2 bg-[#161c27] p-3 rounded-xl border border-[#222a38]">
              <div className="flex justify-between text-slate-400">
                <span>Shadow Boost</span>
                <span className="font-mono text-white">{shadowBoost.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={shadowBoost} 
                onChange={(e) => setShadowBoost(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Selected Object Metadata */}
          <div className="rounded-xl border border-[#222a38] bg-[#161c27] p-4 space-y-3">
            <div className="font-bold text-white uppercase text-[10px] tracking-wider border-b border-[#222a38] pb-2">Selected Object Spec</div>
            <div className="flex justify-between text-slate-400"><span>Product</span><span className="font-medium text-white">Leather Highrise Sofa</span></div>
            <div className="flex justify-between text-slate-400"><span>Supplier</span><span className="text-cyan-400 font-medium">Article</span></div>
            <div className="flex justify-between text-slate-400"><span>Price</span><span className="text-emerald-400 font-bold">$1,699</span></div>
            
            <a href="https://www.article.com" target="_blank" rel="noreferrer" className="block w-full text-center mt-3 bg-cyan-500 text-slate-950 font-bold py-2 rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Open Vendor Portal →
            </a>
          </div>

        </aside>

      </div>
    </main>
  );
}

export default function ProfessionalStudioPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-[#07090e] text-xs font-bold text-cyan-400 uppercase tracking-widest">Loading Studio Environment...</div>}>
      <StudioWorkspaceContent params={params} />
    </Suspense>
  );
}