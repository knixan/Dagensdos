import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin } from "better-auth/plugins";
// Re-export shared validation schemas for convenience
export { SignUpSchema, SignInSchema, PasswordResetSchema, PasswordResetRequestSchema, type SignUpInput, type SignInInput } from "./schemas/auth";

export const auth = betterAuth({
  // Hemlig nyckel för att signera tokens och annan känslig data
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: { enabled: true },
    // Removed invalid 'update' option
  },
  emailAndPassword: {
    enabled: true,
    // matchande med klientens valideringsregler
    minPasswordLength: 8,
    // Avaktivera e-postverifiering för nuvarande användare eftersom vi inte har User.emailVerified-fältet
    requireEmailVerification: false,
    // optimalt
    async sendResetPassword({ user, url /*, token*/ }) {
      // TODO: Integrate your email provider here
      console.log(`[BetterAuth] Password reset requested for ${user.email}. Link: ${url}`);
    },
  },
  // E-post verifiering inaktiverad för nuvarande användare
  emailVerification: {
    sendOnSignUp: false, // Don't send verification email on signup
    async sendVerificationEmail({ user, url /*, token*/ }) {
      // TODO: Integrate your email provider here
      console.log(`[BetterAuth] Verify email for ${user.email}. Link: ${url}`);
    },
    // autoSignInAfterVerification: true,
  },
  plugins: [admin()],
 //Felrapportering för att underlätta felsökning under utveckling
  onError: async (ctx: BetterAuthErrorContext) => {
    console.error("[BetterAuth] Error occurred:");
    console.error("  Path:", ctx.path);
    console.error("  Error:", ctx.error);
    console.error("  Stack:", ctx.error?.stack);
  },
});

// Server-only helpers moved to src/lib/server-auth.ts to avoid importing next/headers in client bundles.

type BetterAuthErrorContext = {
  path: string;
  error: Error;
 
};
