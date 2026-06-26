-- ============================================================================
-- Ludus storage — private bucket for student photos, documents and media.
-- Run AFTER 0001_ludus_schema.sql (uses public.ludus_is_member()).
-- Apply in the Supabase SQL editor for project ngifengeshwvyzhqvprn. Idempotent.
--
-- Bucket is PRIVATE (these are minors' photos + consent/medical documents).
-- The app reads via short-lived signed URLs; only Ludus members can read/write.
-- ============================================================================

-- Main photo reference on the student.
alter table public.ludus_students
  add column if not exists photo_path text;

-- Private bucket.
insert into storage.buckets (id, name, public)
values ('ludus', 'ludus', false)
on conflict (id) do nothing;

-- RLS on storage.objects, scoped to the 'ludus' bucket + Ludus membership.
drop policy if exists "ludus storage read" on storage.objects;
create policy "ludus storage read" on storage.objects
  for select to authenticated
  using (bucket_id = 'ludus' and public.ludus_is_member());

drop policy if exists "ludus storage insert" on storage.objects;
create policy "ludus storage insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ludus' and public.ludus_is_member());

drop policy if exists "ludus storage update" on storage.objects;
create policy "ludus storage update" on storage.objects
  for update to authenticated
  using (bucket_id = 'ludus' and public.ludus_is_member())
  with check (bucket_id = 'ludus' and public.ludus_is_member());

drop policy if exists "ludus storage delete" on storage.objects;
create policy "ludus storage delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'ludus' and public.ludus_is_member());
