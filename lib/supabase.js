import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const STATE_ID = "empreza2026";

export async function readSiteState() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_state")
    .select("state, updated_at")
    .eq("id", STATE_ID)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function writeSiteState(state) {
  if (!supabase) return;
  const { error } = await supabase.from("site_state").upsert({
    id: STATE_ID,
    state,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export const SUPABASE_SETUP_SQL = `create table if not exists public.site_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_state enable row level security;
drop policy if exists "Public can read site state" on public.site_state;
create policy "Public can read site state" on public.site_state for select using (true);
drop policy if exists "Authenticated admins can write site state" on public.site_state;
drop policy if exists "Demo admin can write site state" on public.site_state;
create policy "Demo admin can write site state" on public.site_state
  for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('empreza-media', 'empreza-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view Empreza media" on storage.objects;
create policy "Public can view Empreza media" on storage.objects
  for select using (bucket_id = 'empreza-media');
drop policy if exists "Demo admin can upload Empreza media" on storage.objects;
create policy "Demo admin can upload Empreza media" on storage.objects
  for insert with check (bucket_id = 'empreza-media');`;
