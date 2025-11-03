"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function SubscribeNow() {
  const handleSubscribeClick = () => {
    // Handle subscription logic here
    console.log("Subscribe clicked");
    // You can add toast notifications, modal opening, etc.
  };

  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-4">Prenumerera</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Få de senaste nyheterna direkt i din inkorg.
      </p>
      <Button onClick={handleSubscribeClick} className="w-full">
        Prenumerera Nu
      </Button>
    </section>
  );
}
