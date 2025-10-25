import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Section from "@/components/articles/Section";
import type { Article as LocalArticle } from "@/lib/articles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";

export default async function ArticlesIndexPage() {
  type ArticleWithCategory = Prisma.ArticleGetPayload<{ include: { category: true } }>;

  const dbArticles: ArticleWithCategory[] = await prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const slugify = (s: string, id: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) + "-" + id.slice(0, 6);

  const articles: LocalArticle[] = dbArticles.map((a) => ({
    id: String(a.id),
    slug: a.headline ? slugify(a.headline, String(a.id)) : String(a.id),
    title: a.headline ?? "",
    excerpt: a.summary ?? "",
    content: a.content ?? "",
    category: a.category.map((c) => c.name).join(", "),
    image: a.image_url ?? undefined,
    date: a.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : undefined,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <Section title="Alla artiklar">
                <div className="space-y-6">
                  {articles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow transition"
                    >
                      <h3 className="text-xl font-bold mb-1">
                        <Link href={`/artiklar/${article.slug}`} className="hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                      <Link href={`/artiklar/${article.slug}`} className="text-primary text-sm">
                        Läs hela artikeln →
                      </Link>
                    </article>
                  ))}
                </div>
              </Section>
            </div>
            <aside>
              <Aside />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
