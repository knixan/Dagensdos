# Dagens Dos

<p align="center">
  <img src="./public/mockup-dagensdos.jpg" alt="Mockup - Dagens Dos" width="700">
</p>

En modern nyhetsapplikation byggd med **Next.js (App Router)** och **TypeScript**.
Projektet är utvecklat som ett grupparbete av **Josefine, Johan, Magui och Ahmed** på **Lexicon i Linköping**.

---

## Innehållsförteckning

- [Översikt](#översikt)
- [Teknikstack](#teknikstack)
- [Teammedlemmar och bidrag](#teammedlemmar-och-bidrag)
- [Förutsättningar](#förutsättningar)
- [Installation](#installation)
- [Miljövariabler](#miljövariabler)
- [Utveckling](#utveckling)
- [Projektstruktur](#projektstruktur)
- [Arkitektur](#arkitektur)
- [Funktionalitet](#funktionalitet)
- [Distribution](#distribution)
- [Felsökning](#felsökning)
- [Kontakt](#kontakt)

---

## Översikt

**Dagens Dos** är en fullstack-nyhetsapplikation med fokus på **prestanda**, **typsäkerhet** och **skalbarhet**.
Projektet demonstrerar moderna webbutvecklingstekniker med **server-first arkitektur**, **AI-integration** och **användarhantering**.

### Huvudfunktioner

- Responsiv design med dark/light mode
- Säker autentisering med e-postverifiering
- Rollbaserad åtkomstkontroll (Admin, Editor, User)
- Prenumerationssystem med Stripe
- AI-assisterad artikelgenerering
- CRUD-funktionalitet för artiklar och kategorier
- Dashboard med statistik och visualiseringar
- Extern API-integration (elpriser, väderdata)

<p align="center">
  <img src="./public/screenshot-dark.png" alt="Dark mode" width="48%">
  <img src="./public/screenshot-light.png" alt="Light mode" width="48%">
</p>

---

## Teknikstack

### Frontend

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript 6**
- **Tailwind CSS 4**
- **Radix UI**, **Embla Carousel**, **Lucide React**
- **next-themes** (dark/light mode)

### Backend & databas

- **Prisma 6** (PostgreSQL)
- **Better Auth**
- **Server Actions** (Next.js)
- **Nodemailer**
- **Zod**

### Betalningar & AI

- **Stripe**
- **Better Auth Stripe-plugin**
- **AI SDK (Vercel)**, **Google AI SDK (Gemini)**
- **MDXEditor**

### Externa API:er

- **Spotprices API** – elpriser SE1–SE4
- **SMHI API** – väderdata

---

## Teammedlemmar och bidrag

### Magui – Backend & betalningar

- CRUD för artiklar och kategorier
- Stripe-integration
- Dashboard-visualiseringar
- Rollbaserad åtkomstkontroll
- Cookie-banner (GDPR)

### Ahmed – AI & API

- Elpris-API med visualisering
- Gemini AI-integration
- Google Search-koppling
- MDX-editor
- Zod-validering

### Johan – E-post & verifiering

- E-postverifiering (Better Auth + Nodemailer)
- Kontaktformulär och mallar
- SMTP-konfiguration

### Josefine – UX/UI & autentisering

- Design, logotyp, UX-flöden
- Better Auth-integration
- Rollhantering (Admin/Editor/User)
- Sökfunktion och SEO-sluggar
- Artikelrenderingskomponenter
- Projektledning

---

## Förutsättningar

- Node.js 18+
- npm, pnpm eller yarn
- PostgreSQL
- Stripe-konto
- (Valfritt) Google AI API-nyckel

---

## Installation

```bash
# 1. Klona repo
git clone https://github.com/Gr-25-13/news-gamma.git
cd news-gamma

# 2. Installera beroenden
npm install

# 3. Skapa miljöfil
cp example.env .env

# 4. Generera Prisma Client
npx prisma generate

# 5. Skapa/synka databasschema
npx prisma db push

# 6. Starta utvecklingsserver
npm run dev
```

---

## Miljövariabler

Skapa en `.env`-fil i projektets rot. Inkludera aldrig denna fil i versionshantering.

### Nödvändiga variabler

```env
# Databas
DATABASE_URL="postgresql://postgres:password@localhost:5432/news-gamma"

# Autentisering
BETTER_AUTH_SECRET="en-lång-slumpmässig-och-hemlig-sträng"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# E-post (Nodemailer)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="smtp-user@example.com"
EMAIL_PASS="smtp-password"

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

**Obs:** För produktion, använd plattformens säkra environment variable storage.

---

## Utveckling

### Tillgängliga skript

```bash
npm run dev      # Starta utvecklingsserver
npm run build    # Bygg för produktion
npm start        # Starta produktionsserver
npm run lint     # Kör ESLint
```

### Snabbtest

- Besök `http://localhost:3000/` för startsidan
- Registrera en användare via `/registrera`
- Logga in via `/logga-in`
- Kontrollera databastabellerna efter migrering
- Verifiera prenumerationsflödet i Stripe testläge

---

## Projektstruktur

```
news-gamma/
├── prisma/
│   └── schema.prisma          # Databasmodeller
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin-panel
│   │   │   ├── artiklar/      # Artikelhantering (CRUD)
│   │   │   ├── artiklar-ai/   # AI-artikelgenerering
│   │   │   ├── anvandare/     # Användarhantering
│   │   │   ├── kategorier/    # Kategorihantering
│   │   │   └── dashboard/     # Statistik och visualisering
│   │   ├── artiklar/          # Artikelvisning
│   │   │   └── [slug]/        # Dynamisk artikelsida
│   │   ├── el/                # Elprisinformation
│   │   ├── kategori/          # Kategorifiltrering
│   │   ├── mina-sidor/        # Användarinställningar
│   │   ├── prenumeration/     # Stripe checkout
│   │   └── sok/               # Sökfunktionalitet
│   ├── components/            # React-komponenter
│   │   ├── Admin/             # Admin-specifika komponenter
│   │   ├── articles/          # Artikelkomponenter
│   │   ├── dashboard/         # Dashboard-komponenter
│   │   ├── Forms/             # Formulär (Login, Signup, Contact)
│   │   ├── layout/             # Layout-komponenter
│   │   └── ui/                # Återanvändbara UI-komponenter
│   ├── lib/
│   │   ├── actions/            # Server Actions
│   │   ├── auth.ts             # Better Auth-konfiguration
│   │   ├── server-auth.ts      # Server-side auth utilities
│   │   ├── prisma.ts           # Prisma client
│   │   └── schema/             # Zod-scheman
│   └── types/                  # TypeScript-typdefinitioner
├── public/                     # Statiska tillgångar
└── package.json
```

### Viktiga filer

- `prisma/schema.prisma` – databasschema med PostgreSQL-provider
- `src/lib/prisma.ts` – Prisma Client singleton-instans
- `src/lib/auth.ts` – Better Auth server-konfiguration
- `src/lib/client/auth-client.ts` – Better Auth-client för React
- `src/lib/server-auth.ts` – Server-side auth middleware
- `src/lib/actions/` – Server Actions för backend-logik

---

## Arkitektur

### Server Actions

Projektet använder genomgående **Server Actions** för all backend-logik:

- Alla filer i `src/lib/actions/` markerade med `"use server"`
- Typsäker kommunikation mellan klient och server
- Optimerad prestanda med automatisk caching

**Exempel på Server Actions:**

- `admin.ts` – administratörsoperationer
- `category.ts` – kategorihantering
- `comment.ts` – kommentarsfunktionalitet
- `contact-actions.ts` – kontaktformulär
- `email-actions.ts` – e-postverifiering
- `mail.ts` – e-postutskick med Nodemailer
- `profile.ts` – användarprofilhantering
- `weather.ts` – väderdata
- `weather-location.ts` – lokaliseringsfunktioner

### Autentisering & auktorisering

- Better Auth med custom plugin för Stripe
- E-postverifiering vid registrering
- Rollbaserad åtkomstkontroll (Admin, Editor, User)
- Sessionshantering med säker token-lagring
- Server-side middleware för skyddade routes

### Databasmodeller (Prisma)

```
- Article (med premium- och editorsChoice-flaggor)
- Category (med showInNavbar-konfiguration)
- User (med roller, Stripe-integration, emailVerified)
- Comment
- Order & OrderItem
- Session & Account
- PasswordResetToken
```

---

## Funktionalitet

### Användarfunktioner

- Registrering med e-postverifiering
- Inloggning/utloggning
- Profilhantering (namn, e-post, lösenord)
- Prenumeration via Stripe
- Kommentera artiklar
- Sök artiklar
- Dark/light mode
- Läsa premium-innehåll (kräver prenumeration)

### Admin-/editorfunktioner

<p align="center">
  <img src="./public/screenshot-adminartiklar.png" alt="Admin artiklar - screenshot" style="max-width:100%;height:auto;border-radius:6px;" />
</p>

- Skapa, redigera och ta bort artiklar
- AI-assisterad artikelgenerering med Gemini
- MDX-editor för rich text-innehåll
- Kategorihantering med navbar-visning
- Användarhantering med rollfördelning
- Statistik och dashboard med visualiseringar
- Editor's Choice-markering
- Premium content-flaggning
- Användarhantering

### Innehållspresentation

<p align="center">
  <img src="./public/screenshot-slug.png" alt="Artikelvy / slug - exempel" style="max-width:100%;height:auto;border-radius:6px;" />
</p>

- Responsiva artikelkort
- Karuseller för utvalt innehåll
- Kategoribaserad navigering
- SEO-optimerade URL:er med sluggar
- Markdown-formaterat innehåll
- Artikelvyer och statistik

### Integrationer

- **Stripe** – prenumerationer och betalningar
- **Gemini AI** – innehållsgenerering med Google Search
- **Spotprices API** – elpriser för svenska elområden
- **SMHI** – väderdata för Sverige
- **Nodemailer** – e-postkommunikation

---

## Distribution

Projektet är kompatibelt med plattformar som:

- **Vercel** – rekommenderad för Next.js-projekt
- **Railway** – med PostgreSQL-databas
- **Render** – fullstack hosting
- Andra plattformar med stöd för Next.js och PostgreSQL

### Deployment-checklista

1. Konfigurera alla miljövariabler i målmiljön
2. Säkerställ att `BETTER_AUTH_SECRET` är unik och säker (minst 32 tecken)
3. Uppdatera `BETTER_AUTH_URL` till produktions-URL
4. Använd produktionsnycklar för Stripe
5. Kör databasmigreringar i produktionsmiljön: `npx prisma migrate deploy`
6. Generera Prisma Client: `npx prisma generate`
7. Testa autentisering, prenumerationsflöden och AI-funktionalitet
8. Konfigurera SMTP för e-postleverans

### Vercel-specifikt

```bash
# Installera Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sätt miljövariabler
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
# ... och resten av variablerna
```

---

## Felsökning

### Vanliga problem

**Typfel efter schemaändringar**

```bash
npx prisma generate
```

**Autentiseringsfel**

- Kontrollera att `BETTER_AUTH_SECRET` är korrekt angiven i `.env`
- Verifiera att `BETTER_AUTH_URL` matchar din miljö
- Kontrollera att Stripe-nycklar matchar rätt miljö (test/produktion)

**Databasanslutning**

- Verifiera `DATABASE_URL` i `.env`
- Kontrollera att PostgreSQL-servern kör
- Testa anslutningen: `npx prisma db pull`
- Kontrollera att migreringar/schema är synkat: `npx prisma migrate status`

**E-postleverans**

- Testa SMTP-uppgifter med ett verktyg som Ethereal Email
- Kontrollera att `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` är korrekta
- Verifiera att brandväggen tillåter utgående SMTP-trafik

**AI-generering fungerar inte**

- Kontrollera att `GOOGLE_GENERATIVE_AI_API_KEY` är korrekt
- Verifiera API-nyckelns behörigheter och kvoter
- Kontrollera nätverksanslutningen till Google AI API

**Build-fel**

```bash
# Rensa cache och bygg om
rm -rf .next
npm run build
```

**Lint-varningar**

```bash
npm run lint
```

---

## Kontakt

För frågor, samarbeten eller support, kontakta utvecklarna:

**Utvecklingsteam:**

- **Josefine** – UX/UI, autentisering och projektledning
- **Johan** – e-postfunktionalitet och verifiering
- **Magui** – backend och betalningsintegration
- **Ahmed** – AI-integration och externa API:er

**Institution:** Lexicon i Linköping

---

## Sammanfattning

Dagens Dos demonstrerar moderna webbutvecklingstekniker med:

- **Server-first arkitektur** med Server Actions och Server Components
- **Typsäkerhet** genom TypeScript och Zod-validering
- **Skalbar autentisering** med Better Auth och rollbaserad åtkomstkontroll
- **AI-integration** för innehållsgenerering med Gemini
- **Betalningshantering** med Stripe
- **Optimerad användarupplevelse** med responsiv design och dark mode
- **SEO-optimering** med dynamiska routes och metadata

Tack för att du använder Dagens Dos.
