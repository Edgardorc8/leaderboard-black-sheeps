-- ============================================================
-- DTodoSales ENTERPRISE HUB — Schema SQL Oficial para Supabase
-- (Leaderboard Black Sheeps Edition)
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== TABLA: characters (10 Ovejas Negras) ==========
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  archetype VARCHAR(100),
  avatar_url TEXT NOT NULL,
  card_url TEXT NOT NULL,
  fullbody_url TEXT NOT NULL,
  is_assigned BOOLEAN DEFAULT FALSE,
  assigned_to_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TABLA: users (Equipo con Roles) ==========
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  discord_id VARCHAR(50) UNIQUE,
  discord_tag VARCHAR(50) NOT NULL,
  country VARCHAR(64) DEFAULT '🇻🇪 Venezuela',
  role VARCHAR(20) DEFAULT 'sales_agent' CHECK (role IN ('super_admin', 'admin', 'sales_agent')),
  is_verified BOOLEAN DEFAULT TRUE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  custom_character_name VARCHAR(100),
  battle_cry VARCHAR(255),
  total_sales NUMERIC(12,2) DEFAULT 0,
  sales_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referencia cruzada
ALTER TABLE characters
  DROP CONSTRAINT IF EXISTS fk_characters_assigned_user;

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

-- Índices
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_sales ON users(total_sales DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);

-- ========== VISTA: leaderboard_view ==========
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  u.id,
  u.email,
  u.name,
  u.discord_id,
  u.discord_tag,
  u.country,
  u.role,
  u.custom_character_name,
  u.battle_cry,
  u.total_sales,
  u.sales_count,
  u.character_id,
  c.name AS character_name,
  c.avatar_url AS character_avatar_url,
  c.card_url AS character_card_url,
  c.fullbody_url AS character_fullbody_url,
  RANK() OVER (ORDER BY u.total_sales DESC) AS rank
FROM users u
LEFT JOIN characters c ON u.character_id = c.id
ORDER BY u.total_sales DESC;

