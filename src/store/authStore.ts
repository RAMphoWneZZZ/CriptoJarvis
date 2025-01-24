import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  theme: 'light' | 'dark';
  preferences: Record<string, any>;
}

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: data.user,
          profile,
          token: data.session?.access_token || null,
          isAuthenticated: true
        });
      },

      register: async (userData) => {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name
            }
          }
        });

        if (error) throw error;

        // El perfil se crea automáticamente mediante el trigger
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        set({
          user: data.user,
          profile,
          token: data.session?.access_token || null,
          isAuthenticated: true
        });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          profile: null,
          token: null,
          isAuthenticated: false
        });
      },

      updateProfile: async (updates) => {
        const state = get();
        if (!state.user?.id) throw new Error('Usuario no autenticado');

        const { data: profile, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', state.user.id)
          .select()
          .single();

        if (error) throw error;

        set({ profile });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);