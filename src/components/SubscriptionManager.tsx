"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";

export default function SubscriptionManager(): React.ReactElement {
  const { data: session } = useSession();
  const email = session?.user?.email;

  return (
    <div className="bg-card p-6 rounded-lg shadow border border-border">
      <h2 className="text-lg font-semibold">
        Prenumeration HÅRDKODAD FRONTEND
      </h2>
      <p className="text-sm text-muted-foreground">
        {email
          ? `Hantera din prenumeration (${email}).`
          : "Logga in för att se och hantera din prenumeration."}
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
          onClick={() => {
            // Placeholder för prenumerationshanteringslogik
            window.alert("Öppna prenumerationsinställningar");
          }}
        >
          Hantera prenumeration
        </button>
      </div>
    </div>
  );
}
