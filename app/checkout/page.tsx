'use client';

import { ArrowLeft, Download, ExternalLink, FileText, ShoppingBag } from 'lucide-react';

const rows = [
  ['Sven Sofa', 'Article', 1, 1899, '86" W × 38" D × 34" H'],
  ['Arched Floor Lamp', 'Verified vendor', 1, 349, '18" W × 18" D × 68" H'],
];

export default function Checkout() {
  const total = rows.reduce((s, r) => s + Number(r[3]) * Number(r[2]), 0);
  return (
    <main className="app-shell min-h-screen">
      <header className="flex h-14 items-center justify-between border-b border-white/[0.06] px-5"><a href="/studio/living-room" className="control"><ArrowLeft className="h-3 w-3" /> Studio</a><span className="text-[9px] text-slate-600">Nest & Frame procurement</span></header>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="eyebrow">Procurement</p><h1 className="mt-2 text-3xl font-medium text-white">Room specification</h1><p className="mt-2 text-sm text-slate-500">Products currently placed in Oak Street Living Room.</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_330px]">
          <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-teal-200" /><span className="text-xs font-medium text-white">Bill of materials</span></div><button className="control"><Download className="h-3 w-3" /> Export</button></div>
            <div className="divide-y divide-white/[0.05]">{rows.map((r) => <div key={r[0] as string} className="grid grid-cols-[1fr_auto_auto] gap-5 p-5"><div><p className="text-xs font-medium text-white">{r[0] as string}</p><p className="mt-1 text-[9px] text-slate-600">{r[1] as string} · {r[4] as string}</p></div><span className="text-[10px] text-slate-500">Qty {r[2] as number}</span><span className="text-xs font-medium text-white">${Number(r[3]).toLocaleString()}</span></div>)}</div>
          </section>
          <aside className="panel h-fit p-5"><div className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-teal-200" /><span className="text-xs font-medium text-white">Order summary</span></div><div className="my-5 border-y border-white/[0.06] py-5"><div className="flex justify-between text-xs"><span className="text-slate-600">Products</span><span className="text-slate-300">{rows.length}</span></div><div className="mt-3 flex justify-between text-xs"><span className="text-slate-600">Estimated total</span><span className="text-white">${total.toLocaleString()}</span></div></div><button className="control control-active w-full"><ExternalLink className="h-3 w-3" /> Open vendor links</button><p className="mt-3 text-[9px] leading-4 text-slate-600">Live ordering should be enabled only after each catalog record has a verified current vendor URL and pricing source.</p></aside>
        </div>
      </div>
    </main>
  );
}
