"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultEmail?: string;
};

export default function ResendVerificationEmail({ defaultEmail = "" }: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [isSending, setIsSending] = useState(false);

  async function handleResend() {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Ange din e-postadress");
      return;
    }

    setIsSending(true);
    try {
      const { resendVerificationEmail } =
        await import("@/lib/actions/email-actions");
      const result = await resendVerificationEmail(trimmed);

      if (result.success) {
        toast.success("Verifieringsmail skickat!", {
          description: `Ett nytt mail har skickats till ${trimmed}`,
          duration: 5000,
        });
      } else {
        toast.error(result.error || "Kunde inte skicka mail");
      }
    } catch (error) {
      console.error("[ResendEmail] Error:", error);
      toast.error("Ett oväntat fel uppstod");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Fick du inget verifieringsmail?</p>
        <p className="text-sm text-muted-foreground">
          Ange din e-postadress för att få ett nytt verifieringsmail.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label htmlFor="resend-email" className="sr-only">
            E-postadress
          </Label>
          <Input
            id="resend-email"
            type="email"
            placeholder="din@email.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSending}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={isSending}
        >
          {isSending ? "Skickar..." : "Skicka verifieringsmail"}
        </Button>
      </div>
    </div>
  );
}
