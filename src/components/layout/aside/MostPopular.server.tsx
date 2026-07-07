import React from "react";
import { prisma } from "@/lib/prisma";
import MostPopular from "./MostPopular";

export default async function MostPopularServer() {
  // Fetch latest 3 articles (or the ones you consider "popular").
  const db = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, headline: true, category: { select: { name: true } } },
  });

  const popular = db.map((a) => ({
    title: a.headline ?? "Untitled",
    category: a.category?.name,
    href: `/artiklar/${(a.headline || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50)}-${String(a.id).slice(0, 6)}`,
  }));

  return <MostPopular popular={popular} />;
}
