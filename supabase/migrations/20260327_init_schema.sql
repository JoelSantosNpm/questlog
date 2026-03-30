-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE rarity AS ENUM ('JUNK', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT');
CREATE TYPE resource_type AS ENUM ('MONSTER_TEMPLATE', 'ITEM_TEMPLATE', 'CHARACTER_TEMPLATE', 'CAMPAIGN');
CREATE TYPE access_type AS ENUM ('VIEW', 'EDIT');

-- 3. TABLAS

-- Usuarios (Sincronizados desde Clerk)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    plan TEXT DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campañas
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    system TEXT DEFAULT 'D&D 5e',
    location TEXT,
    next_session TIMESTAMP WITH TIME ZONE,
    is_private BOOLEAN DEFAULT true,
    parent_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    game_master_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plantillas de Monstruos
CREATE TABLE monster_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
    challenge FLOAT DEFAULT 1.0,
    max_hp INTEGER NOT NULL,
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    abilities JSONB,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    price FLOAT DEFAULT 0.0,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plantillas de Personajes
CREATE TABLE character_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    price FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ítems (Templates)
CREATE TABLE item_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    weight FLOAT DEFAULT 0.0,
    value INTEGER DEFAULT 0,
    rarity rarity DEFAULT 'COMMON',
    is_public BOOLEAN DEFAULT false,
    strength INTEGER DEFAULT 0,
    dexterity INTEGER DEFAULT 0,
    constitution INTEGER DEFAULT 0,
    intelligence INTEGER DEFAULT 0,
    wisdom INTEGER DEFAULT 0,
    charisma INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    speed INTEGER DEFAULT 0,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 0,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personajes (Instancias)
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES character_templates(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 1,
    current_hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    temp_hp INTEGER DEFAULT 0,
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ítems (Instancias)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    quantity INTEGER DEFAULT 1,
    rarity rarity DEFAULT 'COMMON',
    is_equipped BOOLEAN DEFAULT false,
    is_attuned BOOLEAN DEFAULT false,
    notes TEXT,
    strength INTEGER DEFAULT 0,
    dexterity INTEGER DEFAULT 0,
    constitution INTEGER DEFAULT 0,
    intelligence INTEGER DEFAULT 0,
    wisdom INTEGER DEFAULT 0,
    charisma INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    speed INTEGER DEFAULT 0,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 0,
    template_id UUID REFERENCES item_templates(id) ON DELETE SET NULL,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notas de Sesión
CREATE TABLE session_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    content TEXT NOT NULL,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Misiones (Quests)
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    visible_to_players BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'NORMAL',
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monstruos Activos
CREATE TABLE active_monsters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    current_hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    initiative INTEGER,
    status TEXT[],
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    initiative_bonus INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    template_id UUID REFERENCES monster_templates(id) ON DELETE SET NULL,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security)
-- Nota: Para que esto funcione con Clerk, configuramos las políticas basadas en clerk_id (vía JWT)

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE monster_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_monsters ENABLE ROW LEVEL SECURITY;

-- Políticas de Usuarios: Solo el dueño lee sus datos
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (clerk_id = auth.uid()::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (clerk_id = auth.uid()::text);

-- Políticas de Campañas: Solo el Game Master gestiona su campaña
CREATE POLICY "GM can manage own campaigns" ON campaigns FOR ALL USING (
    game_master_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);

-- Políticas de Templates: Creador gestiona, todos leen si es público
CREATE POLICY "Authors can manage own monster templates" ON monster_templates FOR ALL USING (
    author_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);
CREATE POLICY "Public monster templates are viewable by all" ON monster_templates FOR SELECT USING (is_published = true);

-- Repetir patrón similar para el resto de tablas...
