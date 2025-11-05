# News Gamma — projektöversikt

Detta repository innehåller en Next.js-applikation (App Router) skriven i TypeScript. Projektet använder Prisma som ORM och PostgreSQL som enda databas. Autentisering hanteras av Better Auth tillsammans med Pris­ma‑adaptern.

I korthet:

- Frontend: Next.js (App Router) + React
- Backend/data: Prisma + PostgreSQL
- Autentisering: Better Auth (Prisma-adapter)

## Viktiga filer och platser

- `prisma/schema.prisma` — Prisma schema och modeller. Provider är `postgresql` och `url` hämtas från `DATABASE_URL`.
- `src/lib/prisma.ts` — Prisma Client-instans som används i appen.
- `src/lib/auth.ts` — Better Auth-konfiguration (använder `prismaAdapter(prisma, { provider: 'postgresql' })`).
- `src/app/api/auth/[...all]/route.ts` — Next.js route som exponerar Better Auth endpoints via `toNextJsHandler`.
- `src/lib/auth-client.ts` — Better Auth client för use i React-komponenter.
- `src/lib/server-auth.ts` — Serverhjälpare för att läsa session och kräva admin/user.

## Miljövariabler (.env)

Skapa en `.env` i projektets rot (lägg inte upp den i git). Minimikonfiguration för lokal utveckling:

```
DATABASE_URL="postgresql://<dbuser>:<password>@<host>:<port>/<database>"
BETTER_AUTH_SECRET="en-lång-slumpmässig-och-hemlig-sträng"
```

Exempel som redan finns i repo (byt lösenord i praktiken):

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/news-gamma"
BETTER_AUTH_SECRET="SUPERHEMLIGKOD"
```

Förklaring:

- `DATABASE_URL` — Anslutningssträngen till din PostgreSQL-databas.
- `BETTER_AUTH_SECRET` — Secret som Better Auth använder för signering av tokens och sessionsdata. Håll den hemlig i produktion.

Obs: Om du kör i en molnplattform eller CI, använd plattformens secure env/secret storage.

## Installation och vanliga kommandon (PowerShell)

Installera beroenden:

```powershell
npm install
```

Generera Prisma Client (behövs efter schemaändringar):

# News Gamma

Detta repository innehåller en nyhetsapplikation byggd med Next.js (App Router) och TypeScript. Projektet är utvecklat som ett grupparbete av Josefine, Johan, Magui och Ahmed på Lexicon i Linköping.

README:n nedan förklarar projektets syfte, teknikval, hur du kommer igång lokalt, samt viktiga platser i koden.

## Kort översikt

- Modern React-app byggd med Next.js (App Router)
- TypeScript för typesäkerhet
- Prisma som ORM mot PostgreSQL
- Autentisering och användarhantering via Better Auth
- Prenumerationsbetalningar hanteras genom Stripe-integration ("better-auth/stripe" används i projektet)

Huvudmål: en responsiv nyhetssajt med stöd för användarautentisering, prenumerationer och ett administrationsgränssnitt.

## Författare och credits

- Josefine
- Johan
- Magui
- Ahmed

Projektet skapades vid Lexicon i Linköping.

## Teknikstack

- Next.js (App Router) — server-rendering, routing och API-routes
- React 19 + TypeScript
- Prisma + PostgreSQL — datalager
- Tailwind CSS (PostCSS) — stilramverk
- Better Auth — autentisering / sessionshantering
- Stripe — betalningar/prenumerationer
- Diverse komponent- och verktygsbibliotek: Radix, Sonner, Recharts etc.

Se `package.json` för fullständig lista över beroenden.

## Projektstruktur (viktiga mappar)

- `src/app/` — Next.js app-rutter och sidor
- `src/components/` — återanvändbara UI-komponenter och layout
- `src/lib/` — klient- och serverlogik (auth, prisma, helpers)
- `prisma/` — Prisma-schema och migrations
- `public/` — statiska tillgångar (bilder, ikoner)

## Förutsättningar

- Node.js (rekommenderat: 18+)
- npm eller annan Node-paketmotsvarighet
- PostgreSQL-databas (lokalt eller i molnet)

## Miljövariabler

Skapa en `.env` i projektets rot (lägg aldrig upp känsliga värden i git). Minsta variabler som vanligtvis behövs:

- `DATABASE_URL` — Prisma/DB-anslutning (PostgreSQL)
- `BETTER_AUTH_SECRET` — secret för Better Auth
- `STRIPE_SECRET_KEY` — Stripe sekretessnyckel (för prenumerationer)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe public key för klienten

Exempel (byt ut mot egna värden):

```powershell
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/news-gamma"
BETTER_AUTH_SECRET="en-lång-slumpmässig-och-hemlig-strang"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Tips: Kontrollera källkoden i `src/lib/` för eventuella ytterligare miljövariabler som projektet läser.

