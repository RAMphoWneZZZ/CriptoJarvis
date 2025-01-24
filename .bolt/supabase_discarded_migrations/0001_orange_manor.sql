/*
  # Initial Database Schema Setup

  1. Tables
    - auth.users (managed by Supabase Auth)
    - public.user_profiles
      - Extended user information and subscription status
    - public.subscriptions
      - Subscription plans and history
    - public.historical_prices
      - Historical cryptocurrency price data
    - public.predictions
      - ML model predictions
    - public.portfolios
      - User portfolio tracking
    - public.alerts
      - Price alerts configuration

  2. Security
    - RLS enabled on all tables
    - Policies for user data access
    - Admin-only access where appropriate
*/

-- Create schema for application
CREATE SCHEMA IF NOT EXISTS app;

-- User profiles with subscription info
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'user',
  subscription_status TEXT NOT NULL DEFAULT 'inactive',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions tracking
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_plan_type CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired'))
);

-- Historical cryptocurrency prices
CREATE TABLE IF NOT EXISTS public.historical_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id TEXT NOT NULL,
  price DECIMAL NOT NULL,
  source TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT positive_price CHECK (price > 0)
);

CREATE INDEX idx_historical_prices_crypto_timestamp 
ON public.historical_prices(crypto_id, timestamp);

-- ML model predictions
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id TEXT NOT NULL,
  predicted_price DECIMAL NOT NULL,
  confidence DECIMAL NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  timeframe TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_timeframe CHECK (timeframe IN ('1h', '4h', '24h', '7d'))
);

-- User portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  wallet_address TEXT NOT NULL,
  network TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_network CHECK (network IN ('ethereum', 'solana', 'bitcoin'))
);

-- Price alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  crypto_id TEXT NOT NULL,
  price DECIMAL NOT NULL,
  condition TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_condition CHECK (condition IN ('above', 'below'))
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Historical Prices
CREATE POLICY "Everyone can read historical prices"
  ON public.historical_prices FOR SELECT
  TO authenticated
  USING (true);

-- Predictions
CREATE POLICY "Subscribers can read predictions"
  ON public.predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND subscription_status = 'active'
    )
  );

-- Portfolios
CREATE POLICY "Users can manage own portfolios"
  ON public.portfolios FOR ALL
  USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "Users can manage own alerts"
  ON public.alerts FOR ALL
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_predictions_crypto_created 
ON public.predictions(crypto_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolios_user 
ON public.portfolios(user_id);

CREATE INDEX IF NOT EXISTS idx_alerts_user 
ON public.alerts(user_id);