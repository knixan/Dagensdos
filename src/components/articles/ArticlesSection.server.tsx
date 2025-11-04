import React from "react";
import { prisma } from "@/lib/prisma";
import type { Article as LocalArticle } from "@/lib/articles";
import type { Prisma } from "@/generated/prisma";
import Section from "@/components/articles/Section";
import ArticleHero from "@/components/articles/ArticleHero";
import ArticleCard from "@/components/articles/ArticleCard";

// Server component that fetches articles and renders the hero + cards
export default async function ArticlesSection() {
  // Use createdAt and image_url per Prisma schema. Slug is not stored in DB,
  // so derive a URL-safe slug from the headline and append a short id.
  type ArticleWithCategory = Prisma.ArticleGetPayload<{
    include: { category: true };
  }>;

  const dbArticles: ArticleWithCategory[] = await prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const slugify = (s: string, id: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) +
    "-" +
    id.slice(0, 6);

  const articles: LocalArticle[] = dbArticles.map((a) => ({
    id: String(a.id),
    slug: a.headline ? slugify(a.headline, String(a.id)) : String(a.id),
    title: a.headline ?? "",
    excerpt: a.summary ?? "",
    content: a.content ?? "",
    // category is a single object, not an array
    category: a.category?.name ?? "",
    image:
      a.image_url &&
      (a.image_url.startsWith("http") || a.image_url.startsWith("/"))
        ? a.image_url
        : undefined,
    date: a.createdAt
      ? new Date(a.createdAt).toISOString().slice(0, 10)
      : undefined,
    premium: (a as unknown as { premium?: boolean }).premium ?? false,
  }));

  const [hero, ...rest] = articles;

  return (
    <Section title="Artiklar">
      {hero && <ArticleHero article={hero} />}
      <div className="mt-6 grid  grid-cols-1 md:grid-cols-3 gap-4">
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </Section>
  );
}
