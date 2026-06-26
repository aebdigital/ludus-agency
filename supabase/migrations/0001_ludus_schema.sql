-- ============================================================================
-- Ludus CRM — schema for the SHARED Supabase project (ref: ngifengeshwvyzhqvprn,
-- the same project that backs aeb_cms). Ludus is added as another tenant/site.
--
-- HOW TO APPLY: open the Supabase dashboard for project ngifengeshwvyzhqvprn →
-- SQL Editor → paste this whole file → Run. It is idempotent (safe to re-run).
--
-- Security model mirrors the existing per-site tables (e.g. raving_projects):
-- access to internal tables requires membership in the 'ludus' site OR being on
-- the email allowlist. The public application form inserts into
-- ludus_applications (anon INSERT allowed; only members can read/manage).
-- ============================================================================

create extension if not exists pgcrypto;

-- These two tables already exist in the project (created by the raving migration);
-- guarded with "if not exists" so this script is standalone & safe.
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  domain text,
  owner_id uuid references auth.users(id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  lang text not null default 'sk',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_memberships (
  site_id uuid not null references public.sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (site_id, user_id)
);

-- ── Register Ludus as a site ────────────────────────────────────────────────
insert into public.sites (name, slug, lang)
values ('Ludus Agency', 'ludus', 'sk')
on conflict (slug) do nothing;

-- ── Helper functions ────────────────────────────────────────────────────────
-- security definer so they can read sites/site_memberships regardless of the
-- caller's RLS, and used both as RLS predicates and column defaults.

create or replace function public.ludus_site_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.sites where slug = 'ludus' limit 1;
$$;

create or replace function public.ludus_is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) in (
      'info@skolaludus.sk',
      'alexander.hidveghy@gmail.com',
      'alexander.hidv@gmail.com'
    )
    or exists (
      select 1
      from public.site_memberships m
      join public.sites s on s.id = m.site_id
      where s.slug = 'ludus'
        and m.user_id = auth.uid()
    );
$$;

