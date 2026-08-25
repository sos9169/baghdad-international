create table if not exists public.site_metrics (
  id text primary key default 'main',
  visits integer not null default 0,
  interactions integer not null default 0,
  whatsapp_clicks integer not null default 0,
  form_submits integer not null default 0,
  last_visit timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.site_metrics enable row level security;

insert into public.site_metrics (id)
values ('main')
on conflict (id) do nothing;

create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  event_type text not null,
  page text,
  device text,
  created_at timestamptz not null default now()
);

alter table public.site_events
add column if not exists device text;

alter table public.site_events enable row level security;

create index if not exists site_events_created_at_idx
on public.site_events (created_at desc);

create table if not exists public.site_orders (
  id text primary key,
  name text not null,
  phone text not null,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.site_orders enable row level security;

create index if not exists site_orders_created_at_idx
on public.site_orders (created_at desc);

create or replace function public.big_track_event(
  event_type text,
  event_page text default '',
  event_device text default ''
)
returns public.site_metrics
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_metrics public.site_metrics;
begin
  insert into public.site_metrics (id)
  values ('main')
  on conflict (id) do nothing;

  update public.site_metrics
  set
    visits = visits + case when event_type = 'visit' then 1 else 0 end,
    whatsapp_clicks = whatsapp_clicks + case when event_type = 'whatsapp' then 1 else 0 end,
    form_submits = form_submits + case when event_type = 'form_submit' then 1 else 0 end,
    interactions = interactions + case when event_type <> 'visit' then 1 else 0 end,
    last_visit = case when event_type = 'visit' then now() else last_visit end,
    updated_at = now()
  where id = 'main'
  returning * into updated_metrics;

  insert into public.site_events (event_type, page, device)
  values (event_type, event_page, event_device);

  return updated_metrics;
end;
$$;
