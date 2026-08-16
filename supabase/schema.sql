-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (Linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  tier text check (tier in ('home', 'pro')) default 'home',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  room_type text not null,
  room_bounds jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Normalized Product Catalog Table (Supplier Agnostic)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  supplier text not null, -- e.g., 'Ferguson', 'Article'
  sku text unique not null,
  name text not null,
  category text not null,
  price numeric(10,2) not null,
  dimensions jsonb not null, -- { w, h, d, unit }
  finish text,
  asset_url text not null, -- transparent cutout or 3D asset link
  vendor_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Scene Assets Placed in Projects
create table public.scene_items (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  position jsonb not null, -- [x, y, z]
  rotation jsonb not null, -- [x, y, z]
  scale jsonb not null, -- [x, y, z]
  custom_material text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);