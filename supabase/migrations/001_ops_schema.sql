-- DYEGU Operations Schema Upgrade (Migration 001)
-- Safe, non-destructive additions for triage, volunteer vetting, circle cohort matching, and analytics views.
-- Anonymous browser/API INSERT permissions remain strictly scoped; operational columns are read/updated by service role only.

-- 1. Operational triage columns
alter table if exists public.subscribers
  add column if not exists exported_batch_id text,
  add column if not exists welcome_sent_at timestamptz;

alter table if exists public.enquiries
  add column if not exists status text not null default 'new',
  add column if not exists priority_flag text,
  add column if not exists internal_notes text,
  add column if not exists reviewed_at timestamptz;

alter table if exists public.volunteers
  add column if not exists status text not null default 'applied',
  add column if not exists licence_verified boolean not null default false,
  add column if not exists internal_notes text,
  add column if not exists reviewed_at timestamptz;

alter table if exists public.community_requests
  add column if not exists status text not null default 'waitlist',
  add column if not exists cohort_id text,
  add column if not exists priority_flag text,
  add column if not exists internal_notes text,
  add column if not exists reviewed_at timestamptz;

alter table if exists public.rebuilds
  add column if not exists status text not null default 'unread',
  add column if not exists priority_flag text,
  add column if not exists reconfirmed_publish boolean not null default false,
  add column if not exists internal_notes text,
  add column if not exists reviewed_at timestamptz;

-- 2. Helpful indexes for weekly ops
create index if not exists idx_subscribers_export on public.subscribers (list, exported_at) where exported_at is null;
create index if not exists idx_community_circle_stage on public.community_requests (kind, stage, status);
create index if not exists idx_enquiries_status on public.enquiries (status, created_at desc);
create index if not exists idx_rebuilds_priority on public.rebuilds (priority_flag, created_at desc);

-- 3. Operational Views

-- Circle cohorts grouped by stage + rough regional timezone band; flags cohorts ready to launch (>= 6 members)
create or replace view public.v_circle_cohorts_ready as
select
  stage,
  case
    when timezone ilike 'America/%' then 'Americas'
    when timezone ilike 'Europe/%' or timezone ilike 'Africa/Lagos%' or timezone ilike 'Africa/Accra%' or timezone ilike 'Africa/London%' or timezone = 'UTC' then 'UK_EU_WestAfrica'
    when timezone ilike 'Africa/%' then 'Africa_Other'
    when timezone ilike 'Asia/%' or timezone ilike 'Australia/%' or timezone ilike 'Pacific/%' then 'Asia_Pacific'
    else 'Unclassified'
  end as tz_band,
  count(*) as waiting_members,
  (count(*) >= 6) as ready_to_launch,
  min(created_at) as oldest_request_at
from public.community_requests
where kind = 'circle'
  and status = 'waitlist'
group by 1, 2
order by waiting_members desc, oldest_request_at asc;

-- Expert session topic demand ranking
create or replace view public.v_session_topic_demand as
select
  unnest(topics) as topic,
  count(*) as requests
from public.community_requests
where kind = 'session'
  and topics is not null
group by 1
order by requests desc;

-- Drop 01 merch waitlist demand ranking
create or replace view public.v_merch_drop_demand as
select
  unnest(interest) as product_key,
  count(*) as interested_count
from public.subscribers
where list = 'merch_waitlist'
  and interest is not null
group by 1
order by interested_count desc;

-- Acquisition funnel by UTM + stage
create or replace view public.v_funnel_by_utm as
select
  coalesce(utm, 'direct') as campaign,
  list,
  coalesce(stage, 'unspecified') as stage,
  count(*) as signups,
  max(created_at) as latest_signup
from public.subscribers
group by 1, 2, 3
order by signups desc;
