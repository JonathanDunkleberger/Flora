-- ============================================================
-- Bloom – Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up all tables,
-- indexes, RLS policies, and helper functions.
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  clerk_id     text unique not null,
  email        text not null,
  display_name text,
  avatar_url   text,
  tier         text not null default 'free' check (tier in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_profiles_clerk_id on public.profiles (clerk_id);

-- ============================================================
-- 2. HABITS
-- ============================================================
create table if not exists public.habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,              -- clerk_id from auth
  habit_type   text not null default 'build' check (habit_type in ('build', 'quit')),
  name         text not null,
  description  text,
  category     text not null default 'health',
  icon         text not null default '🌱',
  plant_type   text not null default 'succulent',
  habit_group  text not null default 'morning',
  frequency    text not null default 'daily' check (frequency in ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days  int[],                      -- 0=Sun … 6=Sat
  is_archived  boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_habits_user_id on public.habits (user_id);

-- ============================================================
-- 3. HABIT_LOGS  (one row = one check-in per day)
-- ============================================================
create table if not exists public.habit_logs (
  id        uuid primary key default gen_random_uuid(),
  habit_id  uuid not null references public.habits(id) on delete cascade,
  log_date  date not null default current_date,
  value     real default 1,               -- future: intensity / amount
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create index if not exists idx_habit_logs_habit_id on public.habit_logs (habit_id);
create index if not exists idx_habit_logs_date on public.habit_logs (log_date);

-- ============================================================
-- 4. RELAPSE_EVENTS  (quit-type habits only)
-- ============================================================
create table if not exists public.relapse_events (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  intensity  int not null default 5 check (intensity between 1 and 10),
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_relapse_events_habit_id on public.relapse_events (habit_id);

-- ============================================================
-- 5. MILESTONES
-- ============================================================
create table if not exists public.milestones (
  id              uuid primary key default gen_random_uuid(),
  habit_id        uuid not null references public.habits(id) on delete cascade,
  milestone_type  text not null default 'streak',
  value           int not null,
  seen            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_milestones_habit_id on public.milestones (habit_id);

-- ============================================================
-- 6. UPDATED_AT TRIGGER (auto-bump updated_at)
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_habits_updated_at
  before update on public.habits
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================

-- Helper: extract clerk_id from the JWT claims
-- Supabase + Clerk native integration puts the user's Clerk ID
-- into auth.uid() when using Clerk's Supabase integration token.
-- We use requesting_user_id() which reads from the JWT claim.
create or replace function public.requesting_user_id()
returns text as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  );
$$ language sql stable;

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (clerk_id = requesting_user_id());

create policy "Users can update own profile"
  on public.profiles for update
  using (clerk_id = requesting_user_id());

-- HABITS
alter table public.habits enable row level security;

create policy "Users can view own habits"
  on public.habits for select
  using (user_id = requesting_user_id());

create policy "Users can insert own habits"
  on public.habits for insert
  with check (user_id = requesting_user_id());

create policy "Users can update own habits"
  on public.habits for update
  using (user_id = requesting_user_id());

create policy "Users can delete own habits"
  on public.habits for delete
  using (user_id = requesting_user_id());

-- HABIT_LOGS
alter table public.habit_logs enable row level security;

create policy "Users can view own logs"
  on public.habit_logs for select
  using (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

create policy "Users can insert own logs"
  on public.habit_logs for insert
  with check (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

create policy "Users can delete own logs"
  on public.habit_logs for delete
  using (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

-- RELAPSE_EVENTS
alter table public.relapse_events enable row level security;

create policy "Users can view own relapses"
  on public.relapse_events for select
  using (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

create policy "Users can insert own relapses"
  on public.relapse_events for insert
  with check (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

-- MILESTONES
alter table public.milestones enable row level security;

create policy "Users can view own milestones"
  on public.milestones for select
  using (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

create policy "Users can insert own milestones"
  on public.milestones for insert
  with check (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );

create policy "Users can update own milestones"
  on public.milestones for update
  using (
    habit_id in (
      select id from public.habits where user_id = requesting_user_id()
    )
  );
