create table if not exists public.owner_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

grant select on public.owner_emails to authenticated;
grant all on public.owner_emails to service_role;

alter table public.owner_emails enable row level security;

create policy "owner reads owner emails" on public.owner_emails
  for select to authenticated
  using (public.has_role(auth.uid(), 'owner'));

insert into public.owner_emails (email) values ('z3trino00@gmail.com')
  on conflict (email) do nothing;