"use server";
// filepath: src/lib/actions/email-actions.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function resendVerificationEmail(email: string) {
  try {
    if (!email) {
      return {
        success: false,
        error: "Email krävs",
      };
    }

    // Hämta användare
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Användare hittades inte",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "E-postadressen är redan verifierad",
      };
    }

    // Låt Better Auth generera en signerad token och skicka mailet via
    // emailVerification.sendVerificationEmail-callbacken i auth.ts.
    await auth.api.sendVerificationEmail({ body: { email } });

    console.log("[ResendVerification] Email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[ResendVerification] Error:", error);
    return {
      success: false,
      error: "Kunde inte skicka verifieringsmail. Försök igen senare.",
    };
  }
}
