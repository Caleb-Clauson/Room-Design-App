'use client';

import { ArrowLeft, CheckCircle2, Download, ExternalLink, FileText, ShoppingBag } from 'lucide-react';

const items = [
  { name: 'Larsen 3-Seat Sofa', vendor: 'Verified Catalog', qty: 1, price: 1899 },
  { name: 'Arc Floor Lamp', vendor: 'Verified Catalog', qty: 1, price: 349 },
];

export default function CheckoutPage() {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main className="app-shell min-h-screen">
      <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-6 lg:px-9">
        <a href="/studio/living-room" className="button"><ArrowLeft className="h-3.5 w-3.5" /> Back to Studio</a>
        <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Project ready</div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div>
          <p className="eyebrow">Procurement</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Contractor spec sheet</h1>
          <p className="mt-2 text-sm text-slate-500">A consolidated materials list from the current scene.</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-cyan-300" /><span className="text-sm font-semibold text-white">Bill of Materials</span></div>
              <button className="button"><Download className="h-3.5 w-3.5" /> Export PDF</button>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {items.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 p-5">
                  <div><p className="text-sm font-semibold text-white">{item.name}</p><p className="mt-1 text-xs text-slate-600">{item.vendor}</p></div>
                  <div className="text-xs text-slate-500">Qty {item.qty}</div>
                  <div className="text-sm font-semibold text-white">${(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel h-fit p-5">
            <div className="flex items-center gap-3"><ShoppingBag className="h-4 w-4 text-cyan-300" /><span className="text-sm font-semibold text-white">Order summary</span></div>
            <div className="mt-5 space-y-3 border-b border-white/[0.06] pb-5">
              <div className="flex justify-between text-xs"><span className="text-slate-500">Items</span><span className="text-slate-300">{items.length}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Subtotal</span><span className="text-slate-300">${total.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500">Shipping</span><span className="text-slate-600">Vendor calculated</span></div>
            </div>
            <div className="flex justify-between pt-5"><span className="text-sm font-semibold text-white">Estimated total</span><span className="text-lg font-semibold text-white">${total.toLocaleString()}</span></div>
            <button className="button button-primary mt-5 w-full"><ExternalLink className="h-3.5 w-3.5" /> Continue to Vendors</button>
            <p className="mt-3 text-center text-[10px] leading-4 text-slate-600">Live vendor pricing and checkout links should be populated from verified catalog records before production ordering.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
