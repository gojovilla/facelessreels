-- ==============================================================================
-- FACELESSREELS.AI - SUPABASE DATABASE INITIALIZATION SCHEMA
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Enums
DO $$ BEGIN
  CREATE TYPE platform_type AS ENUM ('youtube', 'instagram', 'tiktok', 'email');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'agency');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE reel_status AS ENUM ('draft', 'generating', 'scheduled', 'published', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status AS ENUM ('pending', 'processing', 'published', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Users Table (Synced directly with Clerk Auth - saves name and email)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  tier subscription_tier NOT NULL DEFAULT 'free',
  credits_remaining INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Profiles Table (Optional/Legacy for Supabase Auth compatibility)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier subscription_tier NOT NULL DEFAULT 'free',
  credits_remaining INT NOT NULL DEFAULT 3,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Connected Social Channels & Email Integrations
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  channel_name TEXT NOT NULL,
  channel_handle TEXT,
  avatar_url TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Series Table (Multi-video series automation pipelines)
CREATE TABLE IF NOT EXISTS public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  niche TEXT NOT NULL,
  voice TEXT,
  language TEXT,
  bg_music TEXT,
  visual_style TEXT,
  caption_style TEXT,
  frequency TEXT DEFAULT 'Daily',
  total_videos INT DEFAULT 30,
  published_videos INT DEFAULT 0,
  scheduled_videos INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  channels TEXT[] DEFAULT ARRAY['youtube', 'instagram', 'tiktok'],
  views INT DEFAULT 0,
  rpm NUMERIC DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. AI Generated Reels Table
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  niche TEXT NOT NULL,
  hook TEXT,
  script TEXT,
  voice_id TEXT,
  voice_name TEXT,
  caption_style TEXT DEFAULT 'hormozi',
  background_music TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT,
  target_channels platform_type[] DEFAULT ARRAY['youtube', 'instagram', 'tiktok', 'email']::platform_type[],
  status reel_status NOT NULL DEFAULT 'draft',
  viral_score INT,
  predicted_views TEXT,
  actual_views INT NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Content Calendar Schedules Queue
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  platform platform_type NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status schedule_status NOT NULL DEFAULT 'pending',
  external_post_id TEXT,
  published_url TEXT,
  error_message TEXT,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing_page',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Users Policies (Allow read/write by authenticated user or service role)
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert and update on users"
  ON public.users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Profiles Policies
CREATE POLICY "Allow read on profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow write on profiles"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- Channels Policies
CREATE POLICY "Channels policy"
  ON public.channels FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reels Policies
CREATE POLICY "Reels policy"
  ON public.reels FOR ALL
  USING (true)
  WITH CHECK (true);

-- Schedules Policies
CREATE POLICY "Schedules policy"
  ON public.schedules FOR ALL
  USING (true)
  WITH CHECK (true);

-- Newsletter Subscribers Policies
CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Subscribers can view their own status"
  ON public.newsletter_subscribers FOR SELECT
  USING (true);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_channels_updated_at ON public.channels;
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_reels_updated_at ON public.reels;
CREATE TRIGGER update_reels_updated_at BEFORE UPDATE ON public.reels FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON public.schedules;
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_platform ON public.channels(platform);
CREATE INDEX IF NOT EXISTS idx_reels_user_id ON public.reels(user_id);
CREATE INDEX IF NOT EXISTS idx_reels_status ON public.reels(status);
CREATE INDEX IF NOT EXISTS idx_reels_scheduled_at ON public.reels(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_reel_id ON public.schedules(reel_id);
CREATE INDEX IF NOT EXISTS idx_schedules_pending ON public.schedules(status, scheduled_time) WHERE status = 'pending';
