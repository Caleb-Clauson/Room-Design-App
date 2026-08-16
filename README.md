# Nest & Frame Studio

Replacement application foundation for the Nest & Frame Studio SaaS.

## Included

- `/auth` — polished sign-in/sign-up shell
- `/dashboard` — project hub
- `/studio/[id]` — professional dark visualizer workspace
- `/checkout` — contractor spec/procurement view
- Interactive scene objects with drag, scale and rotation
- Catalog abstraction
- Supabase browser client scaffold
- Tailwind + Framer Motion + Lucide UI foundation

## Install

```bash
npm install next react react-dom framer-motion lucide-react @supabase/ssr @supabase/supabase-js
npm install -D typescript tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom
```

Add the files to the corresponding locations in your Next.js App Router project.

## Supabase environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The current UI deliberately falls back to a local/demo experience when Supabase variables are absent.

## Important production note

The catalog records in the demo Studio are intentionally sample records. Do not represent them as live Ferguson, Article, or HomeGoods inventory/pricing until they are populated from verified current vendor/manufacturer data and their permitted product imagery/links.
