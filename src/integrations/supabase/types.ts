export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      application_documents: {
        Row: {
          application_id: string
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string
          email: string
          estimated_annual_savings: number | null
          estimated_monthly_cost: number | null
          id: string
          monthly_turnover: number
          name: string
          partner_id: string
          partner_name: string
          phone: string
          source: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          estimated_annual_savings?: number | null
          estimated_monthly_cost?: number | null
          id?: string
          monthly_turnover: number
          name: string
          partner_id: string
          partner_name: string
          phone: string
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          estimated_annual_savings?: number | null
          estimated_monthly_cost?: number | null
          id?: string
          monthly_turnover?: number
          name?: string
          partner_id?: string
          partner_name?: string
          phone?: string
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string
          excerpt: string
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      callback_requests: {
        Row: {
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          monthly_turnover: number | null
          name: string
          notes: string | null
          partner_id: string
          partner_name: string
          phone: string
          preferred_time: string | null
          source: string | null
          status: Database["public"]["Enums"]["callback_status"]
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          monthly_turnover?: number | null
          name: string
          notes?: string | null
          partner_id: string
          partner_name: string
          phone: string
          preferred_time?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["callback_status"]
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          monthly_turnover?: number | null
          name?: string
          notes?: string | null
          partner_id?: string
          partner_name?: string
          phone?: string
          preferred_time?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["callback_status"]
          updated_at?: string
        }
        Relationships: []
      }
      priority_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          max_turnover: number
          min_turnover: number
          priority_score: number
          provider_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_turnover: number
          min_turnover: number
          priority_score?: number
          provider_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          max_turnover?: number
          min_turnover?: number
          priority_score?: number
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "priority_rules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_offers: {
        Row: {
          badge_text: string
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean
          max_turnover: number | null
          min_turnover: number | null
          priority: number
          provider_id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_text: string
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean
          max_turnover?: number | null
          min_turnover?: number | null
          priority?: number
          provider_id: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean
          max_turnover?: number | null
          min_turnover?: number | null
          priority?: number
          provider_id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_offers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          auto_renewal: boolean
          contract_length: string
          created_at: string
          device_info: Json | null
          display_order: number
          documents_required: Json | null
          early_termination_fee: string | null
          features: string[]
          fees: Json
          id: string
          is_active: boolean
          logo_url: string | null
          machine_models: string[]
          name: string
          settlement_time: string
          turnover_tiers: Json | null
          updated_at: string
        }
        Insert: {
          auto_renewal?: boolean
          contract_length: string
          created_at?: string
          device_info?: Json | null
          display_order?: number
          documents_required?: Json | null
          early_termination_fee?: string | null
          features?: string[]
          fees: Json
          id: string
          is_active?: boolean
          logo_url?: string | null
          machine_models: string[]
          name: string
          settlement_time: string
          turnover_tiers?: Json | null
          updated_at?: string
        }
        Update: {
          auto_renewal?: boolean
          contract_length?: string
          created_at?: string
          device_info?: Json | null
          display_order?: number
          documents_required?: Json | null
          early_termination_fee?: string | null
          features?: string[]
          fees?: Json
          id?: string
          is_active?: boolean
          logo_url?: string | null
          machine_models?: string[]
          name?: string
          settlement_time?: string
          turnover_tiers?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status:
        | "pending"
        | "documents_uploaded"
        | "under_review"
        | "approved"
        | "rejected"
        | "completed"
        | "contacted"
        | "converted"
      callback_status:
        | "pending"
        | "contacted"
        | "scheduled"
        | "completed"
        | "cancelled"
        | "converted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      application_status: [
        "pending",
        "documents_uploaded",
        "under_review",
        "approved",
        "rejected",
        "completed",
        "contacted",
        "converted",
      ],
      callback_status: [
        "pending",
        "contacted",
        "scheduled",
        "completed",
        "cancelled",
        "converted",
      ],
    },
  },
} as const
