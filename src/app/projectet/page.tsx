import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-3xl font-extrabold text-foreground mb-4">
              Om Projectet
            </h1>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              Vi är ett studentteam som byggt denna nyhetsplattform som ett
              projektarbete. Målet har varit att skapa en modern, modulär och
              skalbar applikation med fokus på användarvänlighet, innehållsflöde
              för redaktörer och säkra arbetsflöden för administratörer.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground mt-2 mb-2">
                  Vad sidan gör
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Artikelhantering (skapa, redigera, ta bort, visa).</li>
                  <li>Kategorier och navigation som kan styras från admin.</li>
                  <li>
                    Kommentarer, användarprofiler och rollbaserad åtkomst.
                  </li>
                  <li>Prenumerationer och betalflöde via Stripe.</li>
                  <li>
                    AI-stöd för att hjälpa till med artikelskapande och
                    MDX-innehåll.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mt-2 mb-2">
                  Teknikstack
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Next.js (App Router) + React 19 + TypeScript</li>
                  <li>Tailwind CSS (PostCSS) för styling</li>
                  <li>Prisma + PostgreSQL för datalagring</li>
                  <li>Better Auth för autentisering (Prisma-adapter)</li>
                  <li>Stripe för prenumerationer</li>
                </ul>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Viktiga filer
            </h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>
                <code>prisma/schema.prisma</code> — datamodeller och datasource
                (Postgres).
              </li>
              <li>
                <code>src/lib/prisma.ts</code> — Prisma Client-instans.
              </li>
              <li>
                <code>src/lib/auth.ts</code> &{" "}
                <code>src/lib/auth-client.ts</code> — Better Auth server/klient.
              </li>
              <li>
                <code>src/app/</code> — sidor och API-routes (App Router).
              </li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Miljövariabler (exempel)
            </h2>
            <div className="bg-muted p-3 rounded text-sm text-muted-foreground">
              <pre className="whitespace-pre-wrap">
                DATABASE_URL=&quot;postgresql://user:pass@localhost:5432/news-gamma&quot;
                BETTER_AUTH_SECRET=&quot;en-lång-hemlig-sträng&quot;
                STRIPE_SECRET_KEY=&quot;sk_test_...&quot;
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=&quot;pk_test_...&quot;
              </pre>
            </div>

            <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Köra lokalt
            </h2>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
              <li>npm install</li>
              <li>npx prisma generate</li>
              <li>npx prisma migrate dev --name init</li>
              <li>npm run dev</li>
            </ol>

            <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Team
            </h2>
            <p className="text-muted-foreground mb-4">
              Projektet är utvecklat av Magui, Johan, Josefine och Ahmed som del
              av en kurs på Lexicon i Linköping.
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href="/"
                className="inline-block px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-95"
              >
                Till startsidan
              </Link>
              <Link
                href="/kontakta-oss"
                className="inline-block px-4 py-2 rounded border border-border text-foreground hover:bg-accent"
              >
                Kontakta oss
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
