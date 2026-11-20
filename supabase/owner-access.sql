-- Replace the placeholder with your Supabase Authentication user UUID, then
-- run this entire script in the project's SQL Editor.
begin;

do $$
declare
  owner_id uuid := '77a2ca49-19a0-4e55-8cd4-647922f5c1fd';
  table_name text;
  relation regclass;
  owner_check text;
begin
  if not exists (select 1 from auth.users where id = owner_id and email_confirmed_at is not null and is_anonymous is false) then
    raise exception 'Use the UUID of a confirmed, non-anonymous Auth user.';
  end if;

  owner_check := format('(select auth.uid()) = %L::uuid', owner_id);

  execute format(
    'create or replace function public.is_roadmap_owner()
     returns boolean language sql stable security invoker set search_path = %L as %L',
    '', 'select coalesce(' || owner_check || ', false)'
  );

  foreach table_name in array array[
    'strategic_goals', 'milestones', 'tasks', 'roadmap_tasks', 'career_achievements'
  ] loop
    relation := to_regclass(format('public.%I', table_name));
    if relation is null then
      if table_name in ('strategic_goals', 'milestones', 'tasks') then
        raise exception 'Required roadmap table public.% is missing.', table_name;
      end if;
      continue;
    end if;

    execute format('alter table %s enable row level security', relation);
    execute format('drop policy if exists roadmap_owner_required on %s', relation);
    execute format('drop policy if exists roadmap_owner_access on %s', relation);

    -- Existing permissive policies cannot override the owner restriction.
    execute format(
      'create policy roadmap_owner_required on %s as restrictive for all to public using (%s) with check (%s)',
      relation, owner_check, owner_check
    );
    execute format(
      'create policy roadmap_owner_access on %s for all to authenticated using (%s) with check (%s)',
      relation, owner_check, owner_check
    );
    execute format('grant select, insert, update, delete on %s to authenticated', relation);
  end loop;
end;
$$;

revoke execute on function public.is_roadmap_owner() from public, anon;
grant execute on function public.is_roadmap_owner() to authenticated;

commit;
