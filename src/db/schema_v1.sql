-- Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create USER table (named "users" to avoid conflict with PostgreSQL reserved keyword)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PROJECT table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    update_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create MODEL table
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL,
    url TEXT,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CONFIG table
CREATE TABLE configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    width INTEGER,
    height INTEGER,
    cfg_scale INTEGER,
    clip_guidance_preset TEXT,
    sampler TEXT,
    samples INTEGER,
    seed INTEGER,
    steps INTEGER,
    style_preset TEXT,
    extras TEXT,
    aspect_ratio TEXT,
    mode TEXT,
    image TEXT,
    strength REAL,
    model TEXT,
    output_format TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TEMPLATE table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    structure TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PROMPT table
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT, 
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    update_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create IMAGE table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    size TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    generation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    model_id UUID REFERENCES models(id) ON DELETE SET NULL,
    config_id UUID REFERENCES configs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TAG table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create BLOCK table
CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create COLLECTION table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for PROMPT and TAG (many-to-many)
CREATE TABLE prompt_tags (
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (prompt_id, tag_id)
);

-- Create junction table for PROMPT and BLOCK (many-to-many)
CREATE TABLE prompt_blocks (
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (prompt_id, block_id)
);

-- Create junction table for COLLECTION and PROMPT (many-to-many)
CREATE TABLE collection_prompts (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (collection_id, prompt_id)
);

-- Add Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON projects
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Prompts policies
CREATE POLICY "Users can view own prompts" ON prompts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = prompts.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view prompts in public projects" ON prompts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = prompts.project_id
            AND projects.is_public = TRUE
        )
    );

-- Similar policies for other tables...

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_prompts_project_id ON prompts(project_id);
CREATE INDEX idx_images_prompt_id ON images(prompt_id);
CREATE INDEX idx_configs_user_id ON configs(user_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_blocks_user_id ON blocks(user_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- Add created_at and updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configs_updated_at BEFORE UPDATE ON configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Populate users table with default values
INSERT INTO "public"."users" ("id", "username", "email", "password_hash", "registration_date", "last_login", "is_premium", "created_at", "updated_at") VALUES ('bb51fcb4-1390-45c9-8452-4fe2255f060d', 'Default', 'default@default.test', 'asdasgafgerwtwertybsbsdbsd', '2025-02-28', null, 'false', '2025-02-28 03:12:37.642803+00', '2025-02-28 03:12:37.642803+00');

-- Populate models table with default values
INSERT INTO "public"."models" ("id", "name", "description", "version", "url", "is_active", "created_at", "updated_at", "config_id") 
VALUES ('1b1769b7-c8a1-4f67-a7ee-422dd05ac430', 'SDXL 1.0', 'SDXL 1.0', '', 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', 'true', '2025-02-28 21:15:30.494538+00', '2025-02-28 21:15:30.494538+00', null),
 ('26ba7d80-78dd-47da-886c-193f0d6c0f17', 'Stable Image Core', 'Stable Image Core', '', 'https://api.stability.ai/v2beta/stable-image/generate/core', 'true', '2025-02-28 21:24:49.009585+00', '2025-02-28 21:24:49.009585+00', null),
 ('8cee7dd5-a3f1-4876-bf56-2838fb159845', 'Stable Image Ultra', 'Stable Image Ultra', '', 'https://api.stability.ai/v2beta/stable-image/generate/ultra', 'true', '2025-02-28 21:25:23.601874+00', '2025-02-28 21:25:23.601874+00', null),
 ('bbd7a2c7-0a55-4580-966f-4c2bc00c4047', 'SD 1.6', 'SD 1.6', '', 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', 'true', '2025-02-28 21:17:55.434585+00', '2025-02-28 21:17:55.434585+00', null),
 ('fd4308b8-6976-437e-ab46-9b19a3676de5', 'SD 3.0 & 3.5', 'SD 3.0 & 3.5', '', 'https://api.stability.ai/v2beta/stable-image/generate/sd3', 'true', '2025-02-28 21:22:12.677936+00', '2025-02-28 21:22:12.677936+00', null);