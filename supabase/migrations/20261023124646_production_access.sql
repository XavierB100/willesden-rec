-- Catalogue data is public; all changes pass through the server's owner check.
revoke all on table public.products, public.site_settings from anon, authenticated;
grant select on table public.products, public.site_settings to anon, authenticated;
grant all on table public.products, public.site_settings to service_role;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

-- This trigger only assigns NEW.updated_at and needs no schema search path.
alter function public.touch_updated_at() set search_path = '';
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
grant execute on function public.touch_updated_at() to service_role;

-- Supabase's optional automatic-RLS event trigger is internal administration.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

-- Keep uploads within the hosted function's request-size allowance.
update storage.buckets
set public = true,
    file_size_limit = 4194304,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'
    ]
where id = 'product-images';
