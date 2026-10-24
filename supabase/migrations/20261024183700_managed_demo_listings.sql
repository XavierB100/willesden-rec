-- Demo status is independent of availability and survives ordinary owner edits.
alter table public.products
  add column if not exists is_demo boolean not null default false;

comment on column public.products.is_demo is
  'Demonstration stock: editable by the owner, labelled publicly, with enquiries and product offers disabled.';
