/*
  # Sistema de roles y logs

  1. Nuevas Tablas
    - `roles`: Define los roles del sistema
    - `user_roles`: Asigna roles a usuarios
    - `api_logs`: Registra el uso de APIs
    - `data_providers`: Fuentes de datos de criptomonedas
    - `provider_status`: Estado de los proveedores

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas específicas por rol
*/

-- Roles del sistema
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Asignación de roles a usuarios
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Registro de uso de APIs
CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  endpoint text NOT NULL,
  status integer,
  response_time integer,
  error text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Proveedores de datos
CREATE TABLE IF NOT EXISTS data_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  priority integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE data_providers ENABLE ROW LEVEL SECURITY;

-- Estado de los proveedores
CREATE TABLE IF NOT EXISTS provider_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES data_providers(id) ON DELETE CASCADE,
  status text NOT NULL,
  last_check timestamptz DEFAULT now(),
  response_time integer,
  error text
);

ALTER TABLE provider_status ENABLE ROW LEVEL SECURITY;

-- Insertar roles básicos
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrador del sistema', '{"all": true}'::jsonb),
('premium', 'Usuario premium con acceso completo', '{"read:all": true, "write:own": true}'::jsonb),
('basic', 'Usuario básico con acceso limitado', '{"read:basic": true, "write:own": true}'::jsonb),
('free', 'Usuario gratuito con acceso mínimo', '{"read:free": true}'::jsonb);

-- Insertar proveedores de datos
INSERT INTO data_providers (name, priority, config) VALUES
('coingecko', 1, '{"api_version": "v3", "rate_limit": 50}'::jsonb),
('cryptocompare', 2, '{"websocket": true}'::jsonb),
('binance', 3, '{"use_websocket": true}'::jsonb);

-- Políticas de seguridad
CREATE POLICY "Admins can read all roles"
  ON roles FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id IN (SELECT id FROM roles WHERE name = 'admin')
  ));

CREATE POLICY "Users can read their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all logs"
  ON api_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id IN (SELECT id FROM roles WHERE name = 'admin')
  ));