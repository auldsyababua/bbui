import { AuthProvider } from "@refinedev/core";
import { supabaseClient } from "../utils/supabaseClient";
import { logger } from "../utils/logger";

export const authProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    const startTime = performance.now();
    logger.action('login.attempt', { providerName: providerName || 'email' });
    
    // Handle OAuth providers
    if (providerName) {
      logger.info(`Attempting OAuth login with ${providerName}`);
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        logger.error('OAuth login failed', { provider: providerName, error: error.message });
        logger.api('POST', '/auth/oauth', 400, performance.now() - startTime);
        return {
          success: false,
          error,
        };
      }
      
      logger.info('OAuth login initiated successfully', { provider: providerName });
      logger.api('POST', '/auth/oauth', 200, performance.now() - startTime);
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
      logger.error('Email/password login failed', { email, error: error.message });
      logger.api('POST', '/auth/login', 401, performance.now() - startTime);
      return {
        success: false,
        error,
      };
    }

    if (data?.user) {
      logger.info('Login successful', { userId: data.user.id, email: data.user.email });
      logger.setContext({ userId: data.user.id });
      logger.api('POST', '/auth/login', 200, performance.now() - startTime);
      logger.metric('auth.login.success', 1, { method: 'email' });
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