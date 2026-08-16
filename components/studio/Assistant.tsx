'use client';

import { ArrowUp, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function Assistant({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');

  function run() {
    setAnswer(prompt ? `I would interpret “${prompt}” as a scene change. In production, this request would be resolved against the room geometry, catalog constraints, and current project inventory.` : 'Try a request such as “Find a sofa under $2,000 that fits this wall.”');
  }

  return (
    <div className="absolute bottom-4 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-white/[0.10] bg-[#10141a]/95 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-teal-200" /><span className="text-xs font-medium text-white">Room Assistant</span></div><button onClick={onClose}><X className="h-4 w-4 text-slate-600 hover:text-white" /></button></div>
      <p className="mt-2 text-[10px] leading-4 text-slate-600">Ask about style, product constraints, dimensions, or the current arrangement.</p>
      {answer && <div className="mt-3 rounded-xl bg-white/[0.035] p-3 text-[10px] leading-5 text-slate-400">{answer}</div>}
      <div className="mt-3 flex items-end gap-2"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="field min-h-10 resize-none" placeholder="What would you like to change?" /><button onClick={run} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-300/15 text-teal-100 hover:bg-teal-300/25"><ArrowUp className="h-4 w-4" /></button></div>
    </div>
  );
}