## Installation och körning (lokalt, PowerShell)

1. Installera beroenden:

```powershell
npm install
```

## E-post / Nodemailer

Projektet innehåller `nodemailer` som kan användas för att skicka e-post (t.ex. för kontaktformulär, verifiering och återställning av lösenord). Nedan följer vanliga miljövariabler och ett enkelt exempel på hur man konfigurerar och använder Nodemailer i serverkod.

Vanliga miljövariabler (lägg till i din `.env`):

```powershell
# SMTP-inställningar
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false" # true om du använder port 465
SMTP_USER="smtp-user@example.com"
SMTP_PASS="smtp-password"
EMAIL_FROM="Dagens Dos <no-reply@example.com>"
```

Enkla exempel (Node / TypeScript) — serverkod (t.ex. `src/lib/mail.ts`):

```ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true för port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}
```

Testa lokalt utan en riktig SMTP-server:

- Ethereal (https://ethereal.email/) ger ett gratis testkonto och en URL för att se e-postmeddelanden under utveckling. Nodemailer har stöd för `createTestAccount()` och `getTestMessageUrl()`.
- För Gmail: använd app-lösenord (eller OAuth) och kontrollera säkerhetsinställningar.

Tips: placera e-post-funktionalitet i serverkod (Next.js API routes eller i `src/lib/`) så att lösenord och SMTP-uppgifter aldrig exponeras i klienten.

2. Generera Prisma Client (efter schemaändringar eller första gång):

```powershell
npx prisma generate
```

3. Kör migrationer (utveckling):

```powershell
npx prisma migrate dev --name init
```

4. Starta utvecklingsservern:

```powershell
npm run dev
```

Bygg och starta i produktion:

```powershell
npm run build
npm start
```

Vanliga NPM-skript finns i `package.json` (t.ex. `dev`, `build`, `start`, `lint`).

## Snabbtest / sanity checks

- Besök `http://localhost:3000/` för att se startsidan.
- Registrera en användare via `/registrera` och logga in via `/logga-in`.
- Kontrollera att tabeller skapas i din databas när du kör migrationer.
- Verifiera prenumerationsflödet (Stripe) i testläge innan produktion.

## Arkitektur & viktiga implementationer

- Autentisering: `src/lib/auth-client.ts` och `src/lib/auth.ts` innehåller klient- respektive serverlogik för Better Auth.
- Prisma: `prisma/schema.prisma` definierar datamodeller; Prisma Client används i `src/lib/prisma.ts`.
- Prenumerationer: projektet använder ett Stripe-integration (via better-auth/stripe) för att skapa/hantera prenumerationer och uppgraderingar.

## Felsökning och tips

- Kör `npx prisma generate` om du ser typerelaterade fel efter att ha uppdaterat Prisma-schema.
- Kontrollera att `BETTER_AUTH_SECRET` och Stripe-nycklar är korrekt angivna i `.env`.
- Använd `npm run lint` för att hitta kodstil- och ESLint-varningar.

## Bidra

1. Forka repo och skapa en branch för din förändring.
2. Kör tester (om sådana finns) och lint.
3. Skicka en pull request med en kort beskrivning av vad som ändrats.

Kontakta projektets ägare (se nedan) om du vill diskutera större förändringar.

## Distribution

- Projektet är kompatibelt med plattformar som Vercel eller annan hosting som stödjer Next.js.
- Säkerställ att alla miljövariabler är konfigurerade i målmiljön (t.ex. Vercel Environment Variables).

## Licens

Ingen licensfil ingår i detta repo i nuläget. Lägg till en `LICENSE` om ni vill publicera projektet under en öppen licens (t.ex. MIT).

## Kontakt

För frågor, samarbeten eller support, kontakta gärna någon av projektets utvecklare:

- Josefine
- Johan
- Magui
- Ahmed

Lexicon i Linköping

---

Tack för att du använder och bidrar till projektet. Om du vill att jag justerar README:n (t.ex. lägga till mer detaljer om deployment, CI, eller miljövariabler) så gör jag det gärna.
