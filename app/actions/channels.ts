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

export interface ConnectedChannelItem {
  id: string;
  user_id: string;
  platform: "youtube" | "instagram" | "tiktok" | "email";
  channel_name: string;
  channel_handle?: string | null;
  avatar_url?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  token_expires_at?: string | null;
  is_active: boolean;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SaveChannelInput {
  id?: string;
  platform: "youtube" | "instagram" | "tiktok" | "email";
  channel_name: string;
  channel_handle?: string;
  avatar_url?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Fetch all connected social channels for the currently logged-in user
 */
export async function getConnectedChannels(): Promise<{
  success: boolean;
  channels: ConnectedChannelItem[];
  message?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: true, channels: [] };
    }

    const email = user.emailAddresses?.[0]?.emailAddress;

    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.eq.${email}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase channels fetch notice:", error.message);
      return { success: true, channels: [] };
    }

    return {
      success: true,
      channels: data || [],
    };
  } catch (err: any) {
    console.error("Failed to load channels:", err);
    return { success: false, channels: [], message: err?.message };
  }
}

/**
 * Save or connect a new social media channel account in Supabase
 */
export async function saveConnectedChannel(
  input: SaveChannelInput
): Promise<{
  success: boolean;
  channel?: ConnectedChannelItem;
  message: string;
}> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const payload = {
      user_id: user.id,
      platform: input.platform,
      channel_name: input.channel_name,
      channel_handle: input.channel_handle || null,
      avatar_url: input.avatar_url || null,
      access_token: input.access_token || null,
      refresh_token: input.refresh_token || null,
      token_expires_at: input.token_expires_at || null,
      is_active: input.is_active ?? true,
      metadata: input.metadata || {},
      updated_at: new Date().toISOString(),
    };

    let result: ConnectedChannelItem;

    if (input.id) {
      // Update existing channel
      const { data, error } = await supabase
        .from("channels")
        .update(payload)
        .eq("id", input.id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      result = data;
    } else {
      // Check if this user already connected this platform and handle
      const { data: existing } = await supabase
        .from("channels")
        .select("id")
        .eq("user_id", user.id)
        .eq("platform", input.platform)
        .limit(1);

      if (existing && existing.length > 0) {
        // Update existing record for this platform
        const { data, error } = await supabase
          .from("channels")
          .update(payload)
          .eq("id", existing[0].id)
          .select("*")
          .single();

        if (error) throw new Error(error.message);
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("channels")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (error) throw new Error(error.message);
        result = data;
      }
    }

    return {
      success: true,
      message: `Successfully connected ${input.platform.toUpperCase()} account "${input.channel_name}"!`,
      channel: result,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to save connected channel",
    };
  }
}

/**
 * Disconnect/delete a social channel account
 */
export async function deleteConnectedChannel(
  channelId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { error } = await supabase
      .from("channels")
      .delete()
      .eq("id", channelId);

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: "Channel disconnected successfully.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to disconnect channel",
    };
  }
}

/**
 * Toggle auto-publishing on/off for a specific channel
 */
export async function toggleChannelActive(
  channelId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { error } = await supabase
      .from("channels")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", channelId);

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `Channel auto-publishing is now ${isActive ? "Active" : "Paused"}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update channel status",
    };
  }
}
