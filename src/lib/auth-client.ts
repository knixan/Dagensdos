import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // If your auth server runs on the same domain you can omit baseURL.
  // baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});

// Re-export common helpers that UI code may import directly
export const { signIn, signUp, useSession } = authClient;

export default authClient;
