/*
  # Initial Schema Setup for Trading Platform

  1. New Tables
    - `users`: Stores user information
    - `portfolios`: User portfolios
    - `transactions`: Transaction records
    - `alerts`: Price alerts

  2. Security
    - RLS enabled on all tables
    - Policies for users to access only their own data
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE,
  crypto_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  amount numeric NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  crypto_id text NOT NULL,
  price numeric NOT NULL,
  condition text NOT NULL CHECK (condition IN ('above', 'below')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own portfolios" ON portfolios
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own transactions" ON transactions
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM portfolios WHERE id = transactions.portfolio_id
        )
    );

CREATE POLICY "Users can CRUD own alerts" ON alerts
    FOR ALL USING (auth.uid() = user_id);