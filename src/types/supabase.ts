// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          password_hash: string;
          registration_date: string;
          last_login: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          password_hash: string;
          registration_date?: string;
          last_login?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          password_hash?: string;
          registration_date?: string;
          last_login?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          creation_date: string;
          update_date: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          creation_date?: string;
          update_date?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          creation_date?: string;
          update_date?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      models: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          version: string;
          url: string | null;
          slug: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          version: string;
          url?: string | null;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          version?: string;
          url?: string | null;
          slug?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      model_configs: {
        Row: {
          id: string;
          model_id: string;
          width: number | null;
          height: number | null;
          cfg_scale: number | null;
          clip_guidance: string | null;
          sampler: string | null;
          samples: number | null;
          seed: number | null;
          steps: number | null;
          style_preset: string | null;
          extras: string | null;
          aspect_ratio: string | null;
          mode: string | null;
          image: string | null;
          strength: number | null;
          model: string | null;
          output_format: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          width?: number | null;
          height?: number | null;
          cfg_scale?: number | null;
          clip_guidance?: string | null;
          sampler?: string | null;
          samples?: number | null;
          seed?: number | null;
          steps?: number | null;
          style_preset?: string | null;
          extras?: string | null;
          aspect_ratio?: string | null;
          mode?: string | null;
          image?: string | null;
          strength?: number | null;
          model?: string | null;
          output_format?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          width?: number | null;
          height?: number | null;
          cfg_scale?: number | null;
          clip_guidance?: string | null;
          sampler?: string | null;
          samples?: number | null;
          seed?: number | null;
          steps?: number | null;
          style_preset?: string | null;
          extras?: string | null;
          aspect_ratio?: string | null;
          mode?: string | null;
          image?: string | null;
          strength?: number | null;
          model?: string | null;
          output_format?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "model_configs_model_id_fkey";
            columns: ["model_id"];
            referencedRelation: "models";
            referencedColumns: ["id"];
          }
        ];
      };
      prompts: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          prompt: string;
          negative_prompt: string | null;
          creation_date: string;
          update_date: string;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          prompt: string;
          negative_prompt?: string | null;
          creation_date?: string;
          update_date?: string;
          is_favorite: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          prompt?: string;
          negative_prompt?: string | null;
          creation_date?: string;
          update_date?: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      images: {
        Row: {
          id: string;
          prompt_id: string;
          image_url: string;
          size: string | null;
          metadata: Json;
          generation_date: string;
          model_id: string | null;
          config_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          prompt_id: string;
          image_url: string;
          size?: string | null;
          metadata: Json;
          generation_date?: string;
          model_id?: string | null;
          config_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          prompt_id?: string;
          image_url?: string;
          size?: string | null;
          metadata?: Json;
          generation_date?: string;
          model_id?: string | null;
          config_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "images_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          }
        ];
      };
      collections: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
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
  };
};

// Add type exports for easier use
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Model = Database["public"]["Tables"]["models"]["Row"];
export type ModelConfig = Database["public"]["Tables"]["model_configs"]["Row"];
export type Prompt = Database["public"]["Tables"]["prompts"]["Row"];
export type Image = Database["public"]["Tables"]["images"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];

