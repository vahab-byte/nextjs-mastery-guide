-- Create notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_id bigint references public.modules(id) on delete set null,
  lesson_id text,
  title text not null,
  content text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notes enable row level security;

-- Policies
create policy "Users can view own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "Users can insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);

create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);
