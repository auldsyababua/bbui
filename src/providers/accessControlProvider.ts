import { AccessControlProvider } from "@refinedev/core";

// No-op access control - everyone has full access
export const accessControlProvider: AccessControlProvider = {
  can: async () => ({ can: true }),
};
