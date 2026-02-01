-- Workspace Database Schema
-- Tables for the AI Engineering Platform

-- Profiles table (auto-created on user signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  framework text not null default 'nextjs' check (framework in ('nextjs', 'react', 'vue', 'svelte')),
  status text not null default 'active' check (status in ('active', 'archived', 'draft')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "projects_select_own" on public.projects for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects for insert with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects for update using (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects for delete using (auth.uid() = user_id);

-- Messages table (chat history per project)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  component_name text,
  error text,
  is_retryable boolean default true,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_select_own" on public.messages for select using (auth.uid() = user_id);
create policy "messages_insert_own" on public.messages for insert with check (auth.uid() = user_id);
create policy "messages_delete_own" on public.messages for delete using (auth.uid() = user_id);

-- Generated components table
create table if not exists public.generated_components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prompt text not null,
  code jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.generated_components enable row level security;

create policy "components_select_own" on public.generated_components for select using (auth.uid() = user_id);
create policy "components_insert_own" on public.generated_components for insert with check (auth.uid() = user_id);
create policy "components_update_own" on public.generated_components for update using (auth.uid() = user_id);
create policy "components_delete_own" on public.generated_components for delete using (auth.uid() = user_id);

-- Component versions table
create table if not exists public.component_versions (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.generated_components(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version_number integer not null,
  code jsonb not null default '[]'::jsonb,
  label text,
  created_at timestamptz default now()
);

alter table public.component_versions enable row level security;

create policy "versions_select_own" on public.component_versions for select using (auth.uid() = user_id);
create policy "versions_insert_own" on public.component_versions for insert with check (auth.uid() = user_id);
create policy "versions_delete_own" on public.component_versions for delete using (auth.uid() = user_id);

-- Deployments table
create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'building' check (status in ('idle', 'building', 'deploying', 'success', 'failed')),
  url text,
  error text,
  started_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.deployments enable row level security;

create policy "deployments_select_own" on public.deployments for select using (auth.uid() = user_id);
create policy "deployments_insert_own" on public.deployments for insert with check (auth.uid() = user_id);
create policy "deployments_update_own" on public.deployments for update using (auth.uid() = user_id);

-- Deployment logs table
create table if not exists public.deployment_logs (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid not null references public.deployments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  log_type text not null check (log_type in ('info', 'success', 'warning', 'error')),
  created_at timestamptz default now()
);

alter table public.deployment_logs enable row level security;

create policy "logs_select_own" on public.deployment_logs for select using (auth.uid() = user_id);
create policy "logs_insert_own" on public.deployment_logs for insert with check (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add update triggers
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at();

drop trigger if exists components_updated_at on public.generated_components;
create trigger components_updated_at
  before update on public.generated_components
  for each row
  execute function public.update_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- Indexes for performance
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_messages_project_id on public.messages(project_id);
create index if not exists idx_components_project_id on public.generated_components(project_id);
create index if not exists idx_versions_component_id on public.component_versions(component_id);
create index if not exists idx_deployments_project_id on public.deployments(project_id);
create index if not exists idx_logs_deployment_id on public.deployment_logs(deployment_id);
