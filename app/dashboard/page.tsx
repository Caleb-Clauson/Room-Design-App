'use client';

import { motion } from 'framer-motion';
import { Archive, ArrowUpRight, Camera, FileText, FolderPlus, Grid2X2, List, Search, Settings2, Sparkles } from 'lucide-react';
import { useState } from 'react';

const projects = [
  { id: 'living-room', name: 'Oak Street Living Room', room: 'Living room', status: 'Designing', updated: 'Today', scene: 'warm' },
  { id: 'kitchen', name: 'Kitchen Renovation', room: 'Kitchen', status: 'Shopping list ready', updated: 'Yesterday', scene: 'kitchen' },
  { id: 'exterior', name: 'Front Exterior', room: 'Exterior', status: 'Concept', updated: 'Aug 12', scene: 'exterior' },
];

function RoomPreview({ scene }: { scene: string }) {
  return (
    <div className={`relative h-full overflow-hidden ${
      scene === 'warm' ? 'bg-gradient-to-br from-[#7b695b] via-[#4a423d] to-[#1b1d1e]' :
      scene === 'kitchen' ? 'bg-gradient-to-br from-[#b7b0a5] via-[#6e6b65] to-[#292b2b]' :
      'bg-gradient-to-br from-[#65717a] via-[#3e474c] to-[#171b1d]'
    }`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,.17),transparent_30%),linear-gradient(180deg,transparent_52%,rgba(0,0,0,.45))]" />
      <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-gradient-to-t from-black/35 to-transparent" />
      <div className="absolute left-[17%] top-[20%] h-[42%] w-[40%] border border-white/10 bg-black/10" />
      <div className="absolute bottom-[17%] left-[25%] h-[17%] w-[45%] rounded-t-3xl bg-black/25" />
      <div className="absolute bottom-[18%] right-[18%] h-[31%] w-[5%] rounded-t-full bg-black/25" />
    </div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="app-shell min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-300/10 text-teal-200"><Sparkles className="h-4 w-4" /></div>
          <span className="text-sm font-semibold text-white">Nest & Frame</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="control hidden sm:flex"><Settings2 className="h-3.5 w-3.5" /> Settings</button>
          <a href="/auth" className="control">Sign out</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1450px] px-5 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">My workspace</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-white">Projects</h1>
            <p className="mt-2 text-sm text-slate-500">Your rooms, materials and procurement plans in one place.</p>
          </div>
          <a href="/studio/new" className="control control-active"><FolderPlus className="h-3.5 w-3.5" /> New room</a>
        </div>

        <div className="mt-8 flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="field py-2 pl-9" placeholder="Find a project..." />
          </div>
          <button className="control"><Grid2X2 className="h-3.5 w-3.5" /></button>
          <button className="control hidden sm:flex"><List className="h-3.5 w-3.5" /></button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <a href="/studio/new" className="group flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.012] transition hover:border-teal-300/30 hover:bg-teal-300/[0.02]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-teal-200 group-hover:bg-teal-300/10"><Camera className="h-4 w-4" /></div>
            <p className="mt-4 text-sm font-medium text-white">Start with a room photo</p>
            <p className="mt-1 text-xs text-slate-600">Upload a space and begin placing products</p>
          </a>

          {filtered.map((p, i) => (
            <motion.a key={p.id} href={`/studio/${p.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }} className="group overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0d1015] transition hover:-translate-y-0.5 hover:border-white/[0.14]">
              <div className="h-52"><RoomPreview scene={p.scene} /></div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-sm font-medium text-white">{p.name}</p><p className="mt-1 text-xs text-slate-600">{p.room} · Updated {p.updated}</p></div>
                  <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-teal-200" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] text-slate-500">{p.status}</span>
                  <span className="text-[10px] text-slate-600">Open Studio</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [Archive, 'Saved products', 'Keep products you may use later.'],
            [FileText, 'Spec sheets', 'Turn scenes into organized lists.'],
            [Sparkles, 'Room assistant', 'Use natural language to explore ideas.'],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-4">
              <Icon className="h-4 w-4 text-teal-200" />
              <p className="mt-4 text-xs font-medium text-white">{title as string}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-600">{text as string}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
