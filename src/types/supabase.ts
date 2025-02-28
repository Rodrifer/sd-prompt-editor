// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          registration_date: string
          last_login: string | null
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          registration_date?: string
          last_login?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          registration_date?: string
          last_login?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          creation_date: string
          update_date: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          creation_date?: string
          update_date?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          creation_date?: string
          update_date?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Add other tables similarly...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

// Add type exports for easier use
export type Project = Database['public']['Tables']['projects']['Row'];
export type User = Database['public']['Tables']['users']['Row'];