-- Run only against a dedicated test database. All test data is rolled back.
begin;
insert into auth.users(id) values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select public.set_word_progress('00000000-0000-0000-0000-000000000001', 'head', 'learned', true);
select public.set_word_progress('00000000-0000-0000-0000-000000000001', 'head', 'saved', true);
do $$ begin
  if not (select learned and saved from public.word_progress where word_id='head') then raise exception 'Independent fields were not preserved'; end if;
  begin
    perform public.set_word_progress('00000000-0000-0000-0000-000000000002', 'head', 'learned', true);
    raise exception 'Cross-account write was allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.word_progress set learned=false;
    raise exception 'Direct update was allowed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$ begin
  if exists (select 1 from public.word_progress) then raise exception 'Cross-account read was allowed'; end if;
end $$;
select public.set_word_progress('00000000-0000-0000-0000-000000000002', 'hair', 'saved', true);
select public.delete_my_account();
reset role;
do $$ begin
  if exists (select 1 from auth.users where id='00000000-0000-0000-0000-000000000002') then raise exception 'Account deletion failed'; end if;
  if exists (select 1 from public.word_progress where user_id='00000000-0000-0000-0000-000000000002') then raise exception 'Progress was not deleted'; end if;
  if not exists (select 1 from auth.users where id='00000000-0000-0000-0000-000000000001') then raise exception 'Another account was deleted'; end if;
end $$;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  begin
    perform * from public.word_progress;
    raise exception 'Anonymous read was allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.set_word_progress('00000000-0000-0000-0000-000000000001', 'head', 'learned', true);
    raise exception 'Anonymous write was allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.delete_my_account();
    raise exception 'Anonymous account deletion was allowed';
  exception when insufficient_privilege then null; end;
end $$;
rollback;
