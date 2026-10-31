begin;
create table if not exists public.word_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null check (char_length(word_id) between 1 and 120),
  learned boolean not null default false,
  saved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);
alter table public.word_progress enable row level security;
revoke all on public.word_progress from anon, authenticated;
grant select on public.word_progress to authenticated;
drop policy if exists "Read own progress" on public.word_progress;
create policy "Read own progress" on public.word_progress for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.set_word_progress(p_user_id uuid, p_word_id text, p_field text, p_value boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then raise exception 'Not authorized' using errcode = '42501'; end if;
  if p_field not in ('learned', 'saved') or p_field is null or p_value is null then raise exception 'Invalid progress field'; end if;
  insert into public.word_progress (user_id, word_id, learned, saved)
  values (p_user_id, p_word_id, case when p_field = 'learned' then p_value else false end, case when p_field = 'saved' then p_value else false end)
  on conflict (user_id, word_id) do update set
    learned = case when p_field = 'learned' then p_value else word_progress.learned end,
    saved = case when p_field = 'saved' then p_value else word_progress.saved end,
    updated_at = now();
end;
$$;
revoke all on function public.set_word_progress(uuid, text, text, boolean) from public, anon;
grant execute on function public.set_word_progress(uuid, text, text, boolean) to authenticated;

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Not authorized' using errcode = '42501'; end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
commit;
