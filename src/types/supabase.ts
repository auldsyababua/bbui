// Auto-generated types for brain_bot_documents table
export interface Database {
  public: {
    Tables: {
      brain_bot_documents: {
        Row: {
          id: string
          file_path: string
          title: string | null
          content: string
          content_hash: string
          metadata: Record<string, any>
          file_type: string | null
          category: string | null
          tags: string[]
          version: number
          previous_version_id: string | null
          is_public: boolean
          access_level: string
          created_by: string
          telegram_chat_id: number | null
          telegram_user_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['brain_bot_documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['brain_bot_documents']['Insert']>
      }
    }
  }
}

export type Document = Database['public']['Tables']['brain_bot_documents']['Row']
