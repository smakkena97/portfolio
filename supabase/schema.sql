-- Run this in your Supabase SQL editor

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  name text default '',
  title text default '',
  bio text default '',
  skills text[] default '{}',
  contact_email text default '',
  contact_linkedin text default '',
  contact_github text default '',
  github_username text default '',
  avatar_url text default '',
  theme text default 'dark',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable row level security
alter table profiles enable row level security;

-- Anyone can view public profiles
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

-- Users can create their own profile
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);
