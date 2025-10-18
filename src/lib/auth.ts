import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin } from "better-auth/plugins";
// Re-export shared validation schemas for convenience
export { SignUpSchema, SignInSchema, PasswordResetSchema, PasswordResetRequestSchema, type SignUpInput, type SignInInput } from "./schemas/auth";

export const auth = betterAuth({
  // Secret used to sign cookies/tokens. Make sure BETTER_AUTH_SECRET is set in your env.
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: { enabled: true },
    update: { enabled: true },
  },
  emailAndPassword: {
    enabled: true,
    // Match client-side validation and Better Auth defaults
    minPasswordLength: 8,
    // Disable email verification requirement - Better Auth uses separate Verification table
    requireEmailVerification: false,
    // Optional: send password reset email (logs link for now)
    async sendResetPassword({ user, url /*, token*/ }) {
      // TODO: Integrate your email provider here
      console.log(`[BetterAuth] Password reset requested for ${user.email}. Link: ${url}`);
    },
  },
  // Email verification: disabled for now since we don't have User.emailVerified field
  emailVerification: {
    sendOnSignUp: false, // Don't send verification email on signup
    async sendVerificationEmail({ user, url /*, token*/ }) {
      // TODO: Integrate your email provider here
      console.log(`[BetterAuth] Verify email for ${user.email}. Link: ${url}`);
    },
    // autoSignInAfterVerification: true,
  },
  plugins: [admin()],
  // Add error hook to log server-side errors during sign-up/auth operations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: async (ctx: any) => {
    console.error("[BetterAuth] Error occurred:");
    console.error("  Path:", ctx.path);
    console.error("  Error:", ctx.error);
    console.error("  Stack:", ctx.error?.stack);
  },
});

// Server-only helpers moved to src/lib/server-auth.ts to avoid importing next/headers in client bundles.
