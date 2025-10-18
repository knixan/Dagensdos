import React from "react";
// ...existing code... (Link and Image are used inside the new components)
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Aside } from "@/components/layout/aside";
import { ArticleHero } from "@/components/articles/ArticleHero";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Section } from "@/components/articles/Section";
import type { Article } from "@/lib/articles";
import { articles } from "@/lib/articles";

//import { CookieSonner } from "./actions";


export default function HomePage(): React.ReactElement {
  const main: Article = articles[0];
  const editors: Article[] = articles.slice(1, 3);

  return (
    <>

      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <ArticleHero article={main} />

              <Section title="Redaktörens Val">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editors.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </Section>
            </div>

            <Aside />
          </div>
        </div>
      </main>

      <Footer />

    </>
  );
}