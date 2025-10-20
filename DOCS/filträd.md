# Filträd för projektet

Detta dokument listar den begärda strukturen och en kort förklaring (på svenska) av vad varje fil/mapp gör.

news-gamma/

- prisma/

  - schema.prisma
    - Prisma-schema: innehåller datamodeller (User, Session, Account, Article, Category, m.fl.) och konfigurerar `provider = "postgresql"` samt `DATABASE_URL`.

- public/

  - Statisk mapp för filer som serveras som-is (bilder, favicon, manifest osv.). Innehållet levereras direkt av Next.js.

- src/

  - app/

    - actions/
      - Server- eller klientactions (t.ex. `cookieConsent`, `weather`) som används för att utföra logik utanför komponentrendering.
    - admin/
      - artiklar/
        - redigera/
          - Sida/formulär som låter admin redigera en befintlig artikel.
        - skapa/
          - Sida/formulär för att skapa en ny artikel.
        - ta-bort/
          - Sida/aktion som hanterar borttagning av en artikel.
        - AdminArticleSearch.tsx
          - React-komponent för att söka eller filtrera artiklar i adminpanelen.
        - page.tsx
          - Adminvy som listar artiklar och länkar till redigera/skapa/ta-bort.
      - kategorier/
        - redigera/
          - Sida/formulär för att redigera en kategori.
        - skapa/
          - Sida/formulär för att skapa en ny kategori.
        - ta-bort/
          - Sida/handling för att ta bort en kategori.
        - page.tsx
          - Adminvy som listar kategorier.
      - admin.tsx
        - Eventuell del- eller wrapperkomponent för adminfunktionalitet (layout eller helpers).
      - page.client.tsx
        - Client-only entry för admin (används när komponenten måste renderas i browsern).
      - page.tsx
        - Root-sida för `/admin` (översikt eller nav till undersektioner).
    - api/
      - admin/
        - API-endpoints för admin-åtgärder (skapa/uppdatera/radera artiklar/kategorier).
      - auth/
        - Better Auth-route: `src/app/api/auth/[...all]/route.ts` (catch-all som exponerar Better Auth handlers via `toNextJsHandler`).
      - user/
        - API för användarrelaterade operationer (profil, prenumerationer etc.).
      - weather/
        - API för att hämta/normalisera väderdata.
    - artiklar/
      - [slug]/
        - page.tsx
          - Dynamisk artkelsida som renderar innehåll baserat på `slug` (hämtar data via Prisma eller API).
    - category/
      - [categoryId]/
        - edit/
          - form.tsx
            - Formulärkomponent för att redigera en kategori (kan använda server actions eller API).
      - create/
        - form.tsx
          - Formulär för att skapa en ny kategori.
    - integritet-cookies/
      - page.tsx
        - Sida för att visa integritetspolicy och cookie-information.
    - kassa/
      - success/
        - Bekräftelsesida efter lyckad betalning.
      - page.tsx
        - Kassaflödet (checkout) och samband med prenumeration/ordrar.
    - kontakta-oss/
      - page.tsx
        - Kontaktformulär-sida, skickar e-post/via API.
    - logga-in/
      - page.tsx
        - Inloggningssida som använder Better Auth client för att sign-in.
    - mina-sidor/
      - page.tsx
        - Användarens personliga sida (profil, prenumerationer, mm.).
    - om-oss/
      - page.tsx
        - Om oss-sida.
    - prenumeration/
      - page.tsx
        - Sidan som visar prenumerationserbjudanden och köpflöde.
    - prenumerationsvillkor/
      - page.tsx
        - Visar villkor för prenumeration.
    - registrera/
      - page.tsx
        - Registreringssida (sign up) som anropar Better Auth client.
    - types/
      - weather-types.ts
        - Typer/Interfaces för väderdata som används i vädermodulen.
    - vader/
      - page.tsx
        - Sida som visar väderinformation.
    - favicon.ico
      - Webbplatsens favicon.
    - globals.css
      - Globala CSS-regler (Tailwind-setup och egna stilar).
    - layout.tsx
      - Global layoutkomponent som wrappas runt alla sidor (Navbar, Footer, Providers).
    - page.tsx
      - Hemsidans server-/clientkomponent.

  - components/

    - articles/
      - ArticleCard.tsx, ArticleHero.tsx, Section.tsx
        - Komponenter för att visa artiklar i listor och hero-sektioner.
    - Buttons/
      - back-button.tsx, delete-button.tsx, LinkButton.tsx, toggle-theme-button.tsx
        - Återanvändbara knappkomponenter.
    - Forms/
      - ContactForm.tsx, SettingsForm.tsx, SignInAndProfile.tsx, SignUpForm.tsx
        - Formulär för kontakt, inställningar och auth.
    - layout/
      - aside.tsx, Footer.tsx, main.tsx, Navbar.tsx
        - Layout-delar som används över sidorna.
    - subscription/
      - SubscriptionManager.tsx
        - Hanterar prenumerationer på klienten.
    - ui/
      - button.tsx, card.tsx, drawer.tsx, dropdown-menu.tsx, form.tsx, input.tsx, label.tsx, separator.tsx, sonner.tsx
        - UI-atomer / design-system-komponenter.
    - ClientOnly.tsx
      - Wrapper som endast renderar barn i klienten (ingen SSR).
    - cookie-consent.tsx
      - Cookie-banner och logik för samtycke.
    - SubscriptionManager.tsx
      - Klientkomponent för att hantera prenumerationstillstånd.
    - theme-provider.tsx
      - Hanterar tema (dark/light) och provider logik.
    - weather-client.tsx
      - Klientkomponent för väderintegration.
    - weather-comments.tsx
      - Kommentarsmodul kopplat till väderdata.

  - generated/

    - prisma/
      - Genererad Prisma Client och runtimefiler (används av `src/lib/prisma.ts`).

  - lib/

    - articles.ts
      - Hjälpfunktioner/serverlogik för att hämta och transformera artikeldata via Prisma.
    - auth-client.ts
      - Skapar och exporterar Better Auth React-client (`createAuthClient`) för UI.
    - auth.ts
      - Konfigurerar Better Auth serverinstans (`betterAuth({...})`) med `prismaAdapter` och plugins (t.ex. admin).
    - prisma.ts
      - Exporterar en enkel prisma-client singleton för serverkod.
    - server-auth.ts
      - Serverhjälpare som `getSession()`, `requireUser()`, `requireAdmin()` som använder `auth.api.getSession()` och `next/redirect`.
    - utils.ts
      - Diverse hjälpfunktioner och små utilites.
    - zod-schemas.ts
      - Zod-schema för validering av request bodies och formulärdata.
    - schemas/
      - auth.ts
        - Zod-scheman specifikt för auth (sign-up, sign-in, password reset).

  - types/
    - shims-externals.d.ts
      - Type-deklarationer för externa imports eller globala shim-objekt.

- TEXTDOKUMENT-FÖRKLARINGAR/

  - better-auth.txt
    - Dokumentation och förklaringar kring Better Auth-implementeringen i projektet.

- LLMS/
  - better-auth-llms.txt
    - Långa anteckningar/LLM-promptmaterial relaterat till auth eller Next.js.

-- Slut på trädet --

Vill du att jag också:

- skriver ut den faktiska filstrukturen (alla filer under varje mapp), eller
- committar denna fil och skapar en PR med den?
