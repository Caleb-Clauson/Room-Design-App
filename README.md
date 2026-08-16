# Nest & Frame Studio — Visualizer V2

This replaces the geometric placeholder visualizer with an image-first room-design experience.

## Core routes

- `/auth`
- `/dashboard`
- `/studio/[id]`
- `/checkout`

## New architecture

The Studio is divided into:

- `RoomCanvas` — room photography + draggable product imagery
- `ProductCatalog` — real image-based product cards and physical dimensions
- `Inspector` — product dimensions, scene scale, rotation and procurement actions
- `Assistant` — natural-language room assistant surface
- project/scene state in the Studio route

## Install

```bash
npm install next react react-dom framer-motion lucide-react @supabase/ssr @supabase/supabase-js
npm install -D typescript tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom
```

## Production catalog

The included catalog is deliberately a development dataset. Product imagery and prices must be verified before production use. Replace `PRODUCTS` in `components/studio/ProductCatalog.tsx` with records from your approved catalog ingestion layer.

A production product record should contain:

- vendor
- manufacturer/brand
- SKU
- current price
- currency
- dimensions
- product URL
- image URLs
- image license/source
- verification timestamp
- availability status

## Production next steps

1. Supabase Auth + RLS
2. Supabase project/scene persistence
3. Supabase Storage for room photos
4. Room measurement / perspective calibration
5. Transparent product cutouts or 3D assets
6. Product ingestion and verification
7. Real spatial collision/clearance calculations
8. AI tool-calling layer
9. PDF contractor spec generation
10. Vendor-specific purchasing links

The demo deliberately avoids claiming the sample catalog is live inventory.
