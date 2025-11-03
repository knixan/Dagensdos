import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Om oss</h1>

            <p className="text-muted-foreground mb-4">
              Vi är ett team som under vår utbildning på Lexicon har utvecklat
              denna nyhetsplattform som ett projektarbete. Målet har varit att
              bygga en modern, modulär och skalbar applikation med fokus på
              användarvänlighet, innehållshantering och säkra arbetsflöden för
              redaktörer och administratörer.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">
              Huvudfunktioner
            </h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>
                Fullständig artikelhantering (CRUD) med SEO-vänliga slug-sidor.
              </li>
              <li>
                Kategorihantering och möjlighet att koppla kategorier till
                navigeringen.
              </li>
              <li>
                Admin-portal för Artiklar, Kategorier och Användare (endast
                adminåtkomst).
              </li>
              <li>
                AI-stöd för artikelskapande (MDX-stöd) och återanvändbara
                artikelkomponenter.
              </li>
              <li>
                Visning av topp 3 populära artiklar samt flexibla
                sidkomponenter.
              </li>
              <li>Väderintegration och prenumerationsflöden med Stripe.</li>
              <li>
                Sidor för Prenumerationsvillkor, Integritet & Cookies och Om
                oss.
              </li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">
              Teknik & arkitektur
            </h2>
            <p className="text-muted-foreground mb-4">
              Lösningen använder Prisma för datamodellering, Zod för schema- och
              formulärvalidering, react-hook-form för formulärhantering samt MDX
              för rikare artikelinnehåll. Rollbaserad åtkomstkontroll är
              implementerad på serversidan så att endast administratörer kan nå
              admin-ytorna.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">
              Team och ansvar
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-base font-medium text-foreground">Magui</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Prenumerationsflöden och statistik</li>
                  <li>Prisma-databasen (schema & queries)</li>
                  <li>Stripe-integration för betalningar</li>
                  <li>CRUD för artiklar och kategorier</li>
                  <li>Implementering av cookie-banner</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground">Johan</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>
                    Nodemailer-integration för e-post (validering &
                    notifieringar)
                  </li>
                  <li>Implementering av autentisering & e-postverifiering</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground">
                  Josefine
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>
                    BetterAuth-implementation: registrering, inloggning,
                    utloggning och admin-åtkomst
                  </li>
                  <li>UX / UI-design och logotyp</li>
                  <li>Zod-scheman för BetterAuth och formulärvalidering</li>
                  <li>Hantera användare och admin-sidor</li>
                  <li>Slug-sidor för artiklar och kategorier</li>
                  <li>
                    Återanvändbara komponenter för artiklar och
                    artikel-listning/detaljsida
                  </li>
                  <li>Väder-API-integration</li>
                  <li>Topp 3 populära artiklar och artikelkomponenter</li>
                  <li>Prisma DB - modellering och queries för artiklar</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground">Ahmed</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>EL API-utveckling</li>
                  <li>AI-genererade artiklar med Geminai</li>
                  <li>MDX-integration för rikt innehåll i artiklar</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
