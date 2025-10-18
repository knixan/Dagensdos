import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, Article } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Aside } from '@/components/layout/aside';

type Props = {
  params: { slug: string };
};

export default async function ArticlePage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const article: Article | null = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

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

                <h1 className="mt-4 text-3xl font-extrabold">{article!.title}</h1>
                <p className="text-sm text-muted-foreground mb-6">{article!.date} • {article!.category}</p>

                {article!.image && (
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                    <Image src={article!.image} alt={article!.title} fill className="object-cover" />
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
