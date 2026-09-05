// supabase/schema.sql
-- Supabase schema for LedgerPulse SaaS
-- This file can be used with supabase db push to create the database.

-- Enable Row Level Security (RLS) for tenant isolation
create policy "authenticated" on public.profiles for all to using (auth.uid() = id);

-- Users (provided by Supabase Auth)
-- profiles table stores additional user info
create table if not exists public.profiles (
  id uuid primary key references auth.users not null,
  email text unique,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Businesses (each user can own multiple businesses)
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) not null,
  name text not null,
  industry text,
  currency text default 'INR',
  created_at timestamp with time zone default now()
);

-- CSV Imports tracking
create table if not exists public.imports (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) not null,
  filename text not null,
  total_rows int,
  valid_rows int,
  error_rows int,
  duplicate_rows int,
  status text check (status in ('pending','processing','completed','failed')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Errors per import row
create table if not exists public.import_errors (
  id uuid primary key default uuid_generate_v4(),
  import_id uuid references public.imports(id) not null,
  row_number int not null,
  column_name text not null,
  raw_value text,
  error_reason text not null,
  created_at timestamp with time zone default now()
);

-- Transactions
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) not null,
  import_id uuid references public.imports(id),
  transaction_id text unique,
  customer_name text,
  customer_email text,
  customer_phone text,
  amount numeric not null,
  currency text not null default 'INR',
  status text check (status in ('success','pending','failed','refunded')),
  payment_method text,
  transaction_date timestamp with time zone,
  notes text,
  metadata jsonb,
  razorpay_payment_id text,
  created_at timestamp with time zone default now()
);

-- Razorpay payment records (optional extra tracking)
create table if not exists public.payment_records (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid references public.transactions(id) not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric,
  status text,
  signature text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on tables
alter table public.businesses enable row level security;
alter table public.imports enable row level security;
alter table public.import_errors enable row level security;
alter table public.transactions enable row level security;
alter table public.payment_records enable row level security;

-- Policies for tenant isolation (example for business table)
create policy "business_owner" on public.businesses for all using (owner_id = auth.uid());
create policy "business_insert" on public.businesses for insert with check (owner_id = auth.uid());

-- Add policies for other tables similarly (omitted for brevity)
