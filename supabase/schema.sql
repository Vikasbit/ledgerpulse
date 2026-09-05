-- supabase/schema.sql
-- Complete Supabase Schema for LedgerPulse SaaS
-- Enables Row Level Security (RLS) for complete multi-tenant isolation.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Stores user profile metadata)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- Trigger to auto-create profile on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. BUSINESSES TABLE (Each tenant owns businesses)
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  industry text default 'Technology',
  currency text default 'INR',
  created_at timestamp with time zone default now()
);

alter table public.businesses enable row level security;

drop policy if exists "business_owner_select" on public.businesses;
create policy "business_owner_select" on public.businesses 
  for select using (owner_id = auth.uid());

drop policy if exists "business_owner_insert" on public.businesses;
create policy "business_owner_insert" on public.businesses 
  for insert with check (owner_id = auth.uid());

drop policy if exists "business_owner_update" on public.businesses;
create policy "business_owner_update" on public.businesses 
  for update using (owner_id = auth.uid());

drop policy if exists "business_owner_delete" on public.businesses;
create policy "business_owner_delete" on public.businesses 
  for delete using (owner_id = auth.uid());


-- 3. IMPORTS TABLE (Tracks CSV Ingestion batches)
create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  filename text not null,
  total_rows int default 0,
  valid_rows int default 0,
  error_rows int default 0,
  duplicate_rows int default 0,
  status text check (status in ('pending','processing','completed','failed')) default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.imports enable row level security;

drop policy if exists "imports_tenant_all" on public.imports;
create policy "imports_tenant_all" on public.imports 
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );


-- 4. IMPORT ERRORS TABLE (Tracks row-level CSV validation failures)
create table if not exists public.import_errors (
  id uuid primary key default gen_random_uuid(),
  import_id uuid references public.imports(id) on delete cascade not null,
  row_number int not null,
  column_name text not null,
  raw_value text,
  error_reason text not null,
  created_at timestamp with time zone default now()
);

alter table public.import_errors enable row level security;

drop policy if exists "import_errors_tenant_all" on public.import_errors;
create policy "import_errors_tenant_all" on public.import_errors 
  for all using (
    import_id in (
      select i.id from public.imports i 
      join public.businesses b on i.business_id = b.id 
      where b.owner_id = auth.uid()
    )
  );


-- 5. TRANSACTIONS TABLE (Core financial transaction records)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade not null,
  import_id uuid references public.imports(id) on delete set null,
  transaction_id text not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  amount numeric not null,
  currency text not null default 'INR',
  status text check (status in ('success','pending','failed','refunded')),
  payment_method text default 'UPI',
  transaction_date timestamp with time zone default now(),
  notes text,
  metadata jsonb default '{}'::jsonb,
  razorpay_payment_id text,
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

drop policy if exists "transactions_tenant_all" on public.transactions;
create policy "transactions_tenant_all" on public.transactions 
  for all using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );


-- 6. PAYMENT RECORDS TABLE (Optional payment gateway link)
create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric,
  status text,
  signature text,
  created_at timestamp with time zone default now()
);

alter table public.payment_records enable row level security;

drop policy if exists "payment_records_tenant_all" on public.payment_records;
create policy "payment_records_tenant_all" on public.payment_records 
  for all using (
    transaction_id in (
      select t.id from public.transactions t 
      join public.businesses b on t.business_id = b.id 
      where b.owner_id = auth.uid()
    )
  );
