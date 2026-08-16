create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  room_type text not null check (room_type in ('kitchen', 'laundry', 'home-office', 'floral')),
  room_bounds jsonb not null,
  nodes jsonb not null,
  structures jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_user_updated on public.projects(user_id, updated_at desc);

alter table public.projects enable row level security;
alter table public.profiles enable row level security;

create policy if not exists "projects_select_own" on public.projects
  for select to authenticated using (auth.uid() = user_id);

create policy if not exists "projects_insert_own" on public.projects
  for insert to authenticated with check (auth.uid() = user_id);

create policy if not exists "projects_update_own" on public.projects
  for update to authenticated using (auth.uid() = user_id);

create policy if not exists "projects_delete_own" on public.projects
  for delete to authenticated using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();
