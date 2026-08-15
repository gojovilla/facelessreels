"use server";

import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export interface UserSettingsPayload {
  email_on_render_complete?: boolean;
  email_daily_summary?: boolean;
  alert_on_token_expiry?: boolean;
  auto_publish_default?: boolean;
  default_privacy?: "public" | "unlisted" | "private";
  metadata?: Record<string, any>;
}

export interface UserSettingsItem extends UserSettingsPayload {
  id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch general user settings from Supabase
 */
export async function getUserSettings(): Promise<{
  success: boolean;
  settings: UserSettingsItem | null;
  message?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) return { success: true, settings: null };

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("[Supabase] user_settings query notice:", error.message);
      return {
        success: true,
        settings: {
          user_id: user.id,
          email_on_render_complete: true,
          email_daily_summary: true,
          alert_on_token_expiry: true,
          auto_publish_default: true,
          default_privacy: "public",
        },
      };
    }

    return {
      success: true,
      settings: data || {
        user_id: user.id,
        email_on_render_complete: true,
        email_daily_summary: true,
        alert_on_token_expiry: true,
        auto_publish_default: true,
        default_privacy: "public",
      },
    };
  } catch (err: any) {
    return { success: false, settings: null, message: err?.message };
  }
}

/**
 * Save / update general user settings in Supabase
 */
export async function saveUserSettings(
  payload: UserSettingsPayload
): Promise<{ success: boolean; message: string; settings?: UserSettingsItem }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const dataToSave = {
      user_id: user.id,
      email_on_render_complete: payload.email_on_render_complete ?? true,
      email_daily_summary: payload.email_daily_summary ?? true,
      alert_on_token_expiry: payload.alert_on_token_expiry ?? true,
      auto_publish_default: payload.auto_publish_default ?? true,
      default_privacy: payload.default_privacy || "public",
      metadata: payload.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    let resData: any;

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("user_settings")
        .update(dataToSave)
        .eq("id", existing[0].id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      resData = data;
    } else {
      const { data, error } = await supabase
        .from("user_settings")
        .insert({
          ...dataToSave,
          created_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      resData = data;
    }

    return {
      success: true,
      message: "Preferences updated successfully in Supabase!",
      settings: resData,
    };
  } catch (err: any) {
    console.error("Failed to save user settings:", err);
    return {
      success: false,
      message: err?.message || "Failed to save settings to database",
    };
  }
}
