import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

export function useRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          return;
        }

        const { data: userRoles } = await supabase
          .from('user_roles')
          .select(`
            role:roles (
              id,
              name,
              description,
              permissions
            )
          `)
          .eq('user_id', user.id)
          .single();

        setRole(userRoles?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  return { role, loading };
}