export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          role: string
          subscription_status: string
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          subscription_status?: string
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          subscription_status?: string
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
        }
      }
    }
  }
}