create or replace function public.ludus_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Students ────────────────────────────────────────────────────────────────
create table if not exists public.ludus_students (
  id text primary key,
  site_id uuid not null default public.ludus_site_id()
    references public.sites(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  preferred_name text,
  pronouns text,
  gender text,
  date_of_birth date,
  city text,
  status text not null default 'Konkurz',
  program text not null default 'Iné',
  cohort text,
  teacher text,
  enrolled_on date,
  height_cm integer,
  weight_kg integer,
  eye_color text,
  hair_color text,
  shoe_eu integer,
  clothing_size text,
  voice_type text,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  casting_readiness integer not null default 0,
  phone text,
  email text,
  guardian_name text,
  guardian_relation text,
  guardian_phone text,
  guardian_email text,
  emergency_contact text,
  bio text,
  tutor_note text,
  -- extended (registration form) fields
  school text,
  guardian_email2 text,
  apparent_age text,
  ethnicity text,
  body_type text,
  hair_length text,
  hair_type text,
  beard text,
  suit_size text,
  chest_circumference integer,
  waist_circumference integer,
  hips_circumference integer,
  head_circumference integer,
  neck_circumference integer,
  voice_speak text,
  distinctive_features text[] not null default '{}',
  handicaps text,
  instruments text[] not null default '{}',
  dance_styles text[] not null default '{}',
  sports text[] not null default '{}',
  driving_licences text[] not null default '{}',
  other_skills text,
  other_talents text,
  accent text,
  ig_followers integer,
  tt_followers integer,
  yt_followers integer,
  fb_followers integer,
  url_web text,
  url_ig text,
  url_tt text,
  url_yt text,
  url_fb text,
  url_li text,
  url_imdb text,
  url_csfd text,
  url_idiv text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ludus_students_site_status_idx
  on public.ludus_students (site_id, status);

drop trigger if exists ludus_students_updated_at on public.ludus_students;
create trigger ludus_students_updated_at
  before update on public.ludus_students
  for each row execute function public.ludus_set_updated_at();

-- ── Documents & Media (per student) ─────────────────────────────────────────
create table if not exists public.ludus_documents (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references public.ludus_students(id) on delete cascade,
  name text not null,
  kind text,
  status text,
  uploaded_at date,
  size_kb integer,
  added_by text,
  storage_path text,
  created_at timestamptz not null default now()
);
create index if not exists ludus_documents_student_idx
  on public.ludus_documents (student_id);

create table if not exists public.ludus_media (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references public.ludus_students(id) on delete cascade,
  title text not null,
  kind text,
  captured_at date,
  duration_sec integer,
  tag text,
  storage_path text,
  created_at timestamptz not null default now()
);
create index if not exists ludus_media_student_idx
  on public.ludus_media (student_id);

-- ── Projects & cast ─────────────────────────────────────────────────────────
create table if not exists public.ludus_projects (
  id text primary key,
  site_id uuid not null default public.ludus_site_id()
    references public.sites(id) on delete cascade,
  title text not null,
  phase text not null default 'Konkurz',
  program text,
  venue text,
  dates text,
  director text,
  main_student_id text references public.ludus_students(id) on delete set null,
  cast_filled integer,
  cast_total integer,
  custom boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists ludus_projects_updated_at on public.ludus_projects;
create trigger ludus_projects_updated_at
  before update on public.ludus_projects
  for each row execute function public.ludus_set_updated_at();

create table if not exists public.ludus_project_cast (
  project_id text not null references public.ludus_projects(id) on delete cascade,
  student_id text not null references public.ludus_students(id) on delete cascade,
  primary key (project_id, student_id)
);
create index if not exists ludus_project_cast_student_idx
  on public.ludus_project_cast (student_id);

-- ── Public application intake (from /prihlaska) ─────────────────────────────
create table if not exists public.ludus_applications (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null default public.ludus_site_id()
    references public.sites(id) on delete cascade,
  first_name text,
  last_name text,
  date_of_birth date,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create index if not exists ludus_applications_status_idx
  on public.ludus_applications (status, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.ludus_students       enable row level security;
alter table public.ludus_documents      enable row level security;
alter table public.ludus_media          enable row level security;
alter table public.ludus_projects       enable row level security;
alter table public.ludus_project_cast   enable row level security;
alter table public.ludus_applications   enable row level security;

-- Internal tables: only Ludus members (or allowlisted email) may do anything.
drop policy if exists "ludus_students members" on public.ludus_students;
create policy "ludus_students members" on public.ludus_students
  for all to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

drop policy if exists "ludus_documents members" on public.ludus_documents;
create policy "ludus_documents members" on public.ludus_documents
  for all to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

drop policy if exists "ludus_media members" on public.ludus_media;
create policy "ludus_media members" on public.ludus_media
  for all to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

drop policy if exists "ludus_projects members" on public.ludus_projects;
create policy "ludus_projects members" on public.ludus_projects
  for all to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

drop policy if exists "ludus_project_cast members" on public.ludus_project_cast;
create policy "ludus_project_cast members" on public.ludus_project_cast
  for all to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

-- Applications: anyone may submit (anon INSERT); only members may read/manage.
drop policy if exists "ludus_applications public insert" on public.ludus_applications;
create policy "ludus_applications public insert" on public.ludus_applications
  for insert to anon, authenticated
  with check (true);

drop policy if exists "ludus_applications members read" on public.ludus_applications;
create policy "ludus_applications members read" on public.ludus_applications
  for select to authenticated
  using (public.ludus_is_member());

drop policy if exists "ludus_applications members update" on public.ludus_applications;
create policy "ludus_applications members update" on public.ludus_applications
  for update to authenticated
  using (public.ludus_is_member()) with check (public.ludus_is_member());

drop policy if exists "ludus_applications members delete" on public.ludus_applications;
create policy "ludus_applications members delete" on public.ludus_applications
  for delete to authenticated
  using (public.ludus_is_member());

-- ============================================================================
-- Grant access — owner membership of the Ludus site for the school account
-- info@skolaludus.sk (and admin). Those accounts must already exist in Auth
-- (dashboard → Authentication → Users → Add user). This block is idempotent
-- and safe: if an account doesn't exist yet it grants nothing — just re-run
-- this file after creating it.
-- ============================================================================
insert into public.site_memberships (site_id, user_id, role)
select s.id, u.id, 'owner'
from public.sites s
join auth.users u
  on lower(u.email) in ('info@skolaludus.sk', 'alexander.hidveghy@gmail.com')
where s.slug = 'ludus'
on conflict (site_id, user_id) do nothing;

-- Make the school the owner of the Ludus site.
update public.sites s
set owner_id = u.id
from auth.users u
where s.slug = 'ludus'
  and lower(u.email) = 'info@skolaludus.sk'
  and s.owner_id is distinct from u.id;

