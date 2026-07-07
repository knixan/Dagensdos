"use client";

import Link from "next/link";
import * as React from "react";

interface PopularItem {
  title: string;
  category?: string;
  href?: string;
}

interface Props {
  popular?: PopularItem[];
}

export default function MostPopular({ popular }: Props) {
  // If no popular items are provided, render nothing
  if (!popular || popular.length === 0) return null;

  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-1 border-b pb-1">Mest Populärt</h3>
      <ul className="space-y-4">
        
        {popular.map((item, i) => {
          const numberColor =
            i === 0 ? "text-primary" : "text-card-foreground";
          const borderColor = i === 0 ? "border-secondary" : "border-muted";
          const content = (
            <>
                {item.category && (
                <span className="block text-xs font-semibold text-accent-foreground uppercase mt-0.5">
                  {item.category}
                </span>
              )}
              <span className={`font-bold mr-2 ${numberColor}`}>{i + 1}.</span>
              <span className="text-primary">{item.title}</span>
          
            </>
          );
          return (
            <li
              // Use a key that is unique for this list entry. Titles may be duplicated
              // (which caused the console warning), so append the index as a simple
              // fallback. Prefer a stable unique id if available from the data.
              key={`${item.title}-${i}`}
              className={`text-sm md:text-base leading-snug cursor-pointer border-l-4 ${borderColor} pl-3 transition-colors`}
            >
              {item.href ? (
                <Link href={item.href} className="block hover:underline">
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
