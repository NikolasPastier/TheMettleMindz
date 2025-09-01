-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price decimal(10,2) not null,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Create RLS policies
create policy "Users can view own products" on public.products
  for select using (auth.uid() = user_id);

create policy "Users can insert own products" on public.products
  for insert with check (auth.uid() = user_id);

create policy "Users can update own products" on public.products
  for update using (auth.uid() = user_id);

create policy "Users can delete own products" on public.products
  for delete using (auth.uid() = user_id);
