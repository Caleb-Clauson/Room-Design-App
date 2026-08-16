'use client';

import { motion } from 'framer-motion';
import { FolderPlus, Grid2X2, MoreHorizontal, Plus, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

const projects = [
  { id: 'living-room', name: 'Oak Street Living Room', type: 'Interior', updated: '2 min ago', progress: 78, image: '/rooms/living-room.jpg' },
  { id: 'kitchen', name: 'Modern Kitchen', type: 'Interior', updated: 'Yesterday', progress: 54, image: '/rooms/kitchen.jpg' },
  { id: 'exterior', name: 'Front Exterior', type: 'Exterior', updated: '3 days ago', progress: 31, image: '/rooms/exterior.jpg' },
];

export default function DashboardPage() {
  const [query, setQuery] = useState('');

  const visible = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="app-shell min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-6 lg:px-9">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Nest & Frame</p>
            <p className="text-[9px] uppercase tracking-[.22em] text-slate-600">Studio</p>
          </div>
        </div>
        <a href="/auth" className="button">Sign out</a>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Your projects</h1>
            <p className="mt-2 text-sm text-slate-500">Create, visualize and prepare your next space.</p>
          </div>
          <a href="/studio/new" className="button button-primary">
            <Plus className="h-4 w-4" /> New Project
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
            <input className="input pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." />
          </div>
          <button className="button"><Grid2X2 className="h-4 w-4" /> Grid</button>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <a href="/studio/new" className="group flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.015] transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.025]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 transition group-hover:scale-105">
              <FolderPlus className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">Create a project</p>
            <p className="mt-1 text-xs text-slate-600">Start with a room photo or blank scene</p>
          </a>

          {visible.map((project, i) => (
            <motion.a
              key={project.id}
              href={`/studio/${project.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .06 }}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0f17] transition hover:-translate-y-1 hover:border-cyan-400/25"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(6,182,212,.14),transparent_30%)]" />
                <div className="absolute left-5 top-5 rounded-lg border border-white/[0.08] bg-black/30 px-2 py-1 text-[9px] font-bold uppercase tracking-[.18em] text-slate-400 backdrop-blur">
                  {project.type}
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">{project.name}</h2>
                    <p className="mt-1 text-xs text-slate-600">Updated {project.updated}</p>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}
