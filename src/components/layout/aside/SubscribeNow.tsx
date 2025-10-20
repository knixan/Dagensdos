"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface Props {
  onSubscribeClick?: () => void;
}

export default function SubscribeNow({ onSubscribeClick }: Props) {
  return (
    <section className="rounded-xl p-6 shadow bg-primary text-primary-foreground text-center">
      <h3 className="text-2xl font-bold mb-1">Vill du ha mer än en Dos?</h3>
      <p className="text-xs text-muted-foreground mb-3"></p>
      <p className="mb-4 text-sm md:text-base opacity-90">
        Lås upp de riktigt deprimerande nyheterna med premium.
      </p>
      <Button
        variant="secondary"
        onClick={onSubscribeClick}
        asChild={!onSubscribeClick}
        className="font-medium"
      >
        {onSubscribeClick ? (
          <span>Prenumerera Nu →</span>
        ) : (
          <Link href="/prenumeration">Prenumerera Nu →</Link>
        )}
      </Button>
    </section>
  );
}
