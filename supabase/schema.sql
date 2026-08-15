-- ==============================================================================
-- FACELESSREELS.AI - SUPABASE COMPLETE DATABASE INITIALIZATION SCHEMA
-- ==============================================================================
-- Run this SQL query directly in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Enums (Idempotent)
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

-- 3. Users Table (Synced directly with Clerk Authentication)
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

-- 4. Series Table (Captures all 6 Wizard Steps on Click of 'Schedule Series')
CREATE TABLE IF NOT EXISTS public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  
  -- Step 1: Niche & Topic
  title TEXT NOT NULL,
  niche TEXT NOT NULL,
  niche_type TEXT DEFAULT 'available',
  custom_prompt TEXT,
  
  -- Step 2: Language & Voice Selection
  voice TEXT,
  voice_id TEXT,
  language TEXT,
  language_code TEXT,
  
  -- Step 3: Background Music Selection
  bg_music TEXT,
  bg_music_tracks TEXT[] DEFAULT '{}'::TEXT[],
  bg_music_volume INT DEFAULT 22,
  
  -- Step 4: Visual Art Direction
  visual_style TEXT,
  visual_style_id TEXT,
  custom_style_modifier TEXT,
  
  -- Step 5: Animated Captions & Subtitles
  caption_style TEXT,
  caption_style_id TEXT,
  caption_words_per_batch INT DEFAULT 1,
  
  -- Step 6: Duration, Schedule & Publishing Channels
  duration_option TEXT DEFAULT '30-50 sec video',
  publish_time TEXT DEFAULT '18:30',
  frequency TEXT DEFAULT 'Daily @ 18:30',
  channels TEXT[] DEFAULT ARRAY['tiktok', 'youtube', 'instagram']::TEXT[],
  
  -- Automation Stats & Pipelines
  total_videos INT DEFAULT 30,
  published_videos INT DEFAULT 0,
  scheduled_videos INT DEFAULT 30,
  status TEXT DEFAULT 'active',
  views INT DEFAULT 0,
  rpm NUMERIC DEFAULT 0.0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AI Generated Reels Table (Linked to Series)
CREATE TABLE IF NOT EXISTS public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  niche TEXT NOT NULL,
  hook TEXT,
  script TEXT,
  voice_id TEXT,
  voice_name TEXT,
  caption_style TEXT DEFAULT 'Hormozi Viral Pop',
  background_music TEXT,
  audio_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT,
  target_channels platform_type[] DEFAULT ARRAY['youtube', 'instagram', 'tiktok', 'email']::platform_type[],
  status reel_status NOT NULL DEFAULT 'draft',
  viral_score INT DEFAULT 95,
  predicted_views TEXT,
  actual_views INT NOT NULL DEFAULT 0,
  scenes JSONB DEFAULT '[]'::jsonb,
  subtitles JSONB DEFAULT '[]'::jsonb,
  image_prompts TEXT[] DEFAULT '{}'::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Video Production Assets Table (Dedicated Asset Pipeline Registry)
CREATE TABLE IF NOT EXISTS public.video_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES public.reels(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  hook TEXT,
  voice_url TEXT,
  voice_provider TEXT,
  voice_id TEXT,
  caption_style TEXT,
  subtitles JSONB NOT NULL DEFAULT '[]'::jsonb,
  scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_prompts TEXT[] DEFAULT '{}'::TEXT[],
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  status TEXT NOT NULL DEFAULT 'ready_to_render',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Connected Social Channels & Email Integrations
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
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

-- 7. Content Calendar Schedules Queue
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
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

-- 9. General User Settings & Dispatch Preferences Table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  email_on_render_complete BOOLEAN NOT NULL DEFAULT TRUE,
  email_daily_summary BOOLEAN NOT NULL DEFAULT TRUE,
  alert_on_token_expiry BOOLEAN NOT NULL DEFAULT TRUE,
  auto_publish_default BOOLEAN NOT NULL DEFAULT TRUE,
  default_privacy TEXT NOT NULL DEFAULT 'public',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies (Allow access for server actions and client APIs)
DO $$ BEGIN
  CREATE POLICY "Allow public access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on series" ON public.series FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on reels" ON public.reels FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on channels" ON public.channels FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on newsletter_subscribers" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on user_settings" ON public.user_settings FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER
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

DROP TRIGGER IF EXISTS update_series_updated_at ON public.series;
CREATE TRIGGER update_series_updated_at BEFORE UPDATE ON public.series FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_reels_updated_at ON public.reels;
CREATE TRIGGER update_reels_updated_at BEFORE UPDATE ON public.reels FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_series_user_id ON public.series(user_id);
CREATE INDEX IF NOT EXISTS idx_series_status ON public.series(status);
CREATE INDEX IF NOT EXISTS idx_reels_user_id ON public.reels(user_id);
CREATE INDEX IF NOT EXISTS idx_reels_series_id ON public.reels(series_id);
CREATE INDEX IF NOT EXISTS idx_reels_status ON public.reels(status);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_reel_id ON public.schedules(reel_id);

-- ==============================================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION (voiceovers, images, renders)
-- ==============================================================================
-- Ensure 'voiceovers', 'images', and 'renders' buckets are created and set to public
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('voiceovers', 'voiceovers', true),
  ('images', 'images', true),
  ('renders', 'renders', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Security Policies for 'voiceovers'
DO $$ BEGIN
  CREATE POLICY "Allow public select on voiceovers" ON storage.objects
  FOR SELECT USING (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert on voiceovers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update on voiceovers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'voiceovers') WITH CHECK (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Storage Security Policies for 'images'
DO $$ BEGIN
  CREATE POLICY "Allow public select on images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert on images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update on images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;


