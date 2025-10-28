import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import ArticlesSection from "@/components/articles/ArticlesSection.server";
import { prisma } from "@/lib/prisma";

export default async function HomePage(): Promise<React.ReactElement> {
  const popularArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, headline: true },
  });

  const popularItems = popularArticles.map((article) => ({
    title: article.headline ?? "Untitled",
    href: `/artiklar/${(article.headline || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50)}-${String(article.id).slice(0, 6)}`,
  }));

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <ArticlesSection />
            </div>

            <Aside popularItems={popularItems} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
