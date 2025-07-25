import { AccessControlProvider } from "@refinedev/core";
import { supabaseClient } from "../utils/supabaseClient";

type Role = 'admin' | 'user' | 'viewer';

// Define permissions matrix
const permissions: Record<Role, {
  resources: Record<string, string[]>;
}> = {
  admin: {
    resources: {
      brain_bot_documents: ['list', 'show', 'create', 'edit', 'delete'],
      personnel: ['list', 'show', 'create', 'edit', 'delete'],
      admin: ['list', 'show', 'create', 'edit', 'delete'],
    },
  },
  user: {
    resources: {
      brain_bot_documents: ['list', 'show'],
      personnel: [],
      admin: [],
    },
  },
  viewer: {
    resources: {
      brain_bot_documents: ['list', 'show'],
      personnel: [],
      admin: [],
    },
  },
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return { can: false };
    }

    // Get user role
    const { data: personnel } = await supabaseClient
      .from('personnel')
      .select('app_role')
      .eq('auth_user_id', user.id)
      .single();

    const role = (personnel?.app_role || 'viewer') as Role;
    const rolePermissions = permissions[role];
    
    if (!rolePermissions) {
      return { can: false };
    }

    const resourcePermissions = resource ? (rolePermissions.resources[resource] || []) : [];
    const can = resourcePermissions.includes(action);

    return { can };
  },
};