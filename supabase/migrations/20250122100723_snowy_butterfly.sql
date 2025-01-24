/*
  # Tablas para datos de criptomonedas
  
  1. Nuevas Tablas
    - historical_prices: Almacena precios históricos
    - trading_volumes: Almacena volúmenes de trading
    - market_data: Almacena datos de mercado
    
  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para lectura pública
*/

-- Precios históricos
CREATE TABLE IF NOT EXISTS historical_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id text NOT NULL,
  price numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE historical_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de precios históricos"
  ON historical_prices
  FOR SELECT
  TO public
  USING (true);

-- Volúmenes de trading
CREATE TABLE IF NOT EXISTS trading_volumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id text NOT NULL,
  volume numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trading_volumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de volúmenes"
  ON trading_volumes
  FOR SELECT
  TO public
  USING (true);

-- Datos de mercado
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crypto_id text NOT NULL,
  market_cap numeric,
  circulating_supply numeric,
  total_supply numeric,
  max_supply numeric,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de datos de mercado"
  ON market_data
  FOR SELECT
  TO public
  USING (true);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_historical_prices_crypto_id ON historical_prices(crypto_id);
CREATE INDEX IF NOT EXISTS idx_trading_volumes_crypto_id ON trading_volumes(crypto_id);
CREATE INDEX IF NOT EXISTS idx_market_data_crypto_id ON market_data(crypto_id);