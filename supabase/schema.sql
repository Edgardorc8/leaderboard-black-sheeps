-- ============================================================
-- DTodoSales ENTERPRISE HUB — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- ========== EXTENSIONES ==========
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== TABLA: characters ==========
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  fullbody_url TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  is_assigned BOOLEAN DEFAULT FALSE,
  assigned_to_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TABLA: users ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  total_sales NUMERIC(12,2) DEFAULT 0,
  sales_count INT DEFAULT 0,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FK de characters → users (referencia cruzada)
ALTER TABLE characters
  ADD CONSTRAINT fk_characters_assigned_user
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- ========== TABLA: sales ==========
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_sales ON users(total_sales DESC);
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);

-- ========== VISTA: leaderboard_view ==========
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  u.id,
  u.discord_id,
  u.name,
  u.avatar_url AS user_avatar_url,
  u.total_sales,
  u.sales_count,
  u.character_id,
  c.name AS character_name,
  c.fullbody_url AS character_fullbody_url,
  c.avatar_url AS character_avatar_url,
  RANK() OVER (ORDER BY u.total_sales DESC) AS rank
FROM users u
LEFT JOIN characters c ON u.character_id = c.id
ORDER BY u.total_sales DESC;

-- ========== FUNCIÓN RPC: assign_character ==========
CREATE OR REPLACE FUNCTION assign_character(p_user_id UUID, p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_owner UUID;
  v_old_character_id UUID;
BEGIN
  -- 1. Bloquear la fila del personaje para evitar condiciones de carrera
  SELECT assigned_to_user_id INTO v_current_owner
  FROM characters
  WHERE id = p_character_id
  FOR UPDATE;

  -- Verificar que el personaje existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'El personaje con ID % no existe.', p_character_id;
  END IF;

  -- 2. Verificar si el personaje ya está asignado a OTRO usuario
  SELECT assigned_to_user_id INTO v_current_owner
  FROM characters
  WHERE id = p_character_id AND is_assigned = TRUE;

  IF v_current_owner IS NOT NULL AND v_current_owner != p_user_id THEN
    RAISE EXCEPTION 'Este personaje ya está asignado a otro asesor. Regla de exclusividad activa.';
  END IF;

  -- 3. Si el usuario ya tenía un personaje, liberarlo
  SELECT character_id INTO v_old_character_id
  FROM users
  WHERE id = p_user_id;

  IF v_old_character_id IS NOT NULL AND v_old_character_id != p_character_id THEN
    UPDATE characters
    SET is_assigned = FALSE, assigned_to_user_id = NULL
    WHERE id = v_old_character_id;
  END IF;

  -- 4. Asignar el nuevo personaje
  UPDATE characters
  SET is_assigned = TRUE, assigned_to_user_id = p_user_id
  WHERE id = p_character_id;

  -- 5. Actualizar el character_id en la tabla users
  UPDATE users
  SET character_id = p_character_id
  WHERE id = p_user_id;
END;
$$;

-- ========== RLS (Row Level Security) ==========
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para anon key (leaderboard público)
CREATE POLICY "Allow public read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read on characters" ON characters FOR SELECT USING (true);
CREATE POLICY "Allow public read on sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sales" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public update on characters" ON characters FOR UPDATE USING (true);

-- ========== HABILITAR REALTIME ==========
ALTER PUBLICATION supabase_realtime ADD TABLE sales;
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- ============================================================
-- SEED DATA — Datos de prueba
-- ============================================================

-- Insertar personajes (Ovejas Guerreras 3D)
INSERT INTO characters (id, name, fullbody_url, avatar_url) VALUES
  ('a1b2c3d4-1111-4000-8000-000000000001', 'Alex (The Closer)', 'https://dummyimage.com/300x500/1a1a2e/e94560.png&text=Alex+Closer', 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex-closer'),
  ('a1b2c3d4-2222-4000-8000-000000000002', 'Sofía (Deal Maker)', 'https://dummyimage.com/300x500/1a1a2e/f5a623.png&text=Sofia+DealMaker', 'https://api.dicebear.com/7.x/adventurer/svg?seed=sofia-deal'),
  ('a1b2c3d4-3333-4000-8000-000000000003', 'Diego (Top Hunter)', 'https://dummyimage.com/300x500/1a1a2e/00d2ff.png&text=Diego+Hunter', 'https://api.dicebear.com/7.x/adventurer/svg?seed=diego-hunter'),
  ('a1b2c3d4-4444-4000-8000-000000000004', 'Valeria (Sales Pro)', 'https://dummyimage.com/300x500/1a1a2e/a855f7.png&text=Valeria+Pro', 'https://api.dicebear.com/7.x/adventurer/svg?seed=valeria-pro'),
  ('a1b2c3d4-5555-4000-8000-000000000005', 'Marcos (Wolf)', 'https://dummyimage.com/300x500/1a1a2e/22c55e.png&text=Marcos+Wolf', 'https://api.dicebear.com/7.x/adventurer/svg?seed=marcos-wolf'),
  ('a1b2c3d4-6666-4000-8000-000000000006', 'Elena (Deals Queen)', 'https://dummyimage.com/300x500/1a1a2e/ec4899.png&text=Elena+Queen', 'https://api.dicebear.com/7.x/adventurer/svg?seed=elena-queen'),
  ('a1b2c3d4-7777-4000-8000-000000000007', 'Javier (Thunder)', 'https://dummyimage.com/300x500/1a1a2e/fbbf24.png&text=Javier+Thunder', 'https://api.dicebear.com/7.x/adventurer/svg?seed=javier-thunder');

-- Insertar usuarios
INSERT INTO users (id, discord_id, name, avatar_url, total_sales, sales_count, character_id) VALUES
  ('b1c2d3e4-1111-4000-8000-000000000001', '100000000000000001', 'Carlos Méndez', 'https://api.dicebear.com/7.x/adventurer/svg?seed=carlos', 124500.00, 68, 'a1b2c3d4-1111-4000-8000-000000000001'),
  ('b1c2d3e4-2222-4000-8000-000000000002', '100000000000000002', 'Ana Gómez', 'https://api.dicebear.com/7.x/adventurer/svg?seed=ana', 98200.00, 54, 'a1b2c3d4-2222-4000-8000-000000000002'),
  ('b1c2d3e4-3333-4000-8000-000000000003', '100000000000000003', 'Diego Ruiz', 'https://api.dicebear.com/7.x/adventurer/svg?seed=diego', 76400.00, 42, 'a1b2c3d4-3333-4000-8000-000000000003'),
  ('b1c2d3e4-4444-4000-8000-000000000004', '100000000000000004', 'Valeria Castillo', 'https://api.dicebear.com/7.x/adventurer/svg?seed=valeria', 58900.00, 31, 'a1b2c3d4-4444-4000-8000-000000000004'),
  ('b1c2d3e4-5555-4000-8000-000000000005', '100000000000000005', 'Marcos Varela', 'https://api.dicebear.com/7.x/adventurer/svg?seed=marcos', 44200.00, 25, 'a1b2c3d4-5555-4000-8000-000000000005'),
  ('b1c2d3e4-6666-4000-8000-000000000006', '100000000000000006', 'Elena Peña', 'https://api.dicebear.com/7.x/adventurer/svg?seed=elena', 39500.00, 21, 'a1b2c3d4-6666-4000-8000-000000000006'),
  ('b1c2d3e4-7777-4000-8000-000000000007', '100000000000000007', 'Javier López', 'https://api.dicebear.com/7.x/adventurer/svg?seed=javier', 31200.00, 18, 'a1b2c3d4-7777-4000-8000-000000000007');

-- Actualizar personajes con sus asignaciones
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-1111-4000-8000-000000000001' WHERE id = 'a1b2c3d4-1111-4000-8000-000000000001';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-2222-4000-8000-000000000002' WHERE id = 'a1b2c3d4-2222-4000-8000-000000000002';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-3333-4000-8000-000000000003' WHERE id = 'a1b2c3d4-3333-4000-8000-000000000003';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-4444-4000-8000-000000000004' WHERE id = 'a1b2c3d4-4444-4000-8000-000000000004';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-5555-4000-8000-000000000005' WHERE id = 'a1b2c3d4-5555-4000-8000-000000000005';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-6666-4000-8000-000000000006' WHERE id = 'a1b2c3d4-6666-4000-8000-000000000006';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'b1c2d3e4-7777-4000-8000-000000000007' WHERE id = 'a1b2c3d4-7777-4000-8000-000000000007';

-- Insertar ventas de ejemplo
INSERT INTO sales (user_id, amount) VALUES
  ('b1c2d3e4-1111-4000-8000-000000000001', 25000.00),
  ('b1c2d3e4-1111-4000-8000-000000000001', 15000.00),
  ('b1c2d3e4-1111-4000-8000-000000000001', 5000.00),
  ('b1c2d3e4-2222-4000-8000-000000000002', 25000.00),
  ('b1c2d3e4-2222-4000-8000-000000000002', 5000.00),
  ('b1c2d3e4-3333-4000-8000-000000000003', 25000.00),
  ('b1c2d3e4-4444-4000-8000-000000000004', 5000.00),
  ('b1c2d3e4-5555-4000-8000-000000000005', 25000.00),
  ('b1c2d3e4-6666-4000-8000-000000000006', 5000.00),
  ('b1c2d3e4-7777-4000-8000-000000000007', 5000.00);
