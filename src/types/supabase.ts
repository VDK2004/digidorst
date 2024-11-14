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
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: 'BEER' | 'WINE' | 'COCKTAIL' | 'SOFT_DRINK'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: 'BEER' | 'WINE' | 'COCKTAIL' | 'SOFT_DRINK'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: 'BEER' | 'WINE' | 'COCKTAIL' | 'SOFT_DRINK'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          table_id: string
          status: 'PENDING' | 'PREPARING' | 'READY' | 'PAID'
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          table_id: string
          status?: 'PENDING' | 'PREPARING' | 'READY' | 'PAID'
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          table_id?: string
          status?: 'PENDING' | 'PREPARING' | 'READY' | 'PAID'
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          number: number
          status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: number
          status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: number
          status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}