alter table public.products
alter column price type numeric(10, 2)
using price::numeric;
