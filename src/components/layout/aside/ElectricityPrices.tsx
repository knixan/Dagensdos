"use client";

import Link from "next/link";
import * as React from "react";

export default function ElectricityPrices() {
  return (
    <section className="rounded-xl p-6 text-center shadow bg-muted">
      <h3 className="text-lg font-bold mb-1 text-foreground">Annons</h3>
      <p className="text-xs text-muted-foreground mb-2"></p>
      <p className="text-sm text-muted-foreground">
        Få dina elpriser direkt i inboxen. Som om det hjälpte.
      </p>
      <Link
        href="/el"
        className="text-sm font-medium text-primary hover:underline mt-2 inline-block"
      >
        Visa Elpriser (API)
      </Link>
    </section>
  );
}
