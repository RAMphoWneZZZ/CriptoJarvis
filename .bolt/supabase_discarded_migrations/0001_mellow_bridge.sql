/*
  # Initial Schema Setup

  1. Tables
    - users
      - Custom fields for user management and subscriptions
    - subscriptions
      - Manage user subscription status and plans
    - historical_prices
      - Store historical cryptocurrency prices
    - predictions
      - Store ML model predictions
    - portfolios
      - Track user portfolios
    - alerts
      - Store price alerts

  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies
*/

-- Users table with subscription info
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Historical prices table
CREATE TABLE IF NOT EXISTS historical_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id TEXT NOT NULL,
  price DECIMAL NOT NULL,
  source TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id TEXT NOT NULL,
  predicted_price DECIMAL NOT NULL,
  confidence DECIMAL NOT NULL,
  timeframe TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  wallet_address TEXT NOT NULL,
  network TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  crypto_id TEXT NOT NULL,
  price DECIMAL NOT NULL,
  condition TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create admin user
INSERT INTO users (email, role, subscription_status)
VALUES ('admin@cryptojarvis.com', 'admin', 'active');

-- Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add similar policies for other tables