-- ========== FUNCIÓN RPC: assign_character ==========
CREATE OR REPLACE FUNCTION assign_character(
  p_user_id UUID,
  p_character_id UUID,
  p_custom_name VARCHAR DEFAULT NULL,
  p_battle_cry VARCHAR DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_owner UUID;
  v_old_character_id UUID;
BEGIN
  -- 1. Bloquear la fila del personaje
  SELECT assigned_to_user_id INTO v_current_owner
  FROM characters
  WHERE id = p_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El personaje no existe.';
  END IF;

  -- 2. Verificar exclusividad
  IF v_current_owner IS NOT NULL AND v_current_owner != p_user_id THEN
    RAISE EXCEPTION 'Este personaje ya está ocupado por otro asesor.';
  END IF;

  -- 3. Liberar personaje anterior
  SELECT character_id INTO v_old_character_id
  FROM users
  WHERE id = p_user_id;

  IF v_old_character_id IS NOT NULL AND v_old_character_id != p_character_id THEN
    UPDATE characters
    SET is_assigned = FALSE, assigned_to_user_id = NULL
    WHERE id = v_old_character_id;
  END IF;

  -- 4. Asignar nuevo personaje
  UPDATE characters
  SET is_assigned = TRUE, assigned_to_user_id = p_user_id
  WHERE id = p_character_id;

  -- 5. Actualizar usuario
  UPDATE users
  SET
    character_id = p_character_id,
    custom_character_name = COALESCE(p_custom_name, custom_character_name),
    battle_cry = COALESCE(p_battle_cry, battle_cry)
  WHERE id = p_user_id;
END;
$$;

-- ========== SEED DATA: 10 Ovejas Negras ==========
INSERT INTO characters (id, slug, name, archetype, avatar_url, card_url, fullbody_url)
VALUES
  ('c0000000-0000-0000-0000-000000000001', '01_sheep_alex', 'Alex (The Golden Closer)', 'Líder / Trofeo de Oro', '/characters/01_sheep_alex/avatar.png', '/characters/01_sheep_alex/card.png', '/characters/01_sheep_alex/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000002', '02_sheep_sofia', 'Sofía (The Mystic Dealmaker)', 'Estratega / Capa Púrpura', '/characters/02_sheep_sofia/avatar.png', '/characters/02_sheep_sofia/card.png', '/characters/02_sheep_sofia/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000003', '03_sheep_diego', 'Diego (The Cyber Hunter)', 'Cazador / Visor Cian', '/characters/03_sheep_diego/avatar.png', '/characters/03_sheep_diego/card.png', '/characters/03_sheep_diego/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000004', '04_sheep_valeria', 'Valeria (The Neon Valkyrie)', 'Guerrera / Alas Fucsia', '/characters/04_sheep_valeria/avatar.png', '/characters/04_sheep_valeria/card.png', '/characters/04_sheep_valeria/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000005', '05_sheep_marcos', 'Marcos (The Iron Ram)', 'Fuerza Bruta / Cuernos Hierro', '/characters/05_sheep_marcos/avatar.png', '/characters/05_sheep_marcos/card.png', '/characters/05_sheep_marcos/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000006', '06_sheep_elena', 'Elena (The Diamond Queen)', 'Monarca / Tiara Diamante', '/characters/06_sheep_elena/avatar.png', '/characters/06_sheep_elena/card.png', '/characters/06_sheep_elena/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000007', '07_sheep_javier', 'Javier (The Thunder Striker)', 'Velocista / Plasma Eléctrico', '/characters/07_sheep_javier/avatar.png', '/characters/07_sheep_javier/card.png', '/characters/07_sheep_javier/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000008', '08_sheep_mateo', 'Mateo (The Shadow Rogue)', 'Sigilo / Capucha Carmesí', '/characters/08_sheep_mateo/avatar.png', '/characters/08_sheep_mateo/card.png', '/characters/08_sheep_mateo/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000009', '09_sheep_camila', 'Camila (The Flame Empress)', 'Fuego Volcánico / Magma', '/characters/09_sheep_camila/avatar.png', '/characters/09_sheep_camila/card.png', '/characters/09_sheep_camila/fullbody.png'),
  ('c0000000-0000-0000-0000-000000000010', '10_sheep_lucas', 'Lucas (The Titan Vanguard)', 'Tanque / Escudo Obsidiana', '/characters/10_sheep_lucas/avatar.png', '/characters/10_sheep_lucas/card.png', '/characters/10_sheep_lucas/fullbody.png')
ON CONFLICT (id) DO NOTHING;

-- ========== SEED DATA: Super Admin (Edgardo) y Equipo ==========
INSERT INTO users (id, email, name, discord_id, discord_tag, country, role, character_id, custom_character_name, battle_cry, total_sales, sales_count)
VALUES
  ('u0000000-0000-0000-0000-000000000001', 'edgardorc8@gmail.com', 'Edgardo Alfonso Rangel', '100000000000000001', '@edgardorc8', '🇻🇪 Venezuela', 'super_admin', 'c0000000-0000-0000-0000-000000000001', 'The Golden Closer', '¡Trato cerrado, la manada no perdona!', 124500.00, 68),
  ('u0000000-0000-0000-0000-000000000002', 'ana@dtodosales.com', 'Ana Gómez', '100000000000000002', '@ana_sales', '🇦🇷 Argentina', 'admin', 'c0000000-0000-0000-0000-000000000002', 'The Mystic Dealmaker', '¡La estrategia mística nunca falla!', 98200.00, 54),
  ('u0000000-0000-0000-0000-000000000003', 'diego@dtodosales.com', 'Diego Ruiz', '100000000000000003', '@diego_vip', '🇲🇽 México', 'sales_agent', 'c0000000-0000-0000-0000-000000000003', 'The Cyber Hunter', '¡Objetivo localizado y cerrado con éxito!', 76400.00, 42)
ON CONFLICT (id) DO NOTHING;

-- Marcar asignados
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'u0000000-0000-0000-0000-000000000001' WHERE id = 'c0000000-0000-0000-0000-000000000001';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'u0000000-0000-0000-0000-000000000002' WHERE id = 'c0000000-0000-0000-0000-000000000002';
UPDATE characters SET is_assigned = TRUE, assigned_to_user_id = 'u0000000-0000-0000-0000-000000000003' WHERE id = 'c0000000-0000-0000-0000-000000000003';
