export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlatformType = "youtube" | "instagram" | "tiktok" | "email";
export type SubscriptionTier = "free" | "starter" | "pro" | "agency";
export type ReelStatus = "draft" | "generating" | "scheduled" | "published" | "failed";
export type ScheduleStatus = "pending" | "processing" | "published" | "failed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          tier: SubscriptionTier;
          credits_remaining: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          avatar_url?: string | null;
          tier?: SubscriptionTier;
          credits_remaining?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          avatar_url?: string | null;
          tier?: SubscriptionTier;
          credits_remaining?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          tier: SubscriptionTier;
          credits_remaining: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: SubscriptionTier;
          credits_remaining?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: SubscriptionTier;
          credits_remaining?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      channels: {
        Row: {
          id: string;
          user_id: string;
          platform: PlatformType;
          channel_name: string;
          channel_handle: string | null;
          avatar_url: string | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          is_active: boolean;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: PlatformType;
          channel_name: string;
          channel_handle?: string | null;
          avatar_url?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          is_active?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: PlatformType;
          channel_name?: string;
          channel_handle?: string | null;
          avatar_url?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          is_active?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "channels_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      reels: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          niche: string;
          hook: string | null;
          script: string | null;
          voice_id: string | null;
          voice_name: string | null;
          caption_style: string | null;
          background_music: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          target_channels: PlatformType[];
          status: ReelStatus;
          viral_score: number | null;
          predicted_views: string | null;
          actual_views: number;
          scheduled_at: string | null;
          published_at: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          niche: string;
          hook?: string | null;
          script?: string | null;
          voice_id?: string | null;
          voice_name?: string | null;
          caption_style?: string | null;
          background_music?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          target_channels?: PlatformType[];
          status?: ReelStatus;
          viral_score?: number | null;
          predicted_views?: string | null;
          actual_views?: number;
          scheduled_at?: string | null;
          published_at?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          niche?: string;
          hook?: string | null;
          script?: string | null;
          voice_id?: string | null;
          voice_name?: string | null;
          caption_style?: string | null;
          background_music?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          target_channels?: PlatformType[];
          status?: ReelStatus;
          viral_score?: number | null;
          predicted_views?: string | null;
          actual_views?: number;
          scheduled_at?: string | null;
          published_at?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reels_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      schedules: {
        Row: {
          id: string;
          user_id: string;
          reel_id: string;
          channel_id: string | null;
          platform: PlatformType;
          scheduled_time: string;
          status: ScheduleStatus;
          external_post_id: string | null;
          published_url: string | null;
          error_message: string | null;
          attempts: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reel_id: string;
          channel_id?: string | null;
          platform: PlatformType;
          scheduled_time: string;
          status?: ScheduleStatus;
          external_post_id?: string | null;
          published_url?: string | null;
          error_message?: string | null;
          attempts?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reel_id?: string;
          channel_id?: string | null;
          platform?: PlatformType;
          scheduled_time?: string;
          status?: ScheduleStatus;
          external_post_id?: string | null;
          published_url?: string | null;
          error_message?: string | null;
          attempts?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedules_reel_id_fkey";
            columns: ["reel_id"];
            isOneToOne: false;
            referencedRelation: "reels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedules_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedules_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      platform_type: PlatformType;
      subscription_tier: SubscriptionTier;
      reel_status: ReelStatus;
      schedule_status: ScheduleStatus;
    };
  };
}
