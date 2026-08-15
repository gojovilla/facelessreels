-- ==============================================================================
-- FACELESSREELS.AI - QUICK DATABASE MIGRATION SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor to add missing columns and tables:
-- https://supabase.com/dashboard/project/_/sql/new

-- 1. Add extended columns to existing 'reels' table
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS scenes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS subtitles JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS image_prompts TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Create 'video_assets' table for production asset registry
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

-- 3. Storage Buckets (voiceovers, images, renders)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('voiceovers', 'voiceovers', true),
  ('images', 'images', true),
  ('renders', 'renders', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage Security Policies
DO $$ BEGIN
  CREATE POLICY "Allow public select on voiceovers" ON storage.objects FOR SELECT USING (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert on voiceovers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update on voiceovers" ON storage.objects FOR UPDATE USING (bucket_id = 'voiceovers') WITH CHECK (bucket_id = 'voiceovers');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public select on images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert on images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update on images" ON storage.objects FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public access on video_assets" ON public.video_assets FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
