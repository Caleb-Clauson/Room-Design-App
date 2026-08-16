'use client';

import { ArrowRight, Camera, Check, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AuthPage() {
  const [signup, setSignup] = useState(false);

  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-5">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0f14] shadow-2xl lg:grid-cols-[1.15fr_.85fr]">
        <section className="relative hidden min-h-[720px] overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(125deg,#25211d,#17191a_48%,#101416)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_28%,rgba(255,255,255,.14),transparent_22%),linear-gradient(180deg,transparent_35%,rgba(0,0,0,.72))]" />
          <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black/65 to-transparent" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Layers3 className="h-4 w-4 text-teal-200" />
              </div>
              <span className="text-sm font-semibold text-white">Nest & Frame</span>
            </div>
            <div className="mt-auto max-w-xl">
              <p className="eyebrow text-teal-200/70">Room intelligence</p>
              <h1 className="mt-3 text-5xl font-medium tracking-[-.035em] text-white">
                See the finished room before you buy anything.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300/70">
                Photograph your space, test real products at real dimensions, and turn the final design into a practical shopping and contractor plan.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Photo-based design', 'Real dimensions', 'Procurement ready'].map((x) => (
                  <span key={x} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] text-slate-300">
                    <Check className="h-3 w-3 text-teal-300" /> {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[720px] items-center p-8 sm:p-12">
          <div className="w-full">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-300/10 text-teal-200 lg:hidden"><Camera className="h-4 w-4" /></div>
            <p className="eyebrow mt-8 lg:mt-0">Nest & Frame Studio</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-white">{signup ? 'Create your workspace' : 'Welcome back'}</h2>
            <p className="mt-2 text-sm text-slate-500">{signup ? 'Start your first room visualization.' : 'Open your projects and continue designing.'}</p>

            <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }} className="mt-8 space-y-4">
              {signup && <input className="field" placeholder="Your name" required />}
              <input className="field" type="email" placeholder="Email address" required />
              <input className="field" type="password" placeholder="Password" minLength={8} required />
              <button className="control control-active w-full py-3.5" type="submit">
                {signup ? 'Create workspace' : 'Continue to Studio'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-teal-300" /><div><p className="text-xs text-white">Your projects stay private</p><p className="mt-1 text-[10px] leading-4 text-slate-600">Supabase authentication and row-level security can power the production account layer.</p></div></div>
              <div className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-teal-300" /><div><p className="text-xs text-white">Built for real spaces</p><p className="mt-1 text-[10px] leading-4 text-slate-600">The Studio is designed around room photos, dimensions and actual products—not abstract shapes.</p></div></div>
            </div>

            <button onClick={() => setSignup(!signup)} className="mt-7 w-full text-xs text-slate-600 hover:text-teal-200">
              {signup ? 'Already have an account? Sign in' : 'New to Nest & Frame? Create an account'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
