-- Newer Supabase projects don't grant table access automatically.
-- The worker writes with the secret key (service_role); the website only reads (anon). RLS still applies to anon.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant select on all tables in schema public to anon, authenticated;
grant execute on function public.review_story(uuid, text, text) to anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select on tables to anon, authenticated;
