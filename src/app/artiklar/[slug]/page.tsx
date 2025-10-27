import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { slug: string };
};

export default async function ArticlePage({
  params,
}: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  
  // Extract the ID from the slug (last part after final dash)
  const idMatch = slug.match(/-([a-z0-9]+)$/);
  const articleId = idMatch ? idMatch[1] : null;

  if (!articleId) {
    notFound();
  }

  // Find article by ID prefix (since we only store first 6 chars in slug)
  const dbArticle = await prisma.article.findFirst({
    where: {
      id: {
        startsWith: articleId,
      },
    },
    include: { category: true },
  });

  if (!dbArticle) {
    notFound();
  }

  // Map to local Article type
  const article: Article = {
    id: String(dbArticle.id),
    slug: slug,
    title: dbArticle.headline ?? "",
    excerpt: dbArticle.summary ?? "",
    content: dbArticle.content ?? "",
    category: dbArticle.category.map((c) => c.name).join(", "),
    image: dbArticle.image_url && (dbArticle.image_url.startsWith('http') || dbArticle.image_url.startsWith('/'))
      ? dbArticle.image_url
      : undefined,
    date: dbArticle.createdAt ? new Date(dbArticle.createdAt).toISOString().slice(0, 10) : undefined,
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <article className="prose prose-invert dark:prose-invert">
                <Link href="/" className="text-sm text-primary hover:underline">
                  ← Tillbaka
                </Link>

                <h1 className="mt-4 text-3xl font-extrabold">
                  {article!.title}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {article!.date} • {article!.category}
                </p>

                {article!.image && (
                  <div className="w-full mb-6 rounded-lg bg-gray-900 flex justify-center">
                    <Image
                      src={article!.image}
                      alt={article!.title}
                      width={800}
                      height={500}
                      className="object-center"
                    />
                  </div>
                )}

                <div className="text-base text-foreground leading-7 prose prose-invert dark:prose-invert">
                  {article!.content.split(/\n\s*\n/).map((para, idx) => {
                    const lines = para.split(/\n/);
                    return (
                      <p key={idx} className="mb-4">
                        {lines.map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < lines.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <Link href="/" className="text-primary hover:underline">
                    Tillbaka till startsidan
                  </Link>
                </div>
              </article>
            </div>

            <Aside />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
