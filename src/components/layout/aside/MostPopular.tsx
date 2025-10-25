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

export default function MostPopular({ popular = [] }: Props) {
  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-1 border-b pb-1">Mest Populärt</h3>
      {/* Now driven by props from a server wrapper. */}
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
