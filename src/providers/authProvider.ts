import { AuthProvider } from "@refinedev/core";

// No-op auth provider - everyone has full access
export const authProvider: AuthProvider = {
  login: async () => ({ success: true }),
  logout: async () => ({ success: true }),
  check: async () => ({ authenticated: true }),
  getPermissions: async () => 'admin',
  getIdentity: async () => ({
    id: 'local-user',
    name: 'Local User',
    email: 'local@example.com',
    role: 'admin',
  }),
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
