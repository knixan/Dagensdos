"use client";

import Link from "next/link";
import * as React from "react";

interface PopularItem {
  title: string;
  href?: string;
}

interface Props {
  popular?: PopularItem[];
}

export default function MostPopular({
  popular = [
    { title: "Den genomsnittliga livslängden på ett Twitter‑utbrott." },
    { title: "Hur man ignorerar notiser och ändå får ångest." },
    { title: "Politikern som sa det du ville höra (och gjorde tvärtom)." },
  ],
}: Props) {
  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-1 border-b pb-1">Mest Populärt</h3>
      <p className="text-xs text-muted-foreground mb-3">
        (Hårdkodad frontend, ta bort denna text när du gjort klart.)
      </p>
      <ul className="space-y-4">
        {popular.map((item, i) => {
          const numberColor =
            i === 0 ? "text-primary" : "text-muted-foreground";
          const borderColor = i === 0 ? "border-primary/60" : "border-muted";
          const content = (
            <>
              <span className={`font-bold mr-2 ${numberColor}`}>{i + 1}.</span>
              {item.title}
            </>
          );
          return (
            <li
              key={item.title}
              className={`text-sm md:text-base leading-snug cursor-pointer border-l-4 ${borderColor} pl-3 hover:text-primary transition-colors`}
            >
              {item.href ? (
                <Link href={item.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
