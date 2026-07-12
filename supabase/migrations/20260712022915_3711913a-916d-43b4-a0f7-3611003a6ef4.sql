
-- Roles
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles are public" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Shifts
create type public.shift_status as enum ('open','claimed','in_progress','completed','cancelled');
create type public.shift_urgency as enum ('now','today','this_week');
create type public.shift_pay_type as enum ('fixed','hourly');

create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  location_text text not null default 'Remote',
  pay_cents integer not null check (pay_cents >= 0),
  pay_type public.shift_pay_type not null default 'fixed',
  urgency public.shift_urgency not null default 'today',
  status public.shift_status not null default 'open',
  claimed_by uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index shifts_status_created_idx on public.shifts (status, created_at desc);
create index shifts_poster_idx on public.shifts (poster_id, created_at desc);
create index shifts_claimed_by_idx on public.shifts (claimed_by, created_at desc);

grant select on public.shifts to anon;
grant select, insert, update on public.shifts to authenticated;
grant all on public.shifts to service_role;

alter table public.shifts enable row level security;

-- anyone can view open shifts (public catalog); poster and claimer always see theirs
create policy "public can view open shifts" on public.shifts
  for select using (status = 'open');
create policy "poster views own shifts" on public.shifts
  for select to authenticated using (auth.uid() = poster_id);
create policy "claimer views claimed shifts" on public.shifts
  for select to authenticated using (auth.uid() = claimed_by);

create policy "auth users post shifts" on public.shifts
  for insert to authenticated with check (auth.uid() = poster_id and status = 'open' and claimed_by is null);

-- poster can update/cancel own shift
create policy "poster updates own shift" on public.shifts
  for update to authenticated using (auth.uid() = poster_id) with check (auth.uid() = poster_id);

-- any signed-in user can claim an OPEN shift (atomic: only matches while still open + unclaimed)
create policy "user claims open shift" on public.shifts
  for update to authenticated
  using (status = 'open' and claimed_by is null and poster_id <> auth.uid())
  with check (claimed_by = auth.uid() and status = 'claimed');

create trigger shifts_set_updated_at before update on public.shifts
  for each row execute function public.set_updated_at();

-- Saved shifts
create table public.saved_shifts (
  user_id uuid not null references auth.users(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, shift_id)
);
grant select, insert, delete on public.saved_shifts to authenticated;
grant all on public.saved_shifts to service_role;
alter table public.saved_shifts enable row level security;
create policy "user manages own saved" on public.saved_shifts
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
