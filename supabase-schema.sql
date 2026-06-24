-- TravelMind AI - Supabase Schema
-- Run this in Supabase SQL Editor

create table if not exists public.travel_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  destination text not null,
  start_date date not null,
  end_date date not null,
  duration_days integer not null,
  budget numeric not null,
  currency text not null default 'TRY',
  travelers integer not null default 1,
  interests text[] default '{}',
  transport_preferences text[] default '{}',
  flight_info text,
  hotel_info text,
  notes text,
  plan_data jsonb,
  weather_data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.travel_plans enable row level security;

create policy "Users can view own plans"
  on public.travel_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.travel_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.travel_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.travel_plans for delete
  using (auth.uid() = user_id);

-- Index
create index if not exists travel_plans_user_id_idx on public.travel_plans(user_id);
create index if not exists travel_plans_created_at_idx on public.travel_plans(created_at desc);
