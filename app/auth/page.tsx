'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080b12]/90 shadow-2xl lg:grid-cols-[1.1fr_.9fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,.20),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,.16),transparent_35%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <Layers3 className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Nest & Frame</p>
                <p className="text-[10px] uppercase tracking-[.2em] text-slate-500">Studio</p>
              </div>
            </div>

            <div className="mt-auto max-w-xl">
              <p className="eyebrow">Professional visual workspace</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
                Design the room before you build it.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                Organize rooms, products, dimensions, finishes and procurement in one visual workspace.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Visual', 'Photo-based layouts'],
                  ['Verified', 'Product-ready catalog'],
                  ['Procure', 'Contractor specifications'],
                ].map(([title, text]) => (
                  <div key={title} className="glass-soft rounded-2xl p-4">
                    <Sparkles className="mb-5 h-4 w-4 text-cyan-300" />
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[680px] items-center p-7 sm:p-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <p className="eyebrow">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {mode === 'signin' ? 'Sign in to your studio' : 'Create your studio'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'signin'
                ? 'Continue where your projects left off.'
                : 'Start building professional room concepts.'}
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              {mode === 'signup' && <input className="input" placeholder="Full name" required />}
              <input className="input" type="email" placeholder="Email address" required />
              <input className="input" type="password" placeholder="Password" minLength={8} required />

              <button className="button button-primary w-full py-3" type="submit">
                {mode === 'signin' ? 'Enter Studio' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Secure session handling is ready for Supabase integration.</span>
            </div>

            <button
              className="mt-6 w-full text-center text-xs text-slate-500 transition hover:text-cyan-300"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </button>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
