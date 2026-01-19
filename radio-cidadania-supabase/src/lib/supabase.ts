import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      news: {
        Row: {
          id: number;
          title: string;
          content: string;
          category: 'destaque' | 'eventos' | 'radio' | 'saude' | 'educacao' | 'esportes';
          image_url: string | null;
          author: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['news']['Insert']>;
      };
      programs: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          host: string;
          host_photo: string | null;
          day_of_week: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
          start_time: string;
          end_time: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['programs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };
      contacts: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };
      advertisements: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          image_url: string | null;
          link_url: string | null;
          position: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['advertisements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['advertisements']['Insert']>;
      };
      settings: {
        Row: {
          id: number;
          key: string;
          value: string | null;
          description: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
};
