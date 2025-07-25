import { AuthProvider } from "@refinedev/core";
import { supabaseClient } from "../utils/supabaseClient";

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    // Handle OAuth providers
    if (providerName) {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        return {
          success: false,
          error,
        };
      }
      
      return {
        success: true,
      };
    }
    
    // Handle email/password login
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.user) {
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid email or password",
      },
    };
  },
  
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  
  check: async () => {
    const { data } = await supabaseClient.auth.getSession();
    const { session } = data;

    if (session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  
  getPermissions: async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return null;

    // Get user role from personnel
    const { data: personnel } = await supabaseClient
      .from('personnel')
      .select('app_role')
      .eq('auth_user_id', user.id)
      .single();

    return personnel?.app_role || 'viewer';
  },
  
  getIdentity: async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return null;

    // Get full personnel record
    const { data: personnel } = await supabaseClient
      .from('personnel')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    return {
      id: user.id,
      name: personnel ? `${personnel.first_name} ${personnel.last_name}`.trim() : user.email,
      email: user.email,
      role: personnel?.app_role || 'viewer',
    };
  },
  
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};