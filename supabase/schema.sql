-- ============================================================
-- Plan de Estudios UTDT — Esquema Etapa 1 (usuarios + planes)
-- Ejecutar una vez en Supabase → SQL Editor.
-- ============================================================

-- 1. Estado de acceso (gate de pago)
create type public.access_status as enum ('pending', 'active', 'expired');

-- 2. Perfiles (1 por usuario de auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  email text, -- denormalizado, para identificar al usuario en el Table Editor
  carrera text not null,
  orientacion text, -- orientación elegida (sólo carreras con orientaciones)
  access_status public.access_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Planes (estado-por-id en JSONB, uno por usuario+carrera)
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  carrera text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, carrera)
);

-- 4. Row Level Security
alter table public.profiles enable row level security;
alter table public.plans enable row level security;

-- Perfil: cada uno ve y edita sólo el suyo
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Helper: ¿el usuario tiene acceso activo (pagó)?
create or replace function public.has_active_access()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and access_status = 'active'
  );
$$;

-- Planes: sólo el dueño Y con acceso activo
create policy "plans_select_own_active" on public.plans
  for select using (auth.uid() = user_id and public.has_active_access());
create policy "plans_insert_own_active" on public.plans
  for insert with check (auth.uid() = user_id and public.has_active_access());
create policy "plans_update_own_active" on public.plans
  for update using (auth.uid() = user_id and public.has_active_access());

-- 5. Crear el perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, carrera)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'carrera', 'economia-empresarial')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger plans_touch_updated before update on public.plans
  for each row execute function public.touch_updated_at();
create trigger profiles_touch_updated before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Para activar el acceso de un usuario MIENTRAS no haya pago (Etapa 1):
--   update public.profiles set access_status = 'active' where id = '<uuid>';
-- El uuid se ve en Authentication → Users.
-- ============================================================
