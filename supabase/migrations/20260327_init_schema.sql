-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE rarity AS ENUM ('JUNK', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT');
CREATE TYPE resource_type AS ENUM ('MONSTER_TEMPLATE', 'ITEM_TEMPLATE', 'CHARACTER_TEMPLATE', 'CAMPAIGN');
CREATE TYPE access_type AS ENUM ('VIEW', 'EDIT');

-- 3. TABLAS (Usando camelCase para coincidir con el Front-end)

-- Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "clerkId" TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    plan TEXT DEFAULT 'FREE',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campañas
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    system TEXT DEFAULT 'D&D 5e',
    location TEXT,
    "nextSession" TIMESTAMP WITH TIME ZONE,
    "isPrivate" BOOLEAN DEFAULT true,
    "parentCampaignId" UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    "gameMasterId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plantillas de Monstruos
CREATE TABLE monster_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    "imageUrl" TEXT,
    challenge FLOAT DEFAULT 1.0,
    "maxHp" INTEGER NOT NULL,
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    "initiativeBonus" INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    abilities JSONB,
    "authorId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "isPublished" BOOLEAN DEFAULT false,
    price FLOAT DEFAULT 0.0,
    version INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plantillas de Personajes
CREATE TABLE character_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    ac INTEGER DEFAULT 10,
    speed INTEGER DEFAULT 30,
    "initiativeBonus" INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 10,
    "authorId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "isPublished" BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    price FLOAT DEFAULT 0.0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ítems (Templates)
CREATE TABLE item_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    category TEXT DEFAULT 'General',
    weight FLOAT DEFAULT 0.0,
    value INTEGER DEFAULT 0,
    rarity rarity DEFAULT 'COMMON',
    "isPublic" BOOLEAN DEFAULT false,
    strength INTEGER DEFAULT 0,
    dexterity INTEGER DEFAULT 0,
    constitution INTEGER DEFAULT 0,
    intelligence INTEGER DEFAULT 0,
    wisdom INTEGER DEFAULT 0,
    charisma INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    speed INTEGER DEFAULT 0,
    "initiativeBonus" INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 0,
    "creatorId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE monster_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users FOR SELECT USING ("clerkId" = auth.uid()::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING ("clerkId" = auth.uid()::text);

CREATE POLICY "GM can manage own campaigns" ON campaigns FOR ALL USING (
    "gameMasterId" IN (SELECT id FROM users WHERE "clerkId" = auth.uid()::text)
);
