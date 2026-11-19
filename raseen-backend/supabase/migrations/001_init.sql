-- رسين · Raseen v1 schema
-- Run once in Supabase: SQL Editor → paste → Run.
-- Reads are public (anon key, used by the website). Writes need the service key (used by the worker).

create extension if not exists pgcrypto;

-- What the user monitors: an issue, an entity or a campaign.
create table if not exists topics (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kind        text not null default 'entity' check (kind in ('entity','issue','campaign')),
  keywords    text[] not null default '{}',   -- any of these must appear in the title or summary
  exclude     text[] not null default '{}',   -- drop the article if any of these appear
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Where news comes from. v1 = text sources with RSS feeds.
create table if not exists sources (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kind        text not null default 'news' check (kind in ('news','official','blog','social','aggregator')),
  site_url    text,
  feed_url    text unique,
  is_official boolean not null default false,
  active      boolean not null default true,
  last_fetch  timestamptz,
  last_status text
);

create table if not exists articles (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid not null references topics(id) on delete cascade,
  source_id     uuid references sources(id) on delete set null,
  url           text not null,
  title         text not null,
  summary       text,
  published_at  timestamptz,           -- as given by the source
  fetched_at    timestamptz not null default now(),
  content_hash  text not null,         -- normalized title+summary, to spot exact copies
  unique (topic_id, url)
);
create index if not exists articles_topic_time on articles (topic_id, published_at desc);

-- A story = a group of articles about the same event (duplicates clustered together).
create table if not exists stories (
  id                uuid primary key default gen_random_uuid(),
  topic_id          uuid not null references topics(id) on delete cascade,
  title             text not null,
  status            text not null default 'review' check (status in ('verified','review','unsupported')),
  first_article_id  uuid references articles(id) on delete set null,
  first_confidence  real,              -- 0..1, how sure Raseen is about the first source
  first_reasons     jsonb not null default '[]',  -- the evidence: [{key,label,value}]
  article_count     int not null default 0,
  source_count      int not null default 0,
  update_count      int not null default 0,  -- articles that add something new
  republish_count   int not null default 0,  -- articles that only repeat
  first_seen        timestamptz,
  last_seen         timestamptz,
  reviewed_by       text,               -- the specialist approves; Raseen only suggests
  reviewed_at       timestamptz,
  updated_at        timestamptz not null default now()
);
create index if not exists stories_topic on stories (topic_id, last_seen desc);

create table if not exists story_articles (
  story_id    uuid not null references stories(id) on delete cascade,
  article_id  uuid not null references articles(id) on delete cascade,
  role        text not null check (role in ('first','republish','update')),
  similarity  real,                    -- to the first article, 0..1
  primary key (story_id, article_id)
);

-- A documented brief: every claim links back to its evidence (article ids).
create table if not exists briefs (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references topics(id) on delete cascade,
  period_from timestamptz not null,
  period_to   timestamptz not null,
  title       text not null,
  claims      jsonb not null default '[]',  -- [{text, evidence:[article_id], story_id}]
  evidence    jsonb not null default '[]',  -- [{n, article_id, source, title, url, published_at}]
  model       text,                         -- which AI wrote it, or 'extractive' when no AI key
  status      text not null default 'draft' check (status in ('draft','approved')),
  created_at  timestamptz not null default now()
);

create table if not exists runs (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  stats       jsonb not null default '{}'
);

-- Coverage volume per topic per hour (the simple coverage indicator).
create or replace view coverage_hourly as
  select topic_id,
         date_trunc('hour', coalesce(published_at, fetched_at)) as hour,
         count(*)::int as articles,
         count(distinct source_id)::int as sources
  from articles
  group by 1, 2;

-- Public read, worker-only write.
alter table topics          enable row level security;
alter table sources         enable row level security;
alter table articles        enable row level security;
alter table stories         enable row level security;
alter table story_articles  enable row level security;
alter table briefs          enable row level security;
alter table runs            enable row level security;

do $$
declare t text;
begin
  foreach t in array array['topics','sources','articles','stories','story_articles','briefs','runs'] loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
  end loop;
end $$;

-- The specialist approves or keeps a story under review from the website.
-- v1 has no logins yet, so this is open; tighten it when accounts are added.
create or replace function review_story(p_story uuid, p_status text, p_by text)
returns void language sql security definer as $$
  update stories set status = p_status, reviewed_by = p_by, reviewed_at = now(), updated_at = now()
  where id = p_story and p_status in ('verified','review','unsupported');
$$;
grant execute on function review_story(uuid, text, text) to anon